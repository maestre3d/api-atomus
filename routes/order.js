/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/19/2019
    *   DESC: Class for order's routes.
    *   LICENSE: CLOSED - SOURCE
*/

'use strict'
var express = require('express');
var api = express.Router();

var controller = require('../controllers/order');
var mdAuth = require('../middlewares/authenticated');

// CRUD Default
api.post('/order', mdAuth.ensureAuth, controller.createOrder);
api.delete('/order/:id', mdAuth.ensureAuth, controller.removeOrder);

// Misc
/*
    *   3.          Get all active user's orders.
    *   4.          Get all expired user's orders.
*/
api.get('/order', mdAuth.ensureAuth,controller.getOrders);
api.get('/order/:id', mdAuth.ensureAuth, controller.getOrder);


api.get('/user/order/:id', mdAuth.ensureAuth, controller.getUserOr);
api.get('/user/order-exp/:id', controller.getUserExp);

module.exports = api;