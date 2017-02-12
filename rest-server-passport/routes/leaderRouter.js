var express = require('express');

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Leaders = require('../models/leadership');

var leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')

    .get(function(req, res, next){
        Leaders.find({}, function(err, leader) {
            if (err) return next(err);
            res.json(leader);
        });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        Leaders.create(req.body, function(err, leader) {
            if (err) return next(err);
            console.log('Leader created!');
            var response = { status: "Added leader with id: " + leader._id };
            res.json(response);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        Leaders.remove({}, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

leaderRouter.route('/:leadershipId')

    .get(function(req, res, next){
        Leaders.findById(req.params.leadershipId, function(err, leader) {
            if (err) return next(err);
            res.json(leader);
        });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        Leaders.findByIdAndUpdate(req.params.leadershipId, {
            $set: req.body
        }, {
            new: true
        }, function (err, leader) {
            if (err) return next(err);
            res.json(leader);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        Leaders.findByIdAndRemove(req.params.leadershipId, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

module.exports = leaderRouter;
