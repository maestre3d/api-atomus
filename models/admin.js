'use strict'

var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema = Schema({
    username:   String,
    name:       String,
    surname:    String,
    password:   String,
    image:      String,
    role:       String
});

module.exports = mongoose.model('Admin', AdminSchema);