/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/18/2019
    *   DESC: Class to manage courses
    *   LICENSE: CLOSED - SOURCE
*/

'use strict'

// Model(s)
var Course = require('../models/course');
var Teacher = require('../models/teacher');
var Practice = require('../models/practice');
var Order = require('../models/order');
var Ban = require('../models/ban');

// Misc
const apiMsg = 'Server Error.';

// Create a new course
// requires: teacher_id
function newCourse(req, res){
    var params = req.body;
    var course = new Course();

    course.name = params.name;
    course.grade = params.grade;
    course.teacher = params.teacher;
    course.lab = null;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    if(course.name && course.grade && course.teacher ){
        Course.findOne({name: course.name}, (err, found)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(found){
                    res.status(400).send({message:"Curso ya creado."});
                }else{
                    Teacher.findById(course.teacher, (err, teacher)=>{
                        if(err){
                            res.status(500).send({message:apiMsg});
                        }else{
                            if(!teacher){
                                res.status(404).send({message:"Maestro no encontrado."});
                            }else{
                                course.save((err, saved)=>{
                                    if(err){
                                        res.status(500).send({message:apiMsg});
                                    }else{
                                        if(!saved){
                                            res.status(404).send({message:"Error al crear curso."});
                                        }else{
                                            res.status(200).send(saved);
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
        res.status(400).send({message:"Inserte todos los campos."});
    }
}

// Updates course
function updateCourse(req, res){
    var cId = req.params.id;
    var course = req.body;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    if(course.name || course.grade){
        Course.findOne({name:course.name}, (err, found)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(found){
                    res.status(400).send({message:"Curso ya creado."});
                }else{
                    Course.findByIdAndUpdate(cId, course, (err, upCourse)=>{
                        if(err){
                            res.status(500).send({message:apiMsg});
                        }else{
                            if(!upCourse){
                                res.status(404).send({message:"Error al actualizar."});
                            }else{
                                res.status(200).send(upCourse);
                            }
                        }
                    });
                }
            }
        });
    }else{
        res.status(400).send({message:"Ingrese correctamente los datos."});
    }
}

// Deletes course
function deleteCourse(req, res){
    var cId = req.params.id;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    Course.findByIdAndRemove(cId, (err, delCou)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!delCou){
                res.status(404).send({message:"Error al eliminar."});
            }else{
                // DELETE ON CASCADE
                // Course=>Practice=>Order=>Ban

                Practice.find({course: delCou._id}).deleteOne((err, pracRm)=>{
                    if(err){
                        res.status(500).send({message:apiMsg});
                    }else{
                        if(!pracRm){
                            res.status(404).send({message:"Error al eliminar."});
                        }else{
                            Order.find({practice: pracRm._id}).deleteOne((err, orderRm)=>{
                                if(err){
                                    res.status(500).send({message:apiMsg});
                                }else{
                                    if(!orderRm){
                                        res.status(404).send({message:"Error al eliminar."});
                                    }else{
                                        Ban.find({order: orderRm._id}).deleteOne((err, banRm)=>{
                                            if(err){
                                                res.status(500).send({message:apiMsg});
                                            }else{
                                                if(!banRm){
                                                    res.status(404).send({message:"Error al eliminar."});
                                                }else{
                                                    res.status(200).send(delCou);
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });

}

// Get all courses, populating labs objects
function getCourses(req, res){
    var find = Course.find();

    find.populate({path: 'lab'}).exec((err, courses)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!courses){
                res.status(404).send({message:"No se encontraron cursos."});
            }else{
                res.status(200).send(courses);
            }
        }
    });
}

// Get course populating lab and teacher objects
function getCourse(req, res){
    var cId = req.params.id;
    var find = Course.findById(cId);

    find.populate({path: 'lab'})
    .populate({path: 'teacher'})
    .exec((err, course)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!course){
                res.status(404).send({message:"Curso no encontrado."});
            }else{
                res.status(200).send(course);
            }
        }
    });
}

// Get all practices from course_id
// requires: course_id;
function getPractices(req, res){
    var courseId = req.params.id;
    var find = Practice.find({course: courseId}).sort('expDate');

    find.populate({path: 'material'}).exec((err, courses)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!courses){
                res.status(404).send({message:"No se encontraron prácticas."});
            }else{
                res.status(200).send(courses);
            }
        }
    });
}

module.exports = {
    newCourse,
    updateCourse,
    deleteCourse,
    getCourses,
    getCourse,
    getPractices
};