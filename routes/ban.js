'use strict'
var express = require('express');
var api = express.Router();
var controller = require('../controllers/ban');
var mdAuth = require('../middlewares/authenticated');

// CRUD Default
api.post('/ban', controller.createBan);
api.put('/ban/:id', controller.updateBan);
api.delete('/ban/:id', controller.removeBan);

// Misc
api.get('/ban', controller.getBans);
api.get('/ban/:id', controller.getBan);

module.exports = api;