var express = require('express');
var router = express.Router();

module.exports = function(passport) {
    
    /* GET home page. */
    router.get('/', function(req, res,action) {
        console.log(req.user);
        if(!req.user){
            res.render('index', { title: 'Express' });
        }
        else{
            res.render('home', { title: 'Express' });
        }
    });
    
    // locally --------------------------------
    router.get('/login', function(req, res,action) {
        console.log(req.isAuthenticated());
        console.log(req.user);
        if(!req.user){
            res.render('login', { message: req.flash('loginMessage') });
        }
        else{
            res.redirect('/');
        }
    });
    
    router.get('/list', function(req, res) {
        
        console.log('pre');
        console.log(req.user);
        /*User.find({}, function(err, users) {
            var userMap = {};
            console.log('reached list');
            users.forEach(function(user) {
            userMap[user._id] = user;
            });

            res.render('listtest', { results: userMap });
        });*/
    }); 
    
    router.get('/home', function(req, res) {
        console.log(req.user.role);
        res.render('home', { title: 'Express' });
    });
    
    router.post('/login', passport.authenticate('local-login', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
    
    router.get('/signup', function(req, res) {
        res.render('signup', { message: req.flash('signupMessage') });
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





//module.exports = router;
