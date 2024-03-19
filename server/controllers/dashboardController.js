const Note = require('../models/notes');
const mongoose = require('mongoose');
//get dashboard
exports.dashboard = async (req, res) => {
  let perPage = 12;
  let page = req.query.page || 1;

  const locals = {
    title: 'Dashboard',
    description: 'NodeJs Notes App',
  };

  try {
    const notes = await Note.aggregate([
      { $sort: { createdAt: -1 } },
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      },
      { $skip: (page - 1) * perPage },
      { $limit: perPage },
      ])
    .exec(); 
    
    //const notes = await Note.find({ user: userId });
    const user_notes = await Note.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) }}
    ])
    .exec();
    const count = user_notes.length;
    //console.log(count);

    res.render('dashboard/index', {
      userName: req.user.firstName,
      notes,
      locals,
      layout: './layouts/dashboard',
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
  }

};

exports.dashboardViewNote = async (req, res) => {

  const note = await Note.findOne({
    _id: req.params.id,
    user: new mongoose.Types.ObjectId(req.user.id)
  });

  if (note && (note.user == req.user.id)) {
    res.render("dashboard/view-note", {
      noteID: req.params.id,
      note,
      layout: "../views/layouts/dashboard",
    });
  } else {
    res.send("Something went wrong.");
  }
};

exports.dashboardUpdateNote = async (req, res) => {
  try {
    //console.log(req.body.title);
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, body: req.body.body, content: req.body.content },
      { new: true }
    ).where({ user: new mongoose.Types.ObjectId(req.user.id) });

    if (updatedNote) {
      res.redirect("/dashboard");
    }
    

  } catch (error) {
    console.log(error);
  }
};

exports.dashboardDeleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.deleteOne({ _id: req.params.id, user: new mongoose.Types.ObjectId(req.user.id)});

    // Check if a document was deleted (deletedCount property)
    if (deletedNote.deletedCount === 1) {
      console.log("Note deleted successfully!");
    } else {
      console.log("No note found with that ID and user.");
    }

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

exports.dashboardAddNote = async (req, res) => {
  res.render("dashboard/add", {
    layout: "../views/layouts/dashboard",
  });
};

exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    const { title, body } = req.body;
    const user = req.user.id;
    await Note.create({ user, title, body });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

exports.dashboardSearch = async (req, res) => {
  try {
    res.render("dashboard/search", {
      searchResults: "",
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {}
};

exports.dashboardSearchSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const searchResults = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
      ],
    }).where({ user: req.user.id });

    res.render("dashboard/search", {
      searchResults,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};