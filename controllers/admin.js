/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/20/2019
    *   DESC: Class to manage admins.
    *   LICENSE: CLOSED - SOURCE
*/

'use strict'
// Imports
var bcrypt = require('bcrypt');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

// Model(s)
var Admin = require('../models/admin');

// Misc
// Secret: Auth method to avoid intruders
const apiMsg = 'Server Error.';
const secret = 'secret_pass';
const saltRounds = 10;

// Creates new admin
function newAdmin(req, res){
    var user = new Admin();
    var params = req.body;

    user.username = params.username;
    user.name = params.name;
    user.surname = params.surname;
    user.role = 'ROLE_ADMIN';
    user.image = null;

    if(params.verify === secret){
        if(params.username && params.password){
            bcrypt.hash(params.password, saltRounds, function(err, hash){
                if(err){
                    res.status(500).send({message:apiMsg});
                }else{
                    user.password = hash;
                    if(user.name && user.surname){
                        Admin.findOne({username:user.username}, (err, found)=>{
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
                        res.status(404).send({message:"Inserte todos los campos."});
                    }
                }
            });
        }else{
            res.status(400).send({message:"Inserte todos los campos."});
        }
    }else{
        res.status(403).send({message:"Acceso denegado."});
    }
}

// Admin's login
function logAdmin(req, res){
    var params = req.body;
    var hash;

    var username = params.username;
    var password = params.password;

    if(params.username && params.password){
        Admin.findOne({username:username}, (err, user)=>{
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
        res.status(400).send({message:"Inserte todos los campos."});
    }
}

// Updates admin
function updateAdmin(req, res){
    var userId = req.params.id;
    var user = req.body;

    if(userId != req.user._id){
        return res.status(401).send({message:"Acceso denegado."});
    }

    Admin.findOne({username:user.username}, (err, found)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!found){
                if(user.password){
                    bcrypt.hash(user.password, saltRounds, function(err, hash){
                        if(err){
                            res.status(500).send({message:apiMsg});
                        }else{
                            user.password = hash;
                            Admin.findByIdAndUpdate(userId, user, (err, updated)=>{
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
                        }
                    });
                }else{
                    Admin.findByIdAndUpdate(userId, user, (err, updated)=>{
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
                }
            }else{
                res.status(400).send({message:"Usuario ya creado."});
            }
        }
    });
}

// Removes admin
function deleteAdmin(req, res){
    var userId = req.params.id;

    if(!req.user.role){
        return res.status(403).send({message:"Acceso denegado."});
    }

    Admin.findByIdAndRemove(userId, (err, deleted)=>{
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

// Get all admins
function getAdmins(req, res){
    if(!req.user.role){
        return res.status(403).send({message:"Acceso denegado."});
    }

    Admin.find((err, users)=>{
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

// Get Admin
function getAdmin(req, res){
    var userId = req.params.id;

    if(!req.user.role){
        return res.status(403).send({message:"Acceso denegado."});
    }

    Admin.findById(userId, (err, found)=>{
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

// FS: Uploads user's pic
function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'Sin subir.';

    if(req.files){
        var path_file = './uploads/admins/';
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        Admin.findById(userId, (err, found)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(!found){
                    res.status(404).send({message:"Usuario no encontrado."});
                }else{
                    path_file = path_file + found.image;
                    if( file_ext === 'png' || file_ext === 'jpg' || file_ext === 'jpeg' ){
                        Admin.findByIdAndUpdate(userId, {image:file_name},(err, updated)=>{
                            if(err){
                                res.status(500).send({message:apiMsg});
                            }else{
                                if(!updated){
                                    res.status(404).send({message:"Error al subir archivo."});
                                }else{
                                    if(found.image === null){
                                        res.status(200).send(updated);
                                    }else{
                                        fs.unlink(path_file, (err)=>{
                                            if(err){
                                                res.status(500).send({message:"Error al subir archivo."});
                                            }
                                            //console.log('Successfully deleted file.');
                                        });
                                        res.status(200).send(updated);
                                    }
                                }
                            }
                        });
                    }else{
                        res.status(406).send({message:"Extensión de archivo no soportada."});
                    }
                }
            }
        });
    }else{
        res.status(400).send({message:"Archivo no subido."});
    }
}

// Get user's pic
function getImageFile(req, res){
    var imageFile = req.params.imageFile;

    var path_file = './uploads/admins/' + imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message:"Archivo no encontrado."});
        }
    });
}

module.exports = {
    newAdmin,
    logAdmin,
    updateAdmin,
    deleteAdmin,
    getAdmins,
    getAdmin,
    uploadImage,
    getImageFile
};