'use strict'
// Imports
var moment = require('moment');

// Model(s)
var Order = require('../models/order');
var Practice = require('../models/practice');
var User = require('../models/user');

const apiMsg = 'Server Error.';

function testExp(req, res){
    var date = moment().unix();
    //var tmp = moment.unix(date).format('dddd, MMMM Do, YYYY h:mm:ss A');
    var tmp = moment.unix(date); 
    var exp = moment(tmp).add(2, 'days');
    console.log(moment().unix());
    res.status(200).send({time: moment(exp).add((10), 'days').toLocaleString()});
};

function createOrder(req, res){
    var order = new Order();
    var params = req.body;


    order.reqDate = moment().unix();
    order.user= params.user;
    order.practice = params.practice;

    if(order.user && order.practice){
        Practice.findById(order.practice, (err, practice)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(!practice){
                    res.status(404).send({message:"Práctica inexistente."});
                }else{
                    var tmp = moment.unix(practice.expDate); 
                    order.material = practice.material;
                    order.expDate = moment(tmp).add(5, 'days').unix();

                    User.findOne({$and: [{_id:order.user}, {course: practice.course}]}, (err, user)=>{
                        if(err){
                            res.status(500).send({message:apiMsg});
                        }else{
                            if(!user){
                                console.log(order.user);
                                res.status(404).send({message:"Usuario inexistente."});
                            }else{
                                order.save((err, nOrder)=>{
                                    if(err){
                                        res.status(500).send({message:err});
                                    }else{
                                        if(!nOrder){
                                            res.status(404).send({message:"Error al ordenar."});
                                        }else{
                                            res.status(200).send(nOrder);
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
        res.status(400).send({message:"Campos insuficientes."});
    }
}

function removeOrder(req, res){
    var orderId = req.params.id;

    Order.findByIdAndRemove(orderId, (err, dOrder)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!dOrder){
                res.status(404).send({message:"Error al borrar."});
            }else{
                res.status(200).send(dOrder);
            }
        }
    })
}

function getOrders(req, res){
    var find = Order.find();

    find.populate({path: 'user'})
    .populate({path: 'practice'})
    .populate({path: 'material'})
    .exec((err, orders)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!orders){
                res.status(404).send({message:"No se encontraron órdenes."});
            }else{
                res.status(200).send(orders);
            }
        }
    });
}

function getOrder(req, res){
    var orderId = req.params.id;
    var find = Order.findById(orderId);

    find.populate({path: 'user'})
    .populate({path: 'practice'})
    .populate({path: 'material'})
    .exec((err, order)=>{
        if(err){
            res.status(500).send({message:apiMsg});
        }else{
            if(!order){
                res.status(404).send({message:"No se encontraron órdenes."});
            }else{
                res.status(200).send(order);
            }
        }
    });
}

function getUserOr(req, res){
    var user = req.params.id;

    if(user){
        Order.find({$and: [{user: user}, {expDate: {$gt: moment().unix()}}]})
        .populate({path: 'practice'}).exec((err, orders)=>{
            if(err){
                res.status(500).send({message:apiMsg});
            }else{
                if(!orders){
                    res.status(404).send({message:"No se encontraron órdenes."});
                }else{
                    res.status(200).send(orders);
                }
            }
        });
    }else{
        res.status(400).send({message:"Campos insuficientes."});
    }

}

module.exports = {
    testExp,
    createOrder,
    removeOrder,
    getOrders,
    getOrder,
    getUserOr
};