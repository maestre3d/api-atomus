'use strict'
// Imports
var bcrypt = require('bcrypt');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

// Model(s)
var User = require('../models/user');

// Misc
const apiMsg = 'Server Error.';
const saltRounds = 10;

function newUser(req, res){
    var user = new User();
    var params = req.body;

    user.username = params.username;
    user.name = params.name;
    user.surname = params.surname;
    user.grade = params.grade;
    user.image = null;

    if(params.username && params.password){
        bcrypt.hash(params.password, saltRounds, function(err, hash){
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                user.password = hash;
                if(user.name && user.surname && user.grade){
                    User.findOne({username:user.username}, (err, found)=>{
                        if(err){
                            res.status(500).send({message:apiMsg});
                        }else{
                            if(!found){
                                user.save((err, newUser)=>{
                                    if(err){
                                        res.status(500).send({message:apiMsg});
                                    }else{
                                        if(!newUser){
                                            res.status(404).send({message:"Error al crear usuario."});
                                        }else{
                                            res.status(200).send(newUser);
                                        }
                                    }
                                });
                            }else{
                                res.status(406).send({message:"Usuario ya creado."});
                            }
                        }
                    });
                }else{
                    res.status(404).send({message:"Rellene todos los campos."});
                }
            }
        });
    }else{
        res.status(404).send({message:"Rellene todos los campos."});
    }
}

function logUser(req, res){
    var params = req.body;
    var hash;

    var username = params.username;
    var password = params.password;

    if(params.username && params.password){
        User.findOne({username:username}, (err, user)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(user){
                    hash = user.password;
                    bcrypt.compare(password, hash, function(err, logged){
                        if(logged === true){
                            if(params.gethash){
                                res.status(200).send({token:jwt.createToken(user)});
                            }else{
                                res.status(200).send(user);
                            }
                        }else{
                            res.status(404).send({message:"Usuario y/o contraseña incorrectos."});
                        }
                    });
                }else{
                    res.status(404).send({message:"Usuario y/o contraseña incorrectos."});
                }
            }
        });
    }else{
        res.status(404).send({message:"Rellene todos los campos."});
    }
}

function updateUser(req, res){
    var userId = req.params.id;
    var user = req.body;

    User.findOne({username:user.username}, (err, found)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!found){
                User.findByIdAndUpdate(userId, user, (err, updated)=>{
                    if(err){
                        res.status(500).send({message:apiMsg});
                    }else{
                        if(!updated){
                            res.status(404).send({message:"Error al actualizar usuario."});
                        }else{
                            res.status(200).send(updated);
                        }
                    }
                });
            }else{
                res.status(406).send({message:"Usuario ya creado."});
            }
        }
    });
}

function deleteUser(req, res){
    var userId = req.params.id;

    User.findByIdAndRemove(userId, (err, deleted)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!deleted){
                res.status(404).send({message:"Error al borrar usuario."});
            }else{
                res.status(200).send(deleted);
            }
        }
    });
}

function getUsers(req, res){
    User.find((err, users)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!users){
                res.status(404).send({message:"No se encontraron usuarios."});
            }else{
                res.status(200).send(users);
            }
        }
    });
}

function getUser(req, res){
    var userId = req.params.id;

    User.findById(userId, (err, found)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!found){
                res.status(404).send({message:"No se encontró usuario."});
            }else{
                res.status(200).send(found);
            }
        }
    });
}


module.exports = {
    newUser,
    logUser,
    updateUser,
    deleteUser,
    getUsers,
    getUser
};