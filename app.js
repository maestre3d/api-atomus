/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/17/2019
    *   DESC: App Class for API's management.
    *   LICENSE: CLOSED - SOURCE
*/

'use strict'
var express = require('express');
var bodyParser = require('body-parser');

// Routes
var userRoutes = require('./routes/user.js');
var teacherRoutes = require('./routes/teacher');
var materialRoutes = require('./routes/material');
var courseRoutes = require('./routes/course');
var practiceRoutes = require('./routes/practice');
var labRoutes = require('./routes/lab');
var orderRoutes = require('./routes/order');
var banRoutes = require('./routes/ban');
var adminRoutes = require('./routes/admin');

var app = express();

// Config body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Config HTTP Headers

// CORS
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Athorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

// Use routes
app.use('/api', userRoutes);
app.use('/api', teacherRoutes);
app.use('/api', materialRoutes);
app.use('/api', courseRoutes);
app.use('/api', practiceRoutes);
app.use('/api', labRoutes);
app.use('/api', orderRoutes);
app.use('/api', banRoutes);
app.use('/api', adminRoutes);

module.exports = app;