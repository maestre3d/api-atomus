'use strict'

var express = require('express');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var controller = require('../controllers/teacher');
// Imports upload
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/teachers/'});

// CRUD Default
api.post('/teacher', controller.newTeacher);
api.post('/teacher/login', controller.logTeacher);
api.put('/teacher/:id', mdAuth.ensureAuth, controller.updateTeacher);
api.delete('/teacher/:id', mdAuth.ensureAuth, controller.deleteTeacher);

// Uploaders
api.post('/teacher/upload/:id', [mdAuth.ensureAuth, md_upload], controller.uploadImage);
api.get('/teacher/pic/:imageFile', controller.getImageFile);

// Misc
api.get('/teacher', mdAuth.ensureAuth, controller.getTeachers);
api.get('/teacher/:id', mdAuth.ensureAuth, controller.getTeacher);

module.exports = api;