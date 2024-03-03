const Note = require('../models/notes');
const mongoose = require('mongoose');
//get dashboard
exports.dashboard = async (req, res) => {
  let perPage = 12;
  let page = req.query.page || 1;
  const userId = req.user.id;

  const locals = {
    title: 'Dashboard',
    description: 'NodeJs Notes App',
  };

  try {
    const notes = await Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: { user: userId } },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      }
      ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec(); 

    const user_notes = await Note.aggregate([
      { $match: { user: userId}}
    ])
    .exec();
    const count = user_notes.length;
    console.log(count);

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
