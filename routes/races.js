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
var userCtrl;

router.route('/')
    .get(getRaces)
    .post(addRace);
    
router.route('/:id')
    .get(getRace)
    .delete()
    .put();
    
router.route('/:id/participants')
    .get()
    .put(addUser)
    .delete(removeUser);

router.route('/:id/participants/:userid')
    .get();

router.route('/:id/bars/')
    .get()
    .put(addBar);
    
router.route('/:id/bars/:barid')
    .get()
    .put(checkIn)
    .delete(removeBar);
 
module.exports = function(race,user,bar,userctrl) {
    Race = race;
    User = user;
    Bar = bar;
    userCtrl = userctrl;
    return router;
};

function checkIn(req,res){
    var barId = req.params.barid;
    Race.find({'_id': req.params.id}, function(err, race) {
         race[0].bars.forEach(function(element) {
             if(element.bar == barId){
                 console.log('true');
                 element.visited = req.body.visited;
                 race[0].save(function(err,newbar){
                     console.log(err);
                 });
             }
         }, this);
    });
}

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
                path: '/maps/api/place/nearbysearch/json?key=AIzaSyD3PUPRq9aJRVeCXaIJo2_FDb6mEAxTSWE&location='+req.body.lat+','+req.body.lng+'&radius=2000&type=night_club|bar|cafe'
            };
            console.log(options);
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
                        newBar.google_id = googlePlacesBar.place_id;
                        newBar.available = true;
                        bars.push(newBar);
                    });
                    callback(null,
                        bars
                    );
                });
               response.on('error', function(err){
                  console.log(err); 
               }); 
            });
        },
        function(bars, callback) {
            bars.forEach(function(selectedBar){
                Bar.findOne({'name' : selectedBar.name,'lat': selectedBar.lat,'long': selectedBar.long} ,function (err,bar) {
                    if(bar == null){
                    selectedBar.save(function(err,newbar){
                            selectedBar = newbar;
                        });
                    }
                    else
                    {
                        console.log('b');
                        selectedBar = bar;
                    }
                });
            });
            callback(null, bars);
        },
        function(barlist, callback) {
        async.each(barlist,function(bar, callback){
            console.log(bar);
            newRace.bars.push({'bar':bar,'visited':false});
            callback();
        },
        // 3rd param is the function to call when everything's done
        function(err){
            newRace.save(function(err){
               console.log(err); 
            });
            callback(null);
        }
        );
            /*barlist.forEach(function(bar){
                newRace.bars.push({'bar':bar,'visited':false});
            });*/
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

function Add(query,type,id,res){
     Race.findOne(query,function (err,race) {
         switch(type){
             case 'user':
             console.log(id);
                race.participants.push(id);
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

function Remove(query,type,id,res){
     Race.findOne(query,function (err,race) {
        var i  = (type == 'user' ? race.participants.indexOf(id) : race.bars.indexOf(id));
        if(i != -1){
             switch(type){
                case 'user':
                    race.participants.splice(i,1);
                    break;
                case 'bar':
                    race.bars.splice(i,1);
                    break;
            }
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

function addUser(req,res){
    var items = req.body.users;
    
    if(items.length == 0){
        res.json('Empty list!');
    }
    async.waterfall([
        function(callback) {
            Race.find({'_id': req.params.id}, function(err, race) {
                callback(err, race[0]);
                });
        },
        function(race, callback) {
            userCtrl.addToRace(race,items,callback);
        },
        function(updatedRace,callback){
           updatedRace.save(function(err,race) {
               callback(null,race);
           });
        }
    ], function (err,race) {
        res.json(race);
    });
    //Add(getRequestId(req),'user',req.body._id,res);
}

function removeUser(req,res){
    var items = req.body.users;
    if(items.length == 0){
        res.json('Empty list!');
    }
    async.waterfall([
        function(callback) {
            Race.find({'_id': req.params.id}, function(err, race) {
                callback(err, race[0]);
                });
        },
        function(race, callback) {
            userCtrl.removeFromRace(race,items,callback);
        },
        function(updatedRace,callback){
            updatedRace.save(function(err,race) {
                callback(null,race);
            });
        }
    ], function (err,race) {
        res.json(race);
    });
    //Remove(getRequestId(req),'user',req.body._id,res);
}

function addBar(req,res){
    Add(getRequestId(req),'bar',req.body._id,res);
}

function removeBar(req,res){
    Remove(getRequestId(req),'bar',req.body._id,res);
}

function getRequestId(req){
    var q = {}
    if(req.params.id){
        q._id = req.params.id;
    }
    return q;
}

