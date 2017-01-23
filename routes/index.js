var express = require('express');
var router = express.Router();
var pageHelper;

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

    router.get('/admin', function(req, res) {
        pageHelper.renderPage(req,res,'admin',[]);
    });
}

module.exports = function (helper){
    pageHelper = helper;
    InitRoute();
    return router;
};

