'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = Schema({
    name: String,
    grade: Number,
    teacher: {type: Schema.ObjectId, ref: 'Teacher'}
});

module.exports = mongoose.model('Course', CourseSchema);