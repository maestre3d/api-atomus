'use strict'
// Imports
var moment = require('moment');

// Model(s)
var Ban = require('../models/ban');
var Order = require('../models/order');

// Misc
const apiMsg = 'Server Error.';

function createBan(req, res){
    var ban = new Ban();
    var params = req.body;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    ban.comment = null;

    if(params.comment){
        ban.comment = params.comment;
    }

    ban.type = params.type;
    ban.postDate = moment().toISOString();
    ban.user = params.user;
    ban.order = params.order;

    if(ban.type && ban.user && ban.order){
        Order.findOne({$and: [{_id: ban.order}, {user: ban.user}]}, (err, order)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(!order){
                    res.status(400).send({message:"Orden/Usuario inválidos."});
                }else{
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

function updateBan(req, res){
    var banId = req.params.id;
    var ban = req.body;

    if(req.user.grade){
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

function removeBan(req, res){
    var banId = req.params.id;

    if(req.user.grade){
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

function getBan(req, res){
    var banId = req.params.id;

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