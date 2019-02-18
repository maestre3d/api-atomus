'use strict'

var express = require('express');
var api = express.Router();
var controller = require('../controllers/course');
var mdAuth = require('../middlewares/authenticated');

// CRUD Default
api.post('/course', mdAuth.ensureAuth, controller.newCourse);
api.put('/course/:id', mdAuth.ensureAuth, controller.updateCourse);
api.delete('/course/:id', mdAuth.ensureAuth, controller.deleteCourse);

// Misc
api.get('/course/practice/:id', mdAuth.ensureAuth, controller.getPractices);
api.get('/course', mdAuth.ensureAuth, controller.getCourses);
api.get('/course/:id', mdAuth.ensureAuth, controller.newCourse);

module.exports = api;