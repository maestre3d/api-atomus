'use strict'
// Imports
var bcrypt = require('bcrypt');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

// Model(s)
var Teacher = require('../models/teacher');

// Misc
const apiMsg = 'Server Error.';
const saltRounds = 10;

function newTeacher(req, res){
    var user = new Teacher();
    var params = req.body;

    user.username = params.username;
    user.name = params.name;
    user.surname = params.surname;
    user.image = null;

    if(params.username && params.password){
        bcrypt.hash(params.password, saltRounds, function(err, hash){
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                user.password = hash;
                if(user.name && user.surname){
                    Teacher.findOne({username:user.username}, (err, found)=>{
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
        res.status(400).send({message:"Rellene todos los campos."});
    }
}

function logTeacher(req, res){
    var params = req.body;
    var hash;

    var username = params.username;
    var password = params.password;

    if(params.username && params.password){
        Teacher.findOne({username:username}, (err, user)=>{
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
        res.status(400).send({message:"Rellene todos los campos."});
    }
}

function updateTeacher(req, res){
    var userId = req.params.id;
    var user = req.body;

    if(userId != req.user._id){
        return res.status(401).send({message:"Acceso denegado."});
    }


    Teacher.findOne({username:user.username}, (err, found)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!found){
                Teacher.findByIdAndUpdate(userId, user, (err, updated)=>{
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
                res.status(400).send({message:"Usuario ya creado."});
            }
        }
    });
}

function deleteTeacher(req, res){
    var userId = req.params.id;

    Teacher.findByIdAndRemove(userId, (err, deleted)=>{
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

function getTeachers(req, res){
    Teacher.find((err, users)=>{
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

function getTeacher(req, res){
    var userId = req.params.id;

    Teacher.findById(userId, (err, found)=>{
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

function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'Sin subir.';

    if(req.files){
        var path_file = './uploads/teachers/';
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        Teacher.findById(userId, (err, found)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(!found){
                    res.status(404).send({message:"Usuario no encontrado."});
                }else{
                    path_file = path_file + found.image;
                    if( file_ext === 'png' || file_ext === 'jpg' || file_ext === 'jpeg' ){
                        Teacher.findByIdAndUpdate(userId, {image:file_name},(err, updated)=>{
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

function getImageFile(req, res){
    var imageFile = req.params.imageFile;

    var path_file = './uploads/teachers/' + imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message:"Archivo no encontrado."});
        }
    });
}

module.exports = {
    newTeacher,
    logTeacher,
    updateTeacher,
    deleteTeacher,
    getTeachers,
    getTeacher,
    uploadImage,
    getImageFile
};