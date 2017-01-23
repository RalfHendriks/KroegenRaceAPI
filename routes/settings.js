var express = require('express');
var router = express.Router();
var pageHelper;

function InitRoute(){
    router.get('/settings', function(req, res) {
        pageHelper.renderPage(req,res,'settings',[]);
    });
}

module.exports = function (helper){
    pageHelper = helper;
    InitRoute();
    return router;
};