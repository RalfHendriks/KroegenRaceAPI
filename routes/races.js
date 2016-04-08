var express = require('express');
var router = express.Router();
var _ = require('underscore');
var https = require('https');
var Race;
var User;
var Bar;

router.route('/')
    .get(loadMain)
    .post(addRace);
    
router.route('/:id')
    .get()
    .delete()
    .put();
    
router.route('/:id/participants')
    .get()
    .put(addUser);

router.route('/:id/participants/:userid')
    .get()
    .delete(removeUser);

router.route('/:id/bars/')
    .get()
    .put(addBar);
    
router.route('/:id/bars/:barid')
    .get()
    .delete(removeBar);
 
module.exports = function(race,user,bar) {
    Race = race;
    User = user;
    Bar = bar;
    return router;
};

function loadMain(req, res){
     getPlaces('51.274651', '5.575767', function(place){
        place.data.results.forEach(function(googlePlacesBar) {
            var newBar = new Bar();
            newBar.location.lat = googlePlacesBar.geometry.location.lat;
            newBar.location.long = googlePlacesBar.geometry.location.lng;
            newBar.name = googlePlacesBar.name+'asfasf';
            Bar.findOne({'name' : newBar.name} ,function (err,bar) {
                if(bar == null){
                    newBar.save(function(err,newSavedBar){
                        console.log(err);
                    });
                }
            });
        });  
    });
}

function addRace(req, res){

    /*var newRace = new Race(req.body);
    console.log(newRace);
    newRace.save(function(err, savedRace){
		if(err){
            res.json(err);
         }
		else {
			res.json(newRace);
		}
	});*/
}

function addUser(req,res){
    var query = getRequestId(req);
    Race.findOne(query,function (err,race) {
        race.users.push(req.body._id);
        race.save(function(err) {
            if (err)
                res.json(err);
            else
                res.json(race);
        });
    });
}

function addBar(req,res){
    var query = getRequestId(req);
    Race.findOne(query,function (err,race) {
        race.bars.push(req.body._id);
        race.save(function(err) {
            if (err)
                res.json(err);
            else
                res.json(race);
        });
    });
}

function removeUser(req,res){
    var url = require('url');
var url_parts = url.parse(request.url, true);
var query = url_parts.query;
console.log(query);
    var query = getRequestId(req);
    Race.findOne(query,function (err,race) {
        var i = race.users.indexOf(req.params.userid);
        if(i != -1){
            race.users.splice(i,1);
            race.save(function(err) {
                if (err)
                    res.json(err);
                else
                    res.json(race);
            });
        }
        else{
            res.json('invalid id');
        }
    });
}

function removeBar(req,res){
    var query = getRequestId(req);
    Race.findOne(query,function (err,race) {
        var i = race.bars.indexOf(req.params.barid);
        if(i != -1){
            race.bars.splice(i,1);
            race.save(function(err) {
                if (err)
                    res.json(err);
                else
                    res.json(race);
            });
        }
        else{
            res.json('invalid id');
        }
    });
}

function getRequestId(req){
    var q = {}
    if(req.params.id){
        q._id = req.params.id;
    }
    return q;
}

function getPlaces(lat, long, callback){
    var startDate = new Date(); 
    var options = {
        host: 'maps.googleapis.com',
        path: '/maps/api/place/nearbysearch/json?key=AIzaSyCa7_xDOrAkBwMIgCYe3zet8dNZYjLbgII&location='+lat+','+long+'&radius=5000&type=bar|cafe'
    };

    https.get(options, function (response) {
        var content = '';

        // Elke keer als we wat data terugkrijgen zullen we dit bij de content toevoegen.
        response.on('data', function (chunk) {
            content += chunk;
        });

        // Als het hele response terug is kunnen we verder
        response.on('end', function () {
            var object = JSON.parse(content);
            // De callback nu uitvoeren
            callback({
                data : object
            });
        });
    });
}