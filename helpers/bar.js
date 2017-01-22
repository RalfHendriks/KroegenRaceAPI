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
                currentBar = currentBar.toObject();
                var result = res.body.result;
                currentBar.bar = {
                    name : result.name,
                    address : result.formatted_address,
                    phone : result.formatted_phone_number,
                    location : result.geometry.location
                };

                parsedBars.push(currentBar);
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

    return helper;
};