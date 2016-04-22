var express = require('express');
var router = express.Router();
var authorization = require('../config/authorization');
var auth = new authorization();
var Bar;


module.exports = function(bar) {
    Bar = bar;
    var c = 0;
    return router;
};

