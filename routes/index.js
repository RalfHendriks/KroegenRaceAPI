var express = require('express');
var router = express.Router();

module.exports = function(auth) {
    
    /* GET home page. */
    router.get('/', function(req, res) {
        res.render('index', {userPermission: auth.getUserRole(req,res) });
    });
    
    router.get('/logout',function(req,res){
       req.session.destroy();
       res.redirect('/'); 
    });
    
    router.get('/home', function(req, res) {
        res.render('home', { userPermission: auth.getUserRole(req,res) });
    });

    router.get('/docs', function(req, res) {
        res.render('doc', {userPermission: auth.getUserRole(req,res) });
    });

    router.get('/admin', function(req, res) {
        res.render('admin', {userPermission: auth.getUserRole(req,res) });
    });

    /*
        router.post('/login', passport.authenticate('local-login', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        router.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
    */
    return router;
};
