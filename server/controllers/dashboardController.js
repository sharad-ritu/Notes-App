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
      { $sort: { updatedAt: -1 } },
      { $match: { user: req.user.id } },
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

    const count = await Note.countDocuments({ user: req.user.id });

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
