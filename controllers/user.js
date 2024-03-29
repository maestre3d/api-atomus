/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/18/2019
    *   DESC: Class to manage users/students.
    *   LICENSE: CLOSED - SOURCE
*/

'use strict'
// Imports
var bcrypt = require('bcrypt');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

// Model(s)
var User = require('../models/user');
var Ban = require('../models/ban');

// Misc
const apiMsg = 'Server Error.';
const saltRounds = 10;

// Creates new user/student
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
                                res.status(406).send({message:"Usuario ya ha sido creado."});
                            }
                        }
                    });
                }else{
                    res.status(400).send({message:"Inserte todos los campos."});
                }
            }
        });
    }else{
        res.status(400).send({message:"Inserte todos los campos."});
    }
}

// Student's login
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
                            // Logs correctly
                            Ban.findOne({user: user._id}, (err, banUser)=>{
                                if(err){
                                    res.status(500).send({message:apiMsg});
                                }else{
                                    if(banUser){
                                        res.status(403).send({message:"Usuario vetado.\nContacte a administración académica."});
                                    }else{
                                        if(params.gethash){
                                            res.status(200).send({token:jwt.createToken(user)});
                                        }else{
                                            res.status(200).send(user);
                                        }
                                    }
                                }
                            });
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

// Updates student
function updateUser(req, res){
    var userId = req.params.id;
    var user = req.body;

    if(userId != req.user._id){
        return res.status(401).send({message:"Acceso denegado."});
    }

    if(user.username && !req.user.role){
        return res.status(403).send({message:"Acción inválida."});
    }

    User.findOne({username:user.username}, (err, found)=>{
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
                        }
                    });
                }else{
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
                }
            }else{
                res.status(400).send({message:"Usuario ya creado."});
            }
        }
    });
}

// Deletes student
function deleteUser(req, res){
    var userId = req.params.id;

    if(!req.user.role){
        return res.status(403).send({message:"Acceso denegado."});
    }

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

// Get all students
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

// Get student populating student's courses
function getUser(req, res){
    var userId = req.params.id;
    var find = User.findById(userId);

    find.populate({path:'course'}).exec((err, found)=>{
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

// Attach new course to student
function addCourse(req, res){
    var userId = req.params.id;
    var user = req.body;

    if(user.course){
        User.findOne( {$and: [{course: user.course}, { _id: userId }]} , (err, found)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(found){
                    res.status(400).send({message:"Usuario ya está inscrito al curso."});
                }else{
                    User.findByIdAndUpdate(userId, 
                        ({'course': { '$ne': user.course } }, 
                        {'$addToSet': { 'course': user.course } }), 
                        (err, saved)=>{
                            if(err){
                                res.status(500).send({message:apiMsg});
                            }else{
                                if(!saved){
                                    res.status(404).send({message:"Error al añadir curso."});
                                }else{
                                    res.status(200).send(saved);
                                }
                            }
                    });
                }
            }
        });
    }else{
        res.status(400).send({message:"Valor inválido."});
    }
}

// Detach course from student
function removeCourse(req, res){
    var userId = req.params.id;
    var user = req.body;

    if(user.course){
        User.findOne( {$and: [{course: user.course}, {_id: userId}]}, (err, found)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(!found){
                    res.status(404).send({message:"No se encontró curso."});
                }else{
                    User.findByIdAndUpdate(userId, {$pull:{ 'course': user.course }}, (err, upUser)=>{
                        if(err){
                            res.status(500).send({message:apiMsg});
                        }else{
                            if(!upUser){
                                res.status(404).send({message:"Error al borrar curso."});
                            }else{
                                res.status(200).send(upUser);
                            }
                        }
                    } );
                }
            }
        });
    }else{
        res.status(400).send({message:"Valor inválido."});
    }
}

// FS: Uploads user's pic
function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'Sin subir.';

    if(req.files){
        var path_file = './uploads/users/';
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        User.findById(userId, (err, found)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(!found){
                    res.status(404).send({message:"Usuario no encontrado."});
                }else{
                    path_file = path_file + found.image;
                    if( file_ext === 'png' || file_ext === 'jpg' || file_ext === 'jpeg' ){
                        User.findByIdAndUpdate(userId, {image:file_name},(err, updated)=>{
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

    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message:"Archivo no encontrado."});
        }
    });
}

module.exports = {
    newUser,
    logUser,
    updateUser,
    deleteUser,
    getUsers,
    getUser,
    addCourse,
    removeCourse,
    uploadImage,
    getImageFile
};