'use strict'

var express = require('express');
var api = express.Router();
var controller = require('../controllers/material');
var mdAuth = require('../middlewares/authenticated');
// Imports upload
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/materials/'});

// CRUD Default
api.post('/material', mdAuth.ensureAuth, controller.newMaterial);
api.put('/material/:id', mdAuth.ensureAuth, controller.updateMaterial);
api.delete('/material/:id', mdAuth.ensureAuth, controller.deleteMaterial);

// Uploaders
api.post('/material/upload/:id', [mdAuth.ensureAuth, md_upload], controller.uploadImage);
api.get('/material/pic/:imageFile', mdAuth.ensureAuth, controller.getImageFile);

// Misc
api.get('/material', mdAuth.ensureAuth, controller.getMaterials);
api.get('/material/:id', mdAuth.ensureAuth, controller.getMaterial);

module.exports = api;