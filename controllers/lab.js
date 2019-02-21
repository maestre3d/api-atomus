/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/18/2019
    *   DESC: Class to manage labs
    *   LICENSE: CLOSED - SOURCE
*/

'use strict'

// Model(s)
var Lab = require('../models/lab');
var Course = require('../models/course');

// Misc
const apiMsg = 'Server Error.';


// Creates lab
function createLab(req, res){
    var lab = new Lab();
    var params = req.body;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    if(!params.description){
        params.description = null;
    }
    lab.name = params.name;
    lab.description = params.description;

    if(lab.name){
        Lab.findOne({name:lab.name}, (err, found)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(found){
                    res.status(400).send({message:"Laboratorio ya ha sido creado."});
                }else{
                    lab.save((err, newLab)=>{
                        if(err){
                            res.status(500).send({message:apiMsg});
                        }else{
                            if(!newLab){
                                res.status(404).send({message:"Error al crear laboratorio."});
                            }else{
                                res.status(200).send(newLab);
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

// Updates lab
function updateLab(req, res){
    var labId = req.params.id;
    var lab = req.body;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    Lab.findOne({name:lab.name}, (err, found)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(found){
                res.status(400).send({message:"Laboratorio ya ha sido creado."});
            }
        }
    });

    Lab.findByIdAndUpdate(labId, lab, (err, updated)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!updated){
                res.status(404).send({message:"Error al actualizar laboratorio."});
            }else{
                res.status(200).send(updated);
            }
        }
    });

}

// Deletes lab
function deleteLab(req, res){
    var labId = req.params.id;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    Lab.findByIdAndRemove(labId, (err, delLab)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!delLab){
                res.status(404).send({message:"Error al eliminar."});
            }else{
                res.status(200).send(delLab);
            }
        }
    });
}

// Attach a course to lab
// requires: course_id
function addCourse(req, res){
    var courseId = req.params.id;
    var course = req.body;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    if(course.lab){
        
        Lab.findById(course.lab, (err, lab)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(!lab){
                    res.status(404).send({message:"Laboratorio inexistente."});
                }else{
                    Course.findOne({lab: course.lab}, (err, duCor)=>{
                        if(err){
                            res.status(500).send({message:apiMsg});
                        }else{
                            if(duCor){
                                res.status(400).send({message:"Laboratorio ya contiene curso."});
                            }else{
                                Course.findByIdAndUpdate(courseId, {lab: course.lab}, (err, upCour)=>{
                                    if(err){
                                        res.status(500).send({message:apiMsg});
                                    }else{
                                        if(!upCour){
                                            res.status(404).send({message:"Error al añadir laboratorio."});
                                        }else{
                                            res.status(200).send(upCour);
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
        res.status(400).send({message:"Dato inválido."});
    }

}

// Detach lab from course
// requires: course_id
function deleteCourse(req, res){
    var courseId = req.params.id;
    var course = req.body;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    if(course.lab){
        Course.findOne( {$and: [{lab: course.lab}, {_id: courseId}]}, (err, found)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(!found){
                    res.status(404).send({message:"No se encontró laboratorio."});
                }else{
                    Course.findByIdAndUpdate(courseId, {lab: null}, (err, upLab)=>{
                        if(err){
                            res.status(500).send({message:apiMsg});
                        }else{
                            if(!upLab){
                                res.status(404).send({message:"Error al borrar laboratorio."});
                            }else{
                                res.status(200).send(upLab);
                            }
                        }
                    });
                }
            }
        });
    }else{
        res.status(400).send({message:"Dato inválido."});
    }
}

// Get all labs populating course->teacher objects
function getLabs(req, res){
    var find = Lab.find();

    find.populate({
        path: 'course',
        populate: {
            path: 'teacher',
            model: 'Teacher'
        }
    })
    .exec((err, labs)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!labs){
                res.status(404).send({message:"No hay laboratorios."});
            }else{
                res.status(200).send(labs);
            }
        }
    });
}

// Get lab
function getLab(req, res){
    var labId = req.params.id;

    Lab.findById(labId, (err, lab)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!lab){
                res.status(404).send({message:"Laboratorio inexistente."})
            }else{
                res.status(200).send(lab);
            }
        }
    })

}

module.exports = {
    createLab,
    updateLab,
    deleteLab,
    addCourse,
    deleteCourse,
    getLabs,
    getLab
};