'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LabSchema = Schema({
    name: String,
    description: String
});

module.exports = mongoose.model('Lab', LabSchema);