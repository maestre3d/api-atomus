/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/20/2019
    *   DESC: Class for admin's routes.
    *   LICENSE: CLOSED - SOURCE
*/

'use strict'
var express = require('express');
var api = express.Router();

var mdAuth = require('../middlewares/authenticated');
var controller = require('../controllers/admin');
// Imports upload
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/admins/'});

// CRUD Default
api.post('/admin', controller.newAdmin);
api.post('/admin/login', controller.logAdmin);
api.put('/admin/:id', mdAuth.ensureAuth, controller.updateAdmin);
api.delete('/admin/:id', mdAuth.ensureAuth, controller.deleteAdmin);

// Uploaders
api.post('/admin/upload/:id', [mdAuth.ensureAuth, md_upload], controller.uploadImage);
api.get('/admin/pic/:imageFile', controller.getImageFile);

// Misc
api.get('/admin', mdAuth.ensureAuth, controller.getAdmins);
api.get('/admin/:id', mdAuth.ensureAuth, controller.getAdmin);

module.exports = api;