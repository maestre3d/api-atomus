'use strict'
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var TeacherSchema = Schema({
    username:       String,
    name:           String,
    surname:        String,
    password:       String,
    image:          String
 });

 module.exports = mongoose.model('Teacher', TeacherSchema);