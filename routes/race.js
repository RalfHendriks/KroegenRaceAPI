var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var Race;

router.route('/')
    .get(loadMain)
    .post(addRace);
    
router.route('/:id')
    .get()
    .delete()
    .put();
    
router.route('/:id/participants')
    .get()
    .post();

router.route('/:id/participants/:id')
    .get()
    .put()
    .delete();
 
module.exports = function(race) {
    
    Race = race;
    return router;

};

function loadMain(req, res){
    res.render('race', {});
}

function addRace(req, res){
    var header = res.header();
    var newRace = new Race(req.body);
    newRace.save(function(err, savedRace){
		if(err){
            res.json(err);
         }
		else {
			res.status(201);
			res.json(newRace);
		}
	});
}