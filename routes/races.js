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

function renderPage(type, data,target,permission,res){
    switch(type){
         case 'application/json':
                res.json(data);
            break;
        case 'text/html':
                if(permission == '1'){
                    res.render(target, {data: data,userPermission: permission });  
                }
                else{
                    res.json('Permission denied!');
                }
            break;
        default:
                res.send({ error: 'No header found' });
            break;
    }
}
    
function getRaces(req, res){
    console.log(req.user);
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
        async.waterfall([
            function(callback) {
                Race.find(query).sort('-date').exec(function(err, races) {
                    callback(null, races);
                  });
            },
            function(races, callback) {
                /*races.forEach(function())
                                    race.bars.forEach(function(barID){
                        console.log(barID);
                            Bar.find({'_id': barID}, function(err,bar){
                                console.log(bar);
                                console.log(err);
                                bars.push(bar);
                            }); 
                    });*/
            // arg1 now equals 'one' and arg2 now equals 'two'
                callback(null, 'three');
            },
            function(arg1, callback) {
                // arg1 now equals 'three'
                callback(null, 'done');
            }
        ], function (err, result) {
            // result now equals 'done'
        });

        console.log(raceMap);
        renderPage(req.accepts('text/html', 'application/json'),raceMap,'race',auth.validAction(req.user),res);
}

function getRace(req,res){
    var query = getRequestId(req);
    Race.findOne(query,function (err,race) {
        if(race != null){
                                console.log(race);
            renderPage(req.accepts('text/html', 'application/json'),race,'racedetails',auth.validAction(req.user),res);
        }
        else{
              res.json('Invalid Race id');  
        } 
    });
}

function addRace(req, res){
    var newRace = new Race(req.body);
    async.waterfall([
        function(callback) {
            var startDate = new Date(); 
            var options = {
                host: 'maps.googleapis.com',
                path: '/maps/api/place/nearbysearch/json?key=AIzaSyD3PUPRq9aJRVeCXaIJo2_FDb6mEAxTSWE&location='+req.body.lat+','+req.body.lng+'&radius=2000&type=bar|cafe'
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
                        newBar.available = true;
                        bars.push(newBar);
                    });
                    callback(null,
                        bars
                    );
                });
            });
        },
        function(bars, callback) {
            bars.forEach(function(selectedBar){
                console.log(selectedBar);
                Bar.findOne({'name' : selectedBar.name,'lat': selectedBar.lat,'long': selectedBar.long} ,function (err,bar) {
                    if(bar == null){
                    selectedBar.save(function(err,newbar){
                            selectedBar = newbar;
                            console.log(err);
                        });
                    }
                    else
                    {
                        selectedBar = bar;
                    }
                });
            });
            callback(null, bars);
        },
        function(barlist, callback) {
            barlist.forEach(function(bar){
                newRace.bars.push({'bar':bar,'visited':false});
            })
            newRace.save(function(err){
               console.log(err); 
            });
            callback(null);
        }
        ], 
        function (err) {
            if(err == null){
                res.json(newRace); 
            }
            else{
                console.log(err);
            }

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

