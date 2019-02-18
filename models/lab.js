'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LabSchema = Schema({
    name: String,
    description: String,
    course: {type: Schema.ObjectId, ref: 'Course'}
});

module.exports = mongoose.model('Lab', LabSchema);