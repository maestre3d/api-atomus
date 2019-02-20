'use strict'
var express = require('express');
var api = express.Router();
var controller = require('../controllers/order');
var mdAuth = require('../middlewares/authenticated');
// CRUD Default
api.post('/order', mdAuth.ensureAuth, controller.createOrder);
api.delete('/order/:id', mdAuth.ensureAuth, controller.removeOrder);

// Misc
api.get('/order', mdAuth.ensureAuth,controller.getOrders);
api.get('/order/:id', mdAuth.ensureAuth, controller.getOrder);
api.get('/order/user/:id', mdAuth.ensureAuth, controller.getUserOr);

module.exports = api;