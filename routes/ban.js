/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/20/2019
    *   DESC: Class for ban's routes.
    *   LICENSE: CLOSED - SOURCE
*/

'use strict'
var express = require('express');
var api = express.Router();

var controller = require('../controllers/ban');
var mdAuth = require('../middlewares/authenticated');

// CRUD Default
api.post('/ban', mdAuth.ensureAuth, controller.createBan);
api.put('/ban/:id', mdAuth.ensureAuth, controller.updateBan);
api.delete('/ban/:id', mdAuth.ensureAuth, controller.removeBan);

// Misc
api.get('/ban', mdAuth.ensureAuth, controller.getBans);
api.get('/ban/:id', mdAuth.ensureAuth, controller.getBan);

module.exports = api;