var helper = {};
var config = require('../config/index')();
var async = require('async');
var googlePlaces = require('node-googleplaces');

module.exports = function() {

    /**
     * Parse all Bars from a race to Google Places
     * @param req
     */
    helper.parseGooglePlaces = function(race, callback) {
        var places = new googlePlaces(config.googleplaces.key);
        var parsedBars = [];

        // Loop through bars in race
        async.eachLimit(race.bars, 1, function(currentBar, cb) {
            var query = {};
            query.placeid = currentBar.google_id;

            // Get data from Google Places
            places.details(query, function(err, res) {
                if(err) return res.json(err);

                // Add extra Google Places data to return object
                if(res.body.status === 'OK') {
                    currentBar = currentBar.toObject();
                    var result = res.body.result;
                    currentBar.bar = {
                        name: result.name,
                        address: result.formatted_address,
                        phone: result.formatted_phone_number,
                        location: result.geometry.location
                    };

                    parsedBars.push(currentBar);
                }
                cb();
            });

        }, function(err) {
            if(err) return res.json(err);

            // Assign new object to return
            race = race.toObject();
            race.bars = parsedBars;
            callback(null, race);
        });
    };

    helper.getNearbyPlaces = function(location, callback) {
        var places = new googlePlaces(config.googleplaces.key);

        // Do async request
        var query = {};
        query.location = location.lat + ',' + location.lng;
        query.radius = 2000;
        query.type = 'bar|cafe';

        // Get data from Google Places
        places.nearbySearch(query, function(err, res) {
            if(err) return res.json(err);

            // Add extra Google Places data to return object
            if(res.body.status === 'OK') {
                var result = res.body.results;
                callback(null, result);
            } else {
                callback(null, []);
            }
        });

    }

    return helper;
};