/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/17/2019
    *   DESC: Service Class for JWT Token creation.
    *   LICENSE: CLOSED - SOURCE
*/

'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'secret_pass';

exports.createToken = function (user) {
    var payload;

    // Creates student's token
    if(user.grade){
        payload = {
            _id: user._id,
            username: user.username,
            password: user.password,
            name: user.name,
            surname: user.surname,
            grade: user.grade,
            image: user.image,
            iat: moment().unix(),
            exp: moment().add(1, 'days').unix()
        };
    }
    // Creates admin's token
    else if(!user.grade && user.role){
        payload = {
            _id: user._id,
            username: user.username,
            password: user.password,
            name: user.name,
            surname: user.surname,
            image: user.image,
            role: user.role,
            iat: moment().unix(),
            exp: moment().add(10, 'days').unix()
        };
    }
    // Creates teacher's token
    else{
        payload = {
            _id: user._id,
            username: user.username,
            password: user.password,
            name: user.name,
            surname: user.surname,
            image: user.image,
            iat: moment().unix(),
            exp: moment().add(10, 'days').unix()
        };
    }

    return jwt.encode(payload, secret);
}