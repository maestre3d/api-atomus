'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MaterialSchema = Schema({
    name: String,
    description: String,
    capacity: String,
    type: String,
    stock: Number,
    image: String
});

module.exports = mongoose.model('Material', MaterialSchema);