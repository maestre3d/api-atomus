'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    username:       String,
    name:           String,
    surname:        String,
    grade:          Number,
    password:       String,
    image:          String,
    course:         [{ type : Schema.ObjectId, ref : 'Course'}]
});

module.exports = mongoose.model('User', UserSchema);