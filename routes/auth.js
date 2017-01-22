var express = require('express');
var router = express.Router();

module.exports = function(authController,passport) {

    router.route('/login')
        .get(authController.login)
        .post(function(req, res, next) {
            passport.authenticate('local-login', function(err, user) {
                if (err) { return next(err); }

                if (!user) {
                    authController.proccessInvalidLogin(req, res);
                } else {
                    req.user = user;
                    authController.proccessValidLogin(req, res);
                }
            })(req, res, next);
        });

    router.route('/logout')
        .get(authController.logout);

    router.route('/signup')
        .get(authController.signup)
        .post(passport.authenticate('local-signup', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/auth/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    router.route('/google')
        .get(passport.authenticate('google', { scope : ['profile', 'email'] }));

    router.route('/facebook')
        .get(passport.authenticate('facebook', { scope : 'email' }));

    router.route('/google/callback')
        .get(passport.authenticate('google', {
			successRedirect : '/home',
			failureRedirect : '/'
		}));
        
    router.route('/facebook/callback')
        .get(passport.authenticate('facebook', {
				successRedirect : '/home',
				failureRedirect : '/'
		})); 
          
    return router;
};