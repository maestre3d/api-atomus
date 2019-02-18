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
api.get('/user', mdAuth.ensureAuth, controller.getUsers);
api.get('/user/:id', mdAuth.ensureAuth, controller.getUser);

module.exports = api;