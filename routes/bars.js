var express = require('express');
var router = express.Router();
var authorization = require('../config/authorization');
var auth = new authorization();
var Bar;

router.route('/')
    .get(getBars);
    
router.route('/:id')
    .get()
    .delete()
    .put();



module.exports = function(bar) {
    Bar = bar;
    return router;
};

function getBars(req, res){
    var permissionLevel = auth.validAction(req.user);
    var query = {};
    switch(permissionLevel){
        case '1':
            query = {}
            break;
        case '2':
            query = {'raceLeader': req.user._id};
            break;
    }
    
    
}

//https://maps.googleapis.com/maps/api/geocode/json?latlng=51.436884,5.480369&result_type=street_address&key=AIzaSyD3PUPRq9aJRVeCXaIJo2_FDb6mEAxTSWE
