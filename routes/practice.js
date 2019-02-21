/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/17/2019
    *   DESC: Class for practice's routes.
    *   LICENSE: CLOSED - SOURCE
*/

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
/*
    *   1.      Add material to practice's materials list.
    *   2.      Remove material from practice's materials list.
    *   3.      Get all non expired practice(s).
    *   4.      Get all expired practice(s).
    *   5/6.    Get all/single practice(s).
*/
api.post('/practice/mat/:id', mdAuth.ensureAuth, controller.addMaterial);
api.delete('/practice/mat/:id', mdAuth.ensureAuth, controller.removeMaterial);


api.get('/practice/active', mdAuth.ensureAuth, controller.getNonExp);
api.get('/practice/expired', mdAuth.ensureAuth, controller.getExp);


api.get('/practice', mdAuth.ensureAuth, controller.getPractices);
api.get('/practice/:id', mdAuth.ensureAuth, controller.getPractice);

// Home Feed
//  Get all non expired course's practice(s).
api.get('/home/:id', mdAuth.ensureAuth, controller.getNonExpCourse);

module.exports = api;