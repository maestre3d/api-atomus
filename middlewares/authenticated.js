/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/17/2019
    *   DESC: Middleware Class for JWT Auth validation.
    *   LICENSE: CLOSED - SOURCE
*/

'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'secret_pass';

exports.ensureAuth = function(req, res ,next) {
    if(!req.headers.authorization){
        return res.status(403).send({message:"Se require iniciar sesión."});
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try{
        var payload = jwt.decode(token, secret);
        //console.log(moment.unix(payload.exp).format('dddd, MMMM DD, YYYY h:mm:ss A'));
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message:"Credenciales expiradas."});
        }

    }catch(ex){
        if(ex.message === 'Token expired'){
            return res.status(404).send({message:"Credenciales expiradas."});
        }else{
            return res.status(404).send({message:"Token no válido."});
        }
    }

    req.user = payload;

    next();

}