var express = require('express');
var router = express.Router();
var pass,auth;

function Init(){
    router.route('/login')
        .get(auth.login)
        .post(pass.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/auth/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages        
        }));
        
    router.route('/json_login')
        .post(pass.authenticate('local-login', {
            successRedirect : '/auth/succes', // redirect to the secure profile section
            failureRedirect : '/auth/failure', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages        
        }));

    router.route('/succes')
        .get(auth.proccessValidLogin);

    router.route('/failure')
        .get(auth.proccessInvalidLogin);

    router.route('/logout')
        .get(auth.logout);

    router.route('/signup')
        .get(auth.signup)
        .post(pass.authenticate('local-signup', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/auth/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    router.route('/google')
        .get(pass.authenticate('google', { scope : ['profile', 'email'] }));

    router.route('/facebook')
        .get(pass.authenticate('facebook', { scope : 'email' }));

    router.route('/google/callback')
        .get(pass.authenticate('google', {
			successRedirect : '/home',
			failureRedirect : '/'
		}));
        
    router.route('/facebook/callback')
        .get(pass.authenticate('facebook', {
				successRedirect : '/home',
				failureRedirect : '/'
		})); 
}

module.exports = function(authController,passport) {
        pass = passport;
        auth = authController;
        Init();
        return router;
};