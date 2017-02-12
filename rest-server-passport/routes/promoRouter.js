var express = require('express');

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Promotions = require('../models/promotions');

var promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')

    .get(function(req, res, next){
        Promotions.find({}, function(err, promo) {
            if (err) return next(err);
            res.json(promo);
        });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        Promotions.create(req.body, function(err, promo) {
            if (err) return next(err);
            console.log('Promotion created!');
            var response = { status: "Added promotion with id: " + promo._id };
            res.json(response);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        Promotions.remove({}, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    })
;

promoRouter.route('/:promotionId')

    .get(function(req, res, next){
        Promotions.findById(req.params.promotionId, function(err, promo) {
            if (err) return next(err);
            res.json(promo);
        });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        Promotions.findByIdAndUpdate(req.params.promotionId, {
            $set: req.body
        }, {
            new: true
        }, function (err, promo) {
            if (err) return next(err);
            res.json(promo);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        Promotions.findByIdAndRemove(req.params.promotionId, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    })
;

module.exports = promoRouter;
