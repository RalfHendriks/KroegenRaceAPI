var async = require('async');
var GooglePlaces = require('googleplaces');
var config = require('../config/index')();
var controller = {};

module.exports = function(Race) {

    controller.getRaces = function(req, res) {
        var query = {};

        Race.find(query, function (err, data){
            if(err) return res.json(err);

            res.json(data);
        });
    };

    controller.addRace = function(req, res) {
        var newRace = new Race(req.body);

        if(!req.body.name) {
            res.status(400);
            return res.json({error: 'name is required'});
        }

        if(!req.body.raceleader) {
            res.status(400);
            return res.json({error: 'raceleader is required'});
        }

        if(!req.body.bars) {
            res.status(400);
            return res.json({error: 'bars is required'});
        }

        if(req.body.bars.length === 0) {
            res.status(400);
            return res.json({error: 'bars array is empty'});
        }

        newRace.save(function(err, data){
            if(err) return res.json(err);

            res.json(data);
        });
    };

    controller.getRace = function(req, res) {
        var query = {};

        if (req.params.id) {
            query._id = req.params.id;
        }

        async.waterfall([
            function(callback) {
                // First get Race from DB
                Race.findOne(query, function (err, race){
                    if(err) return res.json(err);

                    callback(null, race);
                });
            },
            function(race, callback) {
                // Add Google Places data
                var places = new GooglePlaces(config.googleplaces.key, config.googleplaces.outputFormat);
                var bars = [];

                async.each(race.bars, function(selectedBar, cb) {
                    var query = {};
                    query.placeid = selectedBar.google_id;

                    places.placeSearch(query, function (error, response) {
                        if (error) throw error;
                        places.placeDetailsRequest({reference: response.results[0].reference}, function (error, response) {
                            if (error) throw error;
                            console.log(response);
                        });
                    });
                   /* places.details(query, function(err, res) {
                        console.log("==========");
                        console.log(err);
                        console.log("----------");
                        console.log(res);
                        console.log("==========");
                        if(err) return res.json(err);

                        selectedBar = selectedBar.toObject();
                        selectedBar.bar = res.body;


                        bars.push(selectedBar);

                        console.log(selectedBar);
                        cb();
                    });*/
                    cb();

                }, function(err) {
                    if(err) return res.json(err);

                    //console.log(bars);
                    race.bars = bars;
                    callback(null, race);
                });

            }
        ], function (err, result) {
            if(err) return res.json(err);

            return res.json(result);
        });

    };

    controller.removeRace = function(req, res) {
        var query = {};

        if (req.params.id) {
            query._id = req.params.id;
        }

        Race.findOneAndRemove(query, function (err){
            if(err) return res.json(err);

            res.json({message: 'the race has been removed'});
        });
    };

    controller.editRace = function() {
        console.log('updateRace');
    };

    controller.getParticipants = function() {
        console.log('getParticipants');
    };

    controller.addParticipant = function() {
        console.log('addParticipant');
    };

    controller.removeParticipant = function() {
        console.log('removeParticipant');
    };

    controller.getBars = function() {
        console.log('getBars');
    };

    controller.addBar = function() {
        console.log('addBar');
    };

    controller.getBar = function() {
        console.log('getBar');
    };

    controller.editBar = function() {
        console.log('editBar');
    };

    controller.removeBar = function() {
        console.log('removeBar');
    };

    controller.getVisitedParticipants = function() {
        console.log('getVisitedParticipants');
    };

    controller.addVisitor = function() {
        console.log('addVisitor');
    };

    controller.removeVisitor = function() {
        console.log('removeVisitor');
    };

    return controller;
};