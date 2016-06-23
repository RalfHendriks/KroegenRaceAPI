var express = require('express');
var authorization = require('../config/authorization');
var auth = new authorization();
var router = express.Router();

module.exports = function(passport) {
    
    /* GET home page. */
    router.get('/', function(req, res) {
        res.render('index', {userPermission: auth.validAction(req.user) });
    });
    
    // locally --------------------------------
    router.get('/login', function(req, res) {
        console.log(req.get('Content-Type'));
        res.render('login', { message: req.flash('loginMessage'), userPermission: auth.validAction(req.user) });
    });
    
    router.get('/logout',function(req,res){
       req.session.destroy();
       res.redirect('/'); 
    });
    
    router.get('/home', function(req, res) {
        res.render('home', { userPermission: auth.validAction(req.user) });
    });

    router.post('/login', passport.authenticate('local-login', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
    
    router.get('/signup', function(req, res) {
        res.render('signup', { message: req.flash('signupMessage'), userPermission: auth.validAction(req.user) });
    });

    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    // facebook -------------------------------
    
    router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    
    router.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/',
				failureRedirect : '/'
			}));
    
    // google ---------------------------------

	// send to google to do the authentication
	router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

	// the callback after google has authenticated the user
	router.get('/auth/google/callback',
		passport.authenticate('google', {
			successRedirect : '/',
			failureRedirect : '/'
		}));
    
    return router;
};
