var express = require('express');
var router = express.Router();

module.exports = function(authController,passport) {

    router.route('/home')
        .get(authController.isLoggedIn);

    router.route('/login')
        .get()
        .post(passport.authenticate('local-login', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
 
    router.route('/logout')
        .get(authController.logout);
        
    router.route('/singup')
        .get()
        .post();
        
    router.route('/google')
        .get();
        
    router.route('/facebook')
        .get(passport.authenticate('facebook', { scope : 'email' }));
    
    router.route('/google/callback')
        .get();
        
    router.route('/facebook/callback')
        .get();  
          
    return router;
};