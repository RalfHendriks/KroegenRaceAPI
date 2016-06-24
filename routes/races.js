var express = require('express');
var router = express.Router();
var _ = require('underscore');
var https = require('https');
var async = require('async');
var authorization = require('../config/authorization');
var auth = new authorization();
var Race;
var Bar;

router.route('/')
    .get(getRaces)
    .post(addRace);

router.route('/create')
    .get(createRace);
    
router.route('/:id')
    .get(getRace)
    .delete()
    .put();
    
router.route('/:id/participants')
    .get(getParticipants)
    .put()
    .post(addUser)
    .delete();

router.route('/:id/participants/:userid')
    .get()
    .delete(removeUser);

router.route('/:id/bars/')
    .get(getBars)
    .post(addBar)
    .delete();
    
router.route('/:id/bars/:barid')
    .get()
    .put(checkIn)
    .delete(removeBar);
 
module.exports = function(race,bar) {
    Race = race;
    Bar = bar;
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
                     res.json('succes');
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
                    res.render(target, {data: data,userPermission: permission });
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

function processQuery(requestQuery){
    var query = {};
    if(requestQuery.sort){
        switch (requestQuery.sort) {
            case 'asc':
                query = {created_at: 'asc'};
                break;
            case 'desc':
                query = {created_at: 'desc'};
                break;
        }
        console.log(query.date);
    }
    return query;
}

function createRace(req,res){
    renderPage(getHeaderType(req),'createRace','create_race',auth.validAction(req.user),res);
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
    Race.find(query)
        .populate('bars.bar')
        .populate('participants')
        .exec(function (err, result) {
            renderPage(getHeaderType(req),result,'race',permissionLevel,res);
        });
}

function getRace(req,res){
    var query = getRequestId(req);
    Race.findOne(query)
        .populate('bars.bar')
        .populate('participants')
        .populate('raceLeader')
        .exec(function (err, result) {
            if(err != undefined){
                res.json('Invalid Id');
            }
            else{
                console.log(result);
                renderPage(getHeaderType(req),result,'racedetails',auth.validAction(req.user),res);
            }
        });
}

function getParticipants(req,res){
    var query = getRequestId(req);
    Race.findOne(query)
        .populate('participants')
        .exec(function (err, result) {
            console.log(err);
            renderPage(getHeaderType(req),result.participants,'race',auth.validAction(req.user),res);
        });
}

function addRace(req, res){
    var newRace = new Race(req.body);
    var bars = [];
    if(req.body.bars[0].bar == undefined){
        req.body.bars.forEach(function(selectedBar){
            var bar = {
                "bar": selectedBar,
                "visited": false
            };
            bars.push(bar);
        });
        newRace.bars = bars;
    }
    newRace.save(function(err,race){
        req.body.bars.forEach(function(selectedBar){
            var newBar = new Bar(selectedBar);
            Bar.findOne({'name' : selectedBar.name,'lat': selectedBar.lat,'long': selectedBar.long} ,function (err,bar) {
                if(bar == null){
                    newBar.races.push(race);
                    newBar.save(function(err,currentBar){});
                }
            });
        });
        res.json(race); 
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
                race.bars.push(
                    {
                        "bar": id,
                        "visited": false
                    });
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
    var query = getRequestId(req);
    var processedItems = 0;
    var error;
    var unkownparticipants = [];
     
    if(items.length == 0){
        res.json('Empty list!');
    }

    items.forEach(function(item) {
        Race.findOne({_id:req.params.id,participants:item }, function (err,result) {
            if(err != undefined){
                error = err;
                unkownparticipants.push(item);
            }
            else{
                if(result == undefined){
                    Race.update(query,{$push: {participants: item } },function (err,result) {
                        if(err)
                        console.log(err);
                    });
                }
            }
            processedItems++;
            if(processedItems == items.length){
                if(error != undefined){
                    res.json('Invalid participant in array! '+unkownparticipants);
                }
                else{
                    res.json('Participants added.');
                }
            }
        });
    });
}

function removeUser(req,res){
    var query = getRequestId(req);
    Race.update(query, { $pull: { participants: req.params.userid } } , function (err,result){
       if(err){
         console.log(err);
       }
       if(result.nModified > 0){
            res.json('Participant removed.');
        }
        else{
            res.json('No valid participant.');
        }
    });
}

function getBars(req,res){
    var query = getRequestId(req);
    Race.findOne(query)
        .populate('bars.bar')
        .exec(function (err, result) {
            console.log(err);
            renderPage(getHeaderType(req),result.bars,'race',auth.validAction(req.user),res);
        });
}

function addBar(req,res){
    var items = req.body.bars;
    var query = getRequestId(req);
    var processedItems = 0;
    var error;
    var unkownBars = [];
    
    if(items.length == 0){
        res.json('Empty list!');
    }
    
    items.forEach(function(item) {
        Race.find({"bars.bar": item}, function (err,result) {
            if(err != undefined){
                error = err;
                unkownBars.push(item);
            }
            else{
                if(result[0] == undefined){
                    var newBar = {
                        "bar": item,
                        "visited": false
                    };
                    Race.update(query,{$push: {bars: newBar } },function (err) {
                        if(err)
                        console.log(err);
                    });
                }
            }
            processedItems++;
            if(processedItems == items.length){
                console.log(unkownBars);
                if(error != undefined){
                    res.json('Invalid bars in array! '+unkownBars);
                }
                else{
                    res.json('Bars added.');
                }
            }
        });
    });
}

function removeBar(req,res){
    var query = getRequestId(req);
    
    Race.update(query, { $pull: { 'bars':{'bar': req.params.barid } } } , function (err,result){
        if(err){
            console.log(err);
        }
        if(result.nModified > 0){
            res.json('Invalid bar!');
        }
        else{
            res.json('Bar removed.');
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

