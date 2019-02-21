/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/17/2019
    *   DESC: Main Class for API Creation.
    *   LICENSE: CLOSED - SOURCE
*/

'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;
// var server = require('http').Server(app);

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/wip_atomus', { useNewUrlParser: true },(err, res)=>{
    if(err){
        console.log("Server error.");
    }else{
        console.log("Connected to DB server.");
        app.listen(port, function(){
            console.log("API REST listening on " + port);
        });
    }
});