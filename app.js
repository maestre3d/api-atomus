'use strict'

var express = require('express');
var bodyParser = require('body-parser');

// Routes
var userRoutes = require('./routes/user.js');
var teacherRoutes = require('./routes/teacher');
var materialRoutes = require('./routes/material');
var courseRoutes = require('./routes/course');

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

module.exports = app;