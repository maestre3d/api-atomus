'use strict'

var express = require('express');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var controller = require('../controllers/user');

api.post('/user', controller.newUser);
api.post('/login', controller.logUser);
api.put('/user/:id', mdAuth.ensureAuth, controller.updateUser);
api.delete('/user/:id', mdAuth.ensureAuth, controller.deleteUser);

// Misc
api.get('/user', mdAuth.ensureAuth, controller.getUsers);
api.get('user/:id', mdAuth.ensureAuth, controller.getUser);

module.exports = api;