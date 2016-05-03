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
    .get(getUsers)
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

function getHeaderType(req){
    var headerType = req.get('Content-Type');
    if(headerType == undefined){
        headerType = req.accepts('text/html');
    }
    else if(headerType.indexOf(',') != -1){
        headerType = headerType.split(",")[0];
    }
    return headerType;    
}

function renderPage(type, data,target,permission,res){
    switch(type){
         case 'application/json':
                res.json(data);
            break;
        case 'text/html':
                if(permission == '1'){
                        console.log(data);
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
            async.forEach(races, function (race, callback1) {
                var count = 0;
                async.forEach(race.bars, function (currItem, callback2) {
                        Bar.find({'_id': currItem.bar}, function(err,bar){
                            if(bar[count] != 'undefined'){
                                race.bars[count] = {'bar':bar,'visited': false};
                            }
                            count = count +1;
                            callback2(err);
                        });  
                }, callback1);
            }, function (err) {
                callback(null, races);
            });
            }
        ], function (err, result) {
            renderPage(getHeaderType(req),result,'race',auth.validAction(req.user),res);
        });
        
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
                    console.log('reached!');
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
               response.on('error', function(err){
                  console.log('duh'); 
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

function getUsers(req,res){
    
}

function Add(query,type,id){
     Race.findOne(query,function (err,race) {
         switch(type){
             case 'user':
                race.users.push(id);
                break;
             case 'bar':
                race.bars.push(id);
                break;
         }
        race.save(function(err) {
            if (err)
                res.json(err);
            else
                res.json(race);
        });
    });
}

function addUser(req,res){
    Add(getRequestId(req),'user',req.body._id);
}

function addBar(req,res){
    Add(getRequestId(req),'bar',req.body._id);
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

