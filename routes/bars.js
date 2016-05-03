var express = require('express');
var router = express.Router({mergeParams: true});
var Bar;

router.route('/')
    .get(getBars)
    .put(addBar);
    
router.route('/:id')
    .get(getBar)
    .delete(removeBar)
    .put(updateBar);



module.exports = function(bar) {
    Bar = bar;
    return router;
};

function getBars(req, res){
    res.json('Succes!');
}

function getBar(req, res){
    
}

function addBar(req, res){
    
}

function removeBar(req, res){
    
}

function updateBar(req, res){
    
}
//https://maps.googleapis.com/maps/api/geocode/json?latlng=51.436884,5.480369&result_type=street_address&key=AIzaSyD3PUPRq9aJRVeCXaIJo2_FDb6mEAxTSWE
