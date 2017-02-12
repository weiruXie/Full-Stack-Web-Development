var express = require('express');

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')

    .get(Verify.verifyOrdinaryUser, function(req, res, next){
        Favorites
            .find({ user: req.decoded._id })
            .populate('user dishes')
            .exec(function(err, favorite) {
                if (err) return next(err);
                res.json(favorite);
            });
    })

    .post(Verify.verifyOrdinaryUser, function(req, res, next){
        Favorites
            .find({ user: req.decoded._id })
            .populate('user dishes')
            .exec(function(err, favorite) {
                if (err) return next(err);

                var addDish = function(favorite) {
                    var alreadyIncluded = false;
                    console.log("Dishes");
                    console.log(favorite.dishes);
                    if (!favorite.dishes) {
                        console.log('No dishes');
                        return;
                    }

                    for (var i=0; i < favorite.dishes.length; i++) {
                        if (favorite.dishes[i]._id == req.body._id) {
                            console.log("Dish already included");
                            return;
                        }
                    }

                    req.body.dish = req.body._id;
                    favorite.dishes.push(req.body);
                    favorite.save(function (err, favorite) {
                        if (err) return next(err);
                        console.log('Updated dishes!');
                    });

                    var response = { status: "Added favorite with id: " + req.body._id };
                    res.json(response);
                };

                if (favorite.length == 0) {
                    req.body.user = req.decoded._id;
                    Favorites.create(req.body, function(err, favorite) {
                        if (err) return next(err);
                        console.log('Favorite created!');
                        addDish(favorite);
                    });
                } else {
                    addDish(favorite[0]);
                }
            });
    })

    .delete(Verify.verifyOrdinaryUser, function(req, res, next){
        Favorites
            .find({ user: req.decoded._id })
            .remove({}, function(err, resp) {
                if (err) return next(err);
                res.json(resp);
            });
    });

favoriteRouter.route('/:dishId')

    .delete(Verify.verifyOrdinaryUser, function(req, res, next){
        Favorites
            .find({ user: req.decoded._id })
            .populate('user dishes')
            .exec(function(err, favorite) {
                if (err) return next(err);

                console.log("Dishes");
                console.log(favorite.dishes);
                if (!favorite[0] || !favorite[0].dishes) {
                    res.json({status: "No favorites available"});
                    return;
                }

                var dishId = req.params.dishId;
                var deleted = false;

                for (var i=0; i < favorite[0].dishes.length; i++) {
                    if (favorite[0].dishes[i]._id == dishId) {
                        favorite[0].dishes.splice(i, 1);
                        favorite[0].save(function (err, favorite) {
                            if (err) return next(err);
                            console.log('Deleted dish!');
                        });
                        deleted = true;
                    }
                }

                res.json(deleted ?
                    {status: "deleted dish from favorites: " + dishId } :
                    {status: "favorite dish not found with id " + dishId}
                );
            });
    });

module.exports = favoriteRouter;



/*


 favoriteRouter.route("/")
    .get(Verify.verifyOrdinaryUser, function(req, res, next){

        Favorites.find({})
            .populate('postedBy dishes')
            .exec(function(err, result){
                if(err) throw err;

                res.json(result);
            });
    })
    .post(Verify.verifyOrdinaryUser, function(req,res,next){

        //find if the user has any favorite dishes
        Favorites.findOneAndUpdate(
            {postedBy: req.decoded._doc._id},
            {$addToSet:{dishes: req.body}},
            {upsert: true, new: true}, function(err, favorite){
                if(err) throw err;
                console.log("dish added to favorite list");

                res.json(favorite);
            }
        );
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next){

        Favorites.remove({postedBy:req.decoded._doc._id}, function(err, result){
            if(err) throw err;

            console.log("Removed favorite list");
            res.json(result);
        });
    })
;
favoriteRouter.route('/:dishId')
    .delete(Verify.verifyOrdinaryUser, function(req, res, next){
        Favorites.findOneAndUpdate(
            {postedBy: req.decoded._doc._id},
            {$pull: {dishes: req.params.dishId}},
            {new: true}, function(err, favorite){
                if(err) throw err;

                console.log("dish removed from the favorite list");

                res.json(favorite);
            }
        );
    });

 */


/*


var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');

var favoritesRouter = express.Router();

var Verify = require('./verify');

favoritesRouter.use(bodyParser.json());

favoritesRouter.route('/')

    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.find({'postedBy': req.decoded._doc._id})
            .populate('dishes')
            .populate('postedBy')
            .exec(function (err, favorites) {
                if (err) throw err;
                if (favorites.length == 0) {
                    res.json(null);
                }
                else {
                    res.json(favorites);
                }
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        var query = {'postedBy': req.decoded._doc._id};
        var update = {$push: {dishes: req.body}};
        var options = {upsert: true};
        Favorites.findOneAndUpdate(
            query,
            update,
            options,
            function (err, favorites) {
                console.log(favorites);
                if (err) throw err;
                res.json(favorites);
            });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.find({'postedBy': req.decoded._doc._id})
            .remove({}, function (err, resp) {
                if (err) throw err;
                res.json(resp);
            });
    });

favoritesRouter.route('/:dishObjectId')
    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        console.log('in delete');
        console.log(req.params.dishObjectId);
        Favorites.update({'postedBy': req.decoded._doc._id}, {$pull: {dishes: req.params.dishObjectId }},
            { multi: false },
            function (err, resp) {
                if (err) throw err;
                res.json(resp);

            });
    });

module.exports = favoritesRouter;
*/
