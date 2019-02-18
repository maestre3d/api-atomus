'use strict'

var express = require('express');
var api = express.Router();
var controller = require('../controllers/practice');
var mdAuth = require('../middlewares/authenticated');
// Imports upload
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/practices/'});

// CRUD Default
api.post('/practice', mdAuth.ensureAuth, controller.newPractice);
api.put('/practice/:id', mdAuth.ensureAuth, controller.updatePractice);
api.delete('/practice/:id', mdAuth.ensureAuth, controller.deletePractice);

// Uploaders
api.post('/practice/upload/:id', [mdAuth.ensureAuth, md_upload], controller.uploadFile);
api.get('/practice/file/:docFile', mdAuth.ensureAuth, controller.getFile);

// Misc
api.post('/practice/:id', mdAuth.ensureAuth, controller.addMaterial);
api.post('/practice/materials/:id', mdAuth.ensureAuth, controller.addMaterials);
api.get('/practice', mdAuth.ensureAuth, controller.getNonExp);
api.get('/practice/exp', mdAuth.ensureAuth, controller.getExp);
api.get('/practice/all', mdAuth.ensureAuth, controller.getPractices);
api.get('/practice/:id', mdAuth.ensureAuth, controller.getPractice);

module.exports = api;