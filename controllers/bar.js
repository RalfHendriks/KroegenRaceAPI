var _ = require('underscore');
var async = require('async');
var googlePlaces = require('node-googleplaces');
var config = require('../config/index')();
var controller = {};

module.exports = function(Race, User) {

    /**
     * Get Bars from specific race
     * @param req
     * @param res
     */
    controller.getBars = function(req, res) {
        var query = {};

        if (req.params.id) {
            query._id = req.params.id;
        }

        async.waterfall([
            function(callback) {
                // Find Race
                Race.findOne(query, function (err, race){
                    if(err) return res.json(err);

                    // Check if race exist
                    if(!race)
                        return res.status(400).json({error: 'race not found'});

                    callback(null, race);
                });
            },
            function(race, callback) {
                var places = new googlePlaces(config.googleplaces.key);
                var bars = [];

                // Loop through bars in race
                async.each(race.bars, function(selectedBar, cb) {
                    var query = {};
                    query.placeid = selectedBar.google_id;

                    // Get data from Google Places
                    places.details(query, function(err, res) {
                        if(err) return res.json(err);

                        // Add extra Google Places data to return object
                        selectedBar = selectedBar.toObject();
                        selectedBar.bar = res.body.result;

                        bars.push(selectedBar);
                        cb();
                    });

                }, function(err) {
                    if(err) return res.json(err);

                    // Assign new object to return
                    race = race.toObject();
                    race.bars = bars;
                    callback(null, race);
                });

            }
        ], function (err, result) {
            if(err) return res.json(err);

            return res.json(result.bars);
        });
    };

    /**
     * Add Bar
     * @param req
     * @param res
     */
    controller.addBar = function(req, res) {
        var query = {};

        if (req.params.id) {
            query._id = req.params.id;
        }

        // Find race
        Race.findOne(query, function (err, race) {
            if(err) return res.json(err);

            // Check if race exist
            if(!race)
                return res.status(400).json({error: 'race not found'});

            // Check if google id is set
            if(!req.body.google_id)
                return res.status(400).json({error: 'google id is required'});

            // Check if google id exists in array
            var exists = false;
            race.bars.forEach(function(item) {
                if(item.google_id === req.body.google_id)
                    exists = true;
            });

            if(exists)
                return res.status(400).json({error: 'bar already exists'});

            // Add bar to list
            var bar = {};
            bar.google_id = req.body.google_id;
            bar.visited_participants = [];
            race.bars.push(bar);

            race.save(function(err, data){
                if(err) return res.json(err);

                res.json(data);
            });
        });
    };

    /**
     * Get single bar of specific race
     * @param req
     * @param res
     */
    controller.getBar = function(req, res) {
        var query = {};

        if (req.params.id) {
            query._id = req.params.id;
        }

        if (!req.params.barid)
            return res.status(400).json({error: 'barid is required'});

        async.waterfall([
            function(callback) {
                // Find Race
                Race.findOne(query, function (err, race){
                    if(err) return res.json(err);

                    // Check if race exist
                    if(!race)
                        return res.status(400).json({error: 'race not found'});

                    callback(null, race);
                });
            },
            function(race, callback) {

                var places = new googlePlaces(config.googleplaces.key);
                var bars = [];

                // Check if google id exists in array
                var exists = false;
                var bar;
                race.bars.forEach(function(item, index) {
                    if(item.google_id === req.params.barid) {
                        exists = true;
                        bar = race.bars[index];
                    }
                });

                if(!exists)
                    return res.status(400).json({error: 'bar not found'});

                // Empty bars and only add the right one
                race.bars = [];
                race.bars.push(bar);

                // Loop through bars in race
                async.each(race.bars, function(selectedBar, cb) {
                    var query = {};
                    query.placeid = selectedBar.google_id;

                    // Get data from Google Places
                    places.details(query, function(err, res) {
                        if(err) return res.json(err);

                        // Add extra Google Places data to return object
                        selectedBar = selectedBar.toObject();
                        selectedBar.bar = res.body.result;

                        bars.push(selectedBar);
                        cb();
                    });

                }, function(err) {
                    if(err) return res.json(err);

                    // Assign new object to return
                    race = race.toObject();
                    race.bars = bars;
                    callback(null, race);
                });

            }
        ], function (err, result) {
            if(err) return res.json(err);

            return res.json(result.bars[0]);
        });
    };

    controller.editBar = function(req, res) {
        var query = {};

        if (req.params.id) {
            query._id = req.params.id;
        }

        // Find race
        Race.findOne(query, function (err, race) {
            if(err) return res.json(err);

            // Check if race exist
            if(!race)
                return res.status(400).json({error: 'race not found'});

            // Check if google id is set
            if(!req.body.google_id)
                return res.status(400).json({error: 'google id is required'});

            // Check if bar exists
            var barindex = _.indexOf(race.bars, _.findWhere(race.bars, {
                "google_id" : req.params.barid 
            }));

            if(barindex === -1)
                return res.status(400).json({error: 'bar not found'});

            // Replace google_id
            if(req.body.google_id)
                race.bars[barindex].google_id = req.body.google_id;

            // Replace visited participants
            if(req.body.google_id)
                race.bars[barindex].visited_participants = req.body.visited_participants;

            Race.update(query, race, function(err, race) {
                if(err) return res.json(err);

                res.json(race);
            });

        });
    };

    /**
     * Remove bar
     * @param req
     * @param res
     */
    controller.removeBar = function(req, res) {
        var query = {};

        if (req.params.id)
            query._id = req.params.id;

        // Find race
        Race.findOne(query, function (err, race){
            if(err) return res.json(err);

            // Check if race exist
            if(!race)
                return res.status(400).json({error: 'race not found'});

            // Check if barid is set
            if(!req.params.barid)
                return res.status(400).json({error: 'barid is required'});

            // Remove participant from array
            var initial_length = race.bars.length;
            race.bars = _.without(race.bars, _.findWhere(race.bars, {
                google_id: req.params.barid
            }));

            // Check if array size is equal, then bar is not removed
            if(initial_length === race.bars.length)
                return res.status(400).json({error: 'bar not found'});

            race.save(function(err, data){
                if(err) return res.json(err);

                res.json({message: 'the bar has been removed'});
            });
        });
    };

    return controller;
};