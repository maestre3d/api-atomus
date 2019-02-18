'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BanSchema = Schema({
    type: String,
    comment: String,
    postDate: Number,
    user: {type: Schema.ObjectId, ref: 'User'},
    order: {type: Schema.ObjectId, ref: 'Order'}
});

module.exports = mongoose.model('Ban', BanSchema);