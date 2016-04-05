var express = require('express');
var router = express.Router();

function testFunction(req,res){
    console.log('first');
    console.log(req.user);
    if(req.user == 'admin')
    {
        res.render('race', { result: null});
    }
}

function secondFunction(req,res){
    console.log('second');
    res.render('race', {result: null});
}

module.exports = function(passport) {
    
    router.get('/', function(req, res) {
            console.log(req.isAuthenticated());
            res.render('race', { result: passport});
    });
  
    router.get('/:id', function(req, res) {
            console.log(req.isAuthenticated());
            res.render('race', { result: passport});
    });
  
    router.post('/', function(req, res) {

    });
    
    router.get('/id:/participants/', function(req, res) {

    });
    
    router.delete('/id:/participants/:id', function(req, res) {

    });
    
    router.post('/addparticipant/:id', function(req, res) {

    });
  
  return router;
};