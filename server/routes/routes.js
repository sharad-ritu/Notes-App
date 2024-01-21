const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers');

//App Controllers
router.get('/', controllers.homePage);
router.get('/about', controllers.aboutPage);

module.exports = router;