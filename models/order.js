'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = Schema({
    reqDate: Number,
    expDate: Number,
    user: {type: Schema.ObjectId, ref: 'User'},
    practice: {type: Schema.ObjectId, ref: 'Practice'},
    material: [{type: Schema.ObjectId, ref: 'Material'}]
});

module.exports = mongoose.model('Order', OrderSchema);