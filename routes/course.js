/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/20/2019
    *   DESC: Class for course's routes.
    *   LICENSE: CLOSED - SOURCE
*/

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
//      3.      Get all course's practices.
api.get('/course', mdAuth.ensureAuth, controller.getCourses);
api.get('/course/:id', mdAuth.ensureAuth, controller.getCourse);

api.get('/course/practice/:id', mdAuth.ensureAuth, controller.getPractices);

module.exports = api;