/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/20/2019
    *   DESC: Class to forbid students of log.
    *   LICENSE: CLOSED - SOURCE
*/

'use strict'
// Imports
var moment = require('moment');

// Model(s)
var Ban = require('../models/ban');
var Order = require('../models/order');

// Misc
const apiMsg = 'Server Error.';

// Creates ban
// requires: user_id, order_id
function createBan(req, res){
    var ban = new Ban();
    var params = req.body;

    if(!req.user.role){
        return res.status(403).send({message:"Acceso denegado."});
    }

    ban.comment = null;

    if(params.comment){
        ban.comment = params.comment;
    }

    ban.type = params.type;
    ban.postDate = moment().unix();
    ban.order = params.order;

    if(ban.type && ban.order){
        Order.findById(ban.order, (err, order)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(!order){
                    res.status(400).send({message:"Orden/Usuario inválidos."});
                }else{
                    ban.user = order.user._id;
                    Ban.findOne({user: ban.user}, (err, user)=>{
                        if(err){
                            res.status(500).send({message:apiMsg});
                        }else{
                            if(user){
                                res.status(400).send({message:"Usuario ya ha sido vetado."});
                            }else{
                                ban.save((err, nBan)=>{
                                    if(err){
                                        res.status(500).send({message:apiMsg});
                                    }else{
                                        if(!nBan){
                                            res.status(404).send({message:"Error al vetar."});
                                        }else{
                                            res.status(200).send(nBan);
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }else{
        res.status(400).send({message:"Datos inválidos."});
    }

}

// Updates ban
function updateBan(req, res){
    var banId = req.params.id;
    var ban = req.body;

    if(!req.user.role){
        return res.status(403).send({message:"Acceso denegado."});
    }

    if(ban){
        Ban.findByIdAndUpdate(banId, ban, (err, uBan)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(!uBan){
                    res.status(404).send({message:"Error al actualizar."});
                }else{
                    res.status(200).send(uBan);
                }
            }
        });
    }else{
        res.status(400).send({message:"Datos inválidos."});
    }
}

// Removes ban
function removeBan(req, res){
    var banId = req.params.id;

    if(!req.user.role){
        return res.status(403).send({message:"Acceso denegado."});
    }

    Ban.findByIdAndRemove(banId, (err, deBan)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!deBan){
                res.status(404).send({message:"Error al eliminar."});
            }else{
                res.status(200).send(deBan);
            }
        }
    })
}

// Get all bans
function getBans(req, res){

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    Ban.find((err, bans)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!bans){
                res.status(404).send({message:"No se han encontrado vetados."});
            }else{
                res.status(200).send(bans);
            }
        }
    });
}

// Get baned
function getBan(req, res){
    var banId = req.params.id;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    Ban.findById(banId, (err, ban)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!ban){
                res.status(404).send({message:"No se ha encontrado vetado."});
            }else{
                res.status(200).send(ban);
            }
        }
    });
}

module.exports = {
    createBan,
    updateBan,
    removeBan,
    getBan,
    getBans
};