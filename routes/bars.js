var express = require('express');
var router = express.Router({mergeParams: true});
var https = require('https');
var Bar;

router.route('/')
    .put(addBar);
    
router.route('/:id')
    .get(getBar)
    .delete(removeBar)
    .put(updateBar);
    
router.route('/:lat/:lng')
    .get(getBars);


module.exports = function(bar) {
    Bar = bar;
    return router;
};

function getBars(req, res){
    var options = {
        host: 'maps.googleapis.com',
        path: '/maps/api/place/nearbysearch/json?key=AIzaSyD3PUPRq9aJRVeCXaIJo2_FDb6mEAxTSWE&location='+ req.params.lat+','+ req.params.lng+'&radius=2000&type=night_club|bar|cafe'
    };
    https.get(options, function (response) {
        var content = '';                      
        response.on('data', function (chunk) {
            content += chunk;
        });

        response.on('end', function () {
            var bars = [];
            JSON.parse(content).results.forEach(function(googlePlacesBar) {
                var newBar = new Bar();
                newBar.location.lat = googlePlacesBar.geometry.location.lat;
                newBar.location.long = googlePlacesBar.geometry.location.lng;
                var address = googlePlacesBar.vicinity.split(",");
                newBar.location.address.street = address[(address.length -2)];
                newBar.location.address.city = address[(address.length -1)];
                newBar.name = googlePlacesBar.name;
                newBar.google_id = googlePlacesBar.place_id;
                newBar.available = true;
                bars.push(newBar);
            });
            res.json(bars);
        });
        response.on('error', function(err){
            console.log(err); 
        }); 
    });
}

function getBar(req, res){
        Bar.findOne(req.params.id)
        .populate('races')
        .exec(function (err, result) {
            console.log(err);
            res.json(result);
        });
}

function addBar(req, res){
    var newBar = new Bar(req.body);
    newBar.save(function(err,newBar) {
        res.json(newBar);
    });
}

function removeBar(req, res){
    
}

function updateBar(req, res){
    
}
//https://maps.googleapis.com/maps/api/geocode/json?latlng=51.436884,5.480369&result_type=street_address&key=AIzaSyD3PUPRq9aJRVeCXaIJo2_FDb6mEAxTSWE
