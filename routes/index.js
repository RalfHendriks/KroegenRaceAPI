var express = require('express');
var router = express.Router();
var async = require('async');
var pageHelper;
var barHelper;

function InitRoute(){
    /* GET home page. */
    router.get('/', function(req, res) {
        pageHelper.renderPage(req,res,'index',[]);
    });
    
    router.get('/logout',function(req,res){
       req.session.destroy();
       res.redirect('/'); 
    });
    
    router.get('/home', function(req, res) {
        pageHelper.renderPage(req,res,'home',[]);
    });

    router.get('/docs', function(req, res) {
        pageHelper.renderPage(req,res,'doc',[]);
    });

    router.get('/getnearbyplaces', function(req, res) {
        var loc = {};
        if(req.query.lat != undefined)
            loc.lat = req.query.lat;

        if(req.query.lng != undefined)
            loc.lng = req.query.lng;

        async.waterfall([
            function(callback) {
                callback(null, loc);
            },
            barHelper.getNearbyPlaces
        ], function (err, result) {
            if(err) return res.json(err);

            res.json(result);
        });
        
    });
}

module.exports = function (helper, bar){
    pageHelper = helper;
    barHelper = bar;
    InitRoute();
    return router;
};

