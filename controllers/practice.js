/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/18/2019
    *   DESC: Class to manage practices.
    *   LICENSE: CLOSED - SOURCE
*/

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

// Creates new practice
// requires: course_id
function newPractice(req, res){
    var date = moment().unix();
    var practice = new Practice();
    var params = req.body;

    practice.name = params.name;
    practice.postDate = moment.unix(date);
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
        res.status(400).send({message:"Inserte todos los campos."});
    }
}

// Updates practice
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
                Practice.findById(pracId, (err, pra)=>{
                    if(err){
                        res.status(500).send({message:apiMsg});
                    }else{
                        if(pra){
                            practice.expDate = moment(pra.postDate).add(practice.expDate, 'days').unix();
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
                        }else{
                            res.status(404).send({message:"Error al actualizar."});
                        }
                    }

                });
            }
        }
    });
}

// Removes practice
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

// Get all practices populating material's object
function getPractices(req, res){
    var find = Practice.find();

    find.populate({path: 'material'}).exec((err, practices)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!practices){
                res.status(404).send({message:"No se encontraron prácticas."});
            }else{
                res.status(200).send(practices);
            }
        }
    });
}

// Get practice populating material, course-> teacher, course-> lab objects
function getPractice(req, res){
    var pracId = req.params.id;
    var find = Practice.findById(pracId);

    find.populate({path: 'material'})
    .populate({
        path:'course',
        populate: {
            path: 'teacher',
            model: 'Teacher'
        }
    })
    .populate({
        path: 'course',
        populate: {
            path: 'lab',
            model: 'Lab'
        }
    })
    .exec((err, practice)=>{
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

// Get all non expired practices
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

// Get all expired practices
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

// Get all non expired practices by course
// requires: course_id
function getNonExpCourse(req, res){
    var courseId = req.params.id;
    var find = Practice.find({ $and: [ {expDate: { $gt: moment().unix()}}, {course: courseId} ] });

    find.populate({
        path:'course',
        populate: {
            path: 'lab',
            model: 'Lab'
        }
    })
    .exec((err, practices)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!practices){
                res.status(404).send({message:"No se encontraron resultados."});
            }else{
                res.status(200).send(practices);
            }
        }
    });
}

// Add material to practice's list
function addMaterial(req, res){
    var pracId = req.params.id;
    var practice = req.body;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    if(practice.material){
        Practice.findByIdAndUpdate(pracId,
            {$push: { material: {$each: practice.material}}},
            (err, saved)=>{
                if(err){
                    res.status(500).send({message:apiMsg});
                }else{
                    if(!saved){
                        res.status(404).send({message:"Error al añadir material."})
                    }else{
                        res.status(200).send(saved);
                    }
                }
            }
        );
        /* NO REPEATED MATERIALS
        Practice.findByIdAndUpdate(pracId,
            ({'material': { '$ne': practice.material}},
            {'$addToSet': {'material': practice.material}}),
            (err, saved)=>{
                if(err){
                    res.status(500).send({message:apiMsg});
                }else{
                    if(!saved){
                        res.status(404).send({message:"Error al añadir material."})
                    }else{
                        res.status(200).send(saved);
                    }
                }
            }
        );*/
    }else{
        res.status(400).send({message:"Valor inválido."})
    }
}

// Removes material from practice's list
function removeMaterial(req, res){
    var pracId = req.params.id;
    var practice = req.body;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    if(practice.material){
        Practice.findOne({$and: [{material: practice.material}, {_id: pracId}]}, (err, found)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(!found){
                    res.status(404).send({message:"No se encontró material/práctica."});
                }else{
                    Practice.findByIdAndUpdate(pracId, {$pull:{'material': practice.material}}, (err, upPrac)=>{
                        if(err){
                            res.status(500).send({message:apiMsg});
                        }else{
                            if(!upPrac){
                                res.status(404).send({message:"Error al borrar material."});
                            }else{
                                res.status(200).send(upPrac);
                            }
                        }
                    });
                }
            }
        });
    }else{
        res.status(400).send({message:"Valor inválido."})
    }
}

// FS: Upload practice's file
// note: (It could be a doc/docx, pdf or a pic file).
function uploadFile(req, res){
    var pracId = req.params.id;
    var file_name = 'Sin subir.';

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

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
        res.status(400).send({message:"Archivo no subido."});
    }
}

// Get practice file
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
    addMaterial,
    removeMaterial,
    getPractices,
    getPractice,
    getNonExpCourse,
    getNonExp,
    getExp,
    uploadFile,
    getFile
};