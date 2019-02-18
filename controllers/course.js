'use strict'
// Model(s)
var Course = require('../models/course');
var Teacher = require('../models/teacher');

// Misc
var apiMsg = 'Server Error.';

function newCourse(req, res){
    var params = req.body;
    var course = new Course();

    course.name = params.name;
    course.grade = params.grade;
    course.teacher = params.teacher;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    if(course.name && course.grade && course.teacher ){
        Course.findOne({name: course.name}, (err, found)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(found){
                    res.status(406).send({message:"Curso ya creado."});
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
        res.status(403).send({message:"Rellene todos los campos."});
    }
}

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
                    res.status(406).send({message:"Curso ya creado."});
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
        res.status(404).send({message:"Ingrese correctamente los datos."});
    }
}

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
                res.status(200).send(delCou);
            }
        }
    });

}

function getCourses(req, res){
    Course.find((err, courses)=>{
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

function getCourse(req, res){
    var cId = req.params.id;

    Course.findById(cId, (err, found)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!found){
                res.status(404).send({message:"Curso no encontrado."});
            }else{
                res.status(200).send(found);
            }
        }
    });

}


module.exports = {
    newCourse,
    updateCourse,
    deleteCourse,
    getCourses,
    getCourse
};