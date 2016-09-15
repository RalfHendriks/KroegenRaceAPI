var express = require('express');
var router = express.Router();

module.exports = function(authController,passport) {

    //middelware that runs before all other functions
    //router.use(authController.getUserRole);

    router.route('/home')
        .get(authController.isLoggedIn,authController.home);

    router.route('/login')
        .get(authController.login)
        .post(passport.authenticate('local-login', {failureFlash : true}),
            function(req,res,next){
                if(req.get('Content-Type') == 'application/json'){
                    console.log('json call');
                    authController.getUserObject(req,res);
                }
                else{
                    res.render('home', {userPermission: authController.getUserRole(req)});
                }
            },
             function(error,req,res,next){
                 console.log(error);
             }
        );
 
    router.route('/logout')
        .get(authController.logout);
        
    router.route('/signup')
        .get(authController.signup)
        .post(passport.authenticate('local-signup', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/auth/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // send to google to do the authentication
    router.route('/google')
        .get(passport.authenticate('google', { scope : ['profile', 'email'] }));

    // send to facebook to do the authentication
    router.route('/facebook')
        .get(passport.authenticate('facebook', { scope : 'email' }));

    // the callback after google has authenticated the user
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