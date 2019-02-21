/*
    *   AUTHOR: ALONSO R
    *   DATE: 2/18/2019
    *   DESC: Class to manage materials.
    *   LICENSE: CLOSED - SOURCE
*/

'use strict'
// Imports
var fs = require('fs');
var path = require('path');

// Model(s)
var Material = require('../models/material');

// Misc
var apiMsg = 'Server Error.';

// Creates new material
function newMaterial(req, res){
    var material = new Material();
    var params = req.body;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    material.name = params.name;
    material.type = params.type;
    material.stock = params.stock;
    material.image = null;

    // Extras
    if(params.description){
        material.description = params.description
    }else{
        material.description = null;
    }
    if(params.capacity){
        material.capacity = params.capacity;
    }

    if( material.name && material.type && material.stock ){

        Material.findOne({name:material.name}, (err, found)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(found){
                    res.status(400).send({message:"Material ya ha sido creado."});
                }else{
                    material.save((err, saved)=>{
                        if(err){
                            res.status(500).send({message:apiMsg});
                        }else{
                            if(!saved){
                                res.status(404).send({message:"Error al crear material."});
                            }else{
                                res.status(200).send(saved);
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

// Updates material
function updateMaterial(req, res){
    var matId = req.params.id;
    var material = req.body;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    Material.findOne({name:material.name}, (err, found)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(found){
                res.status(400).send({message:"Material ya ha sido creado."});
            }else{
                Material.findByIdAndUpdate(matId, material, (err, updated)=>{
                    if(err){
                        res.status(500).send({message:apiMsg});
                    }else{
                        if(!updated){
                            res.status(404).send({message:"Error al actualizar."});
                        }else{
                            res.status(200).send(updated);
                        }
                    }
                });
            }
        }
    });
}

// Deletes material
function deleteMaterial(req, res){
    var matId = req.params.id;

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    Material.findByIdAndRemove(matId, (err, removed)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!removed){
                res.status(404).send({message:"Error al borrar material."});
            }else{
                res.status(200).send(removed);
            }
        }
    });
}

// Get all materials
function getMaterials(req, res){
    Material.find((err, materials)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!materials){
                res.status(404).send({message:"No se encontraron materiales."});
            }else{
                res.status(200).send(materials);
            }
        }
    });
}

// Get material
function getMaterial(req, res){
    var matId = req.params.id;

    Material.findById(matId, (err, found)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!found){
                res.status(404).send({message:"Material no encontrado."});
            }else{
                res.status(200).send(found);
            }
        }
    });
}

// FS: Upload material image
function uploadImage(req, res){
    var matId = req.params.id;
    var file_name = 'Sin subir.';

    if(req.user.grade){
        return res.status(403).send({message:"Acceso denegado."});
    }

    if(req.files){
        var path_file = './uploads/materials/';
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        Material.findById(matId, (err, found)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(!found){
                    res.status(404).send({message:"Material no encontrado."});
                }else{
                    path_file = path_file + found.image;
                    if( file_ext === 'png' || file_ext === 'jpg' || file_ext === 'jpeg' ){
                        Material.findByIdAndUpdate(matId, {image:file_name},(err, updated)=>{
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

// Get material pic
function getImageFile(req, res){
    var imageFile = req.params.imageFile;

    var path_file = './uploads/materials/' + imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message:"Archivo no encontrado."});
        }
    });
}

module.exports = {
    newMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterials,
    getMaterial,
    uploadImage,
    getImageFile
};