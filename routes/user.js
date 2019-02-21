/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/17/2019
    *   DESC: Class for user's routes.
    *   LICENSE: CLOSED - SOURCE
*/

'use strict'
var express = require('express');
var api = express.Router();

var mdAuth = require('../middlewares/authenticated');
var controller = require('../controllers/user');
// Imports upload
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users/'});

// CRUD Default
api.post('/user', controller.newUser);
api.post('/login', controller.logUser);
api.put('/user/:id', mdAuth.ensureAuth, controller.updateUser);
api.delete('/user/:id', mdAuth.ensureAuth, controller.deleteUser);

// Uploaders
api.post('/user/upload/:id', [mdAuth.ensureAuth, md_upload], controller.uploadImage);
api.get('/user/pic/:imageFile', controller.getImageFile);

// Misc
/*
    *   1.      Attach course to user.
    *   2.      Detach course from user.
*/
api.get('/user', mdAuth.ensureAuth, controller.getUsers);
api.get('/user/:id', mdAuth.ensureAuth, controller.getUser);

// ID: user_id
// requires: course_id
api.post('/user/course/:id', mdAuth.ensureAuth, controller.addCourse);
api.delete('/user/course/:id', mdAuth.ensureAuth, controller.removeCourse);

module.exports = api;