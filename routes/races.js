var express = require('express');
var router = express.Router();
var _ = require('underscore');
var https = require('https');
var async = require('async');
var authorization = require('../config/authorization');
var auth = new authorization();
var Race;
var User;
var Bar;

router.route('/')
    .get(getRaces)
    .post(addRace);
    
router.route('/:id')
    .get(getRace)
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

function getRaces(req, res){
    var permission = auth.validAction(req.user);
    if(permission == '1'){
        Race.find({}, function(err, races) {
            var raceMap = [];
            races.forEach(function(race) {
                raceMap.push(race);
            });
            console.log(raceMap);
            res.render('race', {races: raceMap,userPermission: permission });  
        });
    }
    else{
        res.json('Wrong id');  
    }
}

function getRace(req,res){
    var query = getRequestId(req);
    Race.findOne(query,function (err,race) {
        if(race != null){
            res.json(race);
        }
        else{
              res.json('Wrong id');  
        } 
    });
}

function getBar(name,callback){
    var selectedBar;
    Bar.findOne({'name' : name} ,function (err,bar) {
        if(bar == null){
        newBar.save(function(err,newSavedBar){
            selectedBar = newSavedBar;
            });
        }
        else
        {
            selectedBar = bar;
        }
        callback({selectedBar});
    });
}

function getBarPLaces(newRace,callback){
        getPlaces('51.274651', '5.575767', function(bars){
            bars.object.results.forEach(function(googlePlacesBar) {
                var newBar = new Bar();
                newBar.location.lat = googlePlacesBar.geometry.location.lat;
                newBar.location.long = googlePlacesBar.geometry.location.lng;
                newBar.name = googlePlacesBar.name;
                getBar(newBar.name,function(result){
                    newRace.bars.push(result);
                    newRace.save();
                });
            });
            callback({newRace});
    });
}

function addRace(req, res){
    
    var newRace = new Race(req.body);
        getBarPLaces(newRace,function(barResults){
            newRace = barResults;
            
            res.json(newRace);   
        });
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
            callback({
                object
            });
        });
    });
}

