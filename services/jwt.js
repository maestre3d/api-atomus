'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'secret_pass';

exports.createToken = function (user) {
    var payload = {
        _id: user._id,
        username: user.username,
        password: user.password,
        name: user.name,
        surname: user.surname,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix()
    };

    return jwt.encode(payload, secret);
}