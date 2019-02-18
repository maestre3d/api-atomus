'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PracticeSchema = Schema({
    name: String,
    postDate: Date,
    expDate: Number,
    file: String,
    course: {type: Schema.ObjectId, ref: 'Course'},
    material: [{type: Schema.ObjectId, ref: 'Material'}]
});

module.exports = mongoose.model('Practice', PracticeSchema);