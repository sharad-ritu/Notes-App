const Note = require('../models/notes');
const mongoose = require('mongoose');
//get dashboard
exports.dashboard = async (req, res) => {
  
  const locals = {
    title: 'Dashboard',
    description: 'NodeJs Notes App',
  };

  try {
    const notes = await Note.find({});

    res.render('dashboard/index', {
      userName: req.user.firstName,
      notes,
      locals,
      layout: './layouts/dashboard',
    });
  } catch (error) {
    console.log(error);
  }

};
