'use strict'
// Imports
var moment = require('moment');
var fs = require('fs');
var path = require('path');

// Model(s)
var Practice = require('../models/practice');
var Course = require('../models/course');

// Misc
const apiMsg = 'Server Error.'

function newPractice(req, res){
    var practice = new Practice();
    var params = req.body;

    practice.name = params.name;
    practice.postDate = moment().toISOString();
    practice.expDate = moment().add(params.expDate, 'days').unix();
    practice.file = null;
    practice.course = params.course;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    if(practice.name && practice.course && practice.expDate){
        Course.findById(practice.course, (err, course)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(!course){
                    res.status(404).send({message:"Curso no encontrado."});
                }else{
                    practice.save((err, newPrac)=>{
                        if(err){
                            res.status(500).send({message:apiMsg});
                        }else{
                            if(!newPrac){
                                res.status(404).send({message:"Error al crear."});
                            }else{
                                res.status(200).send(newPrac);
                            }
                        }
                    });
                }
            }
        });
    }else{
        res.status(404).send({message:"Rellene todos los campos."});
    }
}

function updatePractice(req, res){
    var pracId = req.params.id;
    var practice = req.body;


    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    Practice.findOne({name:practice.name}, (err, found)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(found){
                res.status(404).send({message:"Práctica ya creada."});
            }else{
                Practice.findByIdAndUpdate(pracId, practice, (err, upPrac)=>{
                    if(err){
                        res.status(500).send({message:apiMsg});
                    }else{
                        if(!upPrac){
                            res.status(404).send({message:"Error al actualizar."});
                        }else{
                            res.status(200).send(upPrac);
                        }
                    }
                });
            }
        }
    });
}

function deletePractice(req, res){
    var pracId = req.params.id;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    Practice.findByIdAndRemove(pracId, (err, delPrac)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!delPrac){
                res.status(404).send({message:"Error al eliminar."});
            }else{
                res.status(200).send(delPrac);
            }
        }
    });
}

function getPractices(req, res){
    Practice.find((err, practices)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!practices){
                res.status(404).send({message:"No se encontraron prácticas."});
            }else{
                res.status(200).send(practices);
            }
        }
    })
}

function getPractice(req, res){
    var pracId = req.params.id;

    Practice.findById(pracId, (err, practice)=>{
       if(err){
            res.status(500).send({message:apiMsg});
       }else{
           if(!practice){
                res.status(404).send({message:"Práctica no encontrada."});
           }else{
               res.status(200).send(practice);
           }
       }
    });
}

function getNonExp(req, res){
    Practice.find({expDate: {$gt: moment().unix()}},(err, practices)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!practices){
                res.status(404).send({message:"No hay prácticas."});
            }else{
                res.status(200).send(practices);
            }
        }
    });
}

function getExp(req, res){
    Practice.find({expDate: {$lte: moment().unix()}}, (err, practices)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!practices){
                res.status(404).send({message:"No hay prácticas."});
            }else{
                res.status(200).send(practices);
            }
        }
    });
}

function uploadFile(req, res){
    var pracId = req.params.id;
    var file_name = 'Sin subir.';



    if(req.files){
        var path_file = './uploads/practices/';
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        Practice.findById(pracId, (err, found)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(!found){
                    res.status(404).send({message:"Práctica no encontrada."});
                }else{
                    path_file = path_file + found.file;
                    if( file_ext === 'png' || file_ext === 'jpg' || file_ext === 'jpeg' || file_ext === 'pdf' || file_ext === 'doc' || file_ext === 'docx' ){
                        Practice.findByIdAndUpdate(pracId, {file:file_name},(err, updated)=>{
                            if(err){
                                res.status(500).send({message:apiMsg});
                            }else{
                                if(!updated){
                                    res.status(404).send({message:"Error al subir archivo."});
                                }else{
                                    if(found.file === null){
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
        res.status(404).send({message:"Archivo no subido."});
    }
}

function getFile(req, res){
    var docFile = req.params.docFile;

    var path_file = './uploads/practices/' + docFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message:"Archivo no encontrado."});
        }
    });
}

module.exports = {
    newPractice,
    updatePractice,
    deletePractice,
    getPractices,
    getPractice,
    getNonExp,
    getExp,
    uploadFile,
    getFile
};