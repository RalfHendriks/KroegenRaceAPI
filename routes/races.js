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
        /*async.waterfall([
            function(callback) {
                Race.find(query).sort('-date').exec(function(err, races) {
                    callback(null, races);
                  });
            },
            function(races, callback) {
            var bars = [];
            async.each(races, function(race, callback){
                async.each(race.bars, function(object, callback){
                    Bar.find({'_id': object.bar}, function(err,bar){
                        if(bar[0] != 'undefined'){
                            bars.push({'bar':bar,'visited': false});
                        }
                        callback();
                    });  
                },
                   function(err){
                     console.log(bars);
                    }
                );
                callback();
            },
            // 3rd param is the function to call when everything's done
                function(err){
                    callback(null, bars);
                }
            );

                /*races.forEach(function(race){
                    race.bars.forEach(function(object){
                       Bar.find({'_id': object.bar}, function(err,bar){
                                if(bar[0] != 'undefined'){
                                    bars.push({'bar':bar,'visited': false});
                                }
                       });  
                    });
                });
                callback(null, bars);
            },
            function(arg1, callback) {
                callback(null, 'done');
            }
        ], function (err, result) {
            // result now equals 'done'
        });*/
        var c = {
    "_id": {
        "$oid": "5727626940262c24107885a3"
    },
    "created_at": {
        "$date": "2016-05-02T14:21:29.658Z"
    },
    "updated_at": {
        "$date": "2016-05-02T14:21:29.658Z"
    },
    "name": "Race budel 1",
    "raceLeader": {
        "$oid": "5702c4981adb13154894face"
    },
    "bars": [
        {
            "bar": {
                "_id": {
        "$oid": "572761e3935a6fe80a765193"
    },
    "available": true,
    "name": "zuiderpoortCafé",
    "ratings": [],
    "location": {
        "long": 5.5692172,
        "lat": 51.2609826,
        "address": {
            "city": " Budel",
            "street": "Sportlaan 7"
        }
    }
            },
            "visited": false
        },
        {
            "bar": {
                 "_id": {
        "$oid": "572761e3935a6fe80a765194"
    },
    "available": true,
    "name": "Discotheek The Energy",
    "ratings": [],
    "location": {
        "long": 5.576710399999999,
        "lat": 51.2745177,
        "address": {
            "city": " Budel",
            "street": "Deken van Baarsstraat 3"
        }
    }
            },
            "visited": false
        },
        {
            "bar": {
                "_id": {
        "$oid": "572761e3935a6fe80a765195"
    },
    "available": true,
    "name": "Café Zaal De Bellevue",
    "ratings": [],
    "location": {
        "long": 5.581622299999998,
        "lat": 51.2778522,
        "address": {
            "city": " Budel",
            "street": "Maarheezerweg 1"
        }
    }
            },
            "visited": false
        },
        {
            "bar": {
                "_id": {
        "$oid": "572761e3935a6fe80a765196"
    },
    "available": true,
    "name": "De Bonte Os - eetcafé & zaal",
    "ratings": [],
    "location": {
        "long": 5.576281900000001,
        "lat": 51.2746131,
        "address": {
            "city": " Budel",
            "street": "Doctor Ant. Mathijsenstraat 12"
        }
    }
            },
            "visited": false
        },
        {
            "bar": {
                  "_id": {
        "$oid": "572761e3935a6fe80a765197"
    },
    "available": true,
    "name": "Kès & zo",
    "ratings": [],
    "location": {
        "long": 5.575871599999999,
        "lat": 51.2738556,
        "address": {
            "city": " Budel",
            "street": "Capucijnerplein 15"
        }
    }
            },
            "visited": false
        },
        {
            "bar": {
                 "_id": {
        "$oid": "572761e3935a6fe80a765198"
    },
    "available": true,
    "name": "Cambrinus Bar",
    "ratings": [],
    "location": {
        "long": 5.575727199999999,
        "lat": 51.2740201,
        "address": {
            "city": "Budel"
        }
    }
            },
            "visited": false
        },
        {
            "bar": {
                 "_id": {
        "$oid": "572761e3935a6fe80a765199"
    },
    "available": true,
    "name": "Café Quincy",
    "ratings": [],
    "location": {
        "long": 5.574822,
        "lat": 51.27478439999999,
        "address": {
            "city": " Budel",
            "street": "Markt 25"
        }
    }
            },
            "visited": false
        },
        {
            "bar": {
                "_id": {
        "$oid": "572761e3935a6fe80a76519a"
    },
    "available": true,
    "name": "Café 't Huukske",
    "ratings": [],
    "location": {
        "long": 5.5720964,
        "lat": 51.27384209999999,
        "address": {
            "city": " Budel",
            "street": "Molenstraat 1"
        }
    }
            },
            "visited": false
        },
        {
            "bar": {
                 "_id": {
        "$oid": "572761e3935a6fe80a76519b"
    },
    "available": true,
    "name": "De Bierparel",
    "ratings": [],
    "location": {
        "long": 5.5767471,
        "lat": 51.2743325,
        "address": {
            "city": " Budel",
            "street": "Deken van Baarsstraat 5"
        }
    }
            },
            "visited": false
        },
        {
            "bar": {
                "_id": {
        "$oid": "572761e3935a6fe80a76519c"
    },
    "available": true,
    "name": "Proost",
    "ratings": [],
    "location": {
        "long": 5.5763934,
        "lat": 51.274458,
        "address": {
            "city": " Budel",
            "street": " Deken van Baarsstraat 1"
        }
    }
            },
            "visited": false
        },
        {
            "bar": {
                "_id": {
        "$oid": "572761e3935a6fe80a76519d"
    },
    "available": true,
    "name": "Helmi's Kafee",
    "ratings": [],
    "location": {
        "long": 5.5750887,
        "lat": 51.2739956,
        "address": {
            "city": " Budel",
            "street": "Capucijnerplein 10"
        }
    }
            },
            "visited": false
        },
        {
            "bar": {
                 "_id": {
        "$oid": "572761e3935a6fe80a76519e"
    },
    "available": true,
    "name": "City Bar",
    "ratings": [],
    "location": {
        "long": 5.574284899999999,
        "lat": 51.27456639999999,
        "address": {
            "city": " Budel",
            "street": "Markt 19"
        }
    }
            },
            "visited": false
        }
    ],
    "participants": [],
    "__v": 0
};
        res.json(c);
        //renderPage(req.accepts('text/html', 'application/json'),raceMap,'race',auth.validAction(req.user),res);
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

