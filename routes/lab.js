/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/18/2019
    *   DESC: Class for lab's routes.
    *   LICENSE: CLOSED - SOURCE
*/

'use strict'
var express = require('express');
var api = express.Router();

var controller = require('../controllers/lab');
var mdAuth = require('../middlewares/authenticated');

// CRUD Default
api.post('/lab', mdAuth.ensureAuth, controller.createLab);
api.put('/lab/:id', mdAuth.ensureAuth, controller.updateLab);
api.delete('/lab/:id', mdAuth.ensureAuth, controller.deleteLab);

// Misc
/*
    *   3.      Attach course to lab.
    *   4.      Detach course from lab.
*/
api.get('/lab', mdAuth.ensureAuth, controller.getLabs);
api.get('/lab/:id', mdAuth.ensureAuth, controller.getLab);

// ID: Course id
// requires: lab._id 
api.post('/course/lab/add/:id', mdAuth.ensureAuth, controller.addCourse);
api.delete('/course/lab/del/:id', mdAuth.ensureAuth, controller.deleteCourse);

module.exports = api;