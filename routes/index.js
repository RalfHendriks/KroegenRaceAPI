module.exports = function(router,passport) {
    
    /* GET home page. */
    router.get('/', function(req, res) {
        res.render('index', { title: 'Express' });
    });
    
    // locally --------------------------------
    router.get('/login', function(req, res) {
        res.render('login', { message: req.flash('loginMessage') });
    });
    
    router.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
    
    router.get('/signup', function(req, res) {
        res.render('signup', { message: req.flash('signupMessage') });
    });

    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    // facebook -------------------------------
    
    router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    
    router.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));
    
    // google ---------------------------------

	// send to google to do the authentication
	router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

	// the callback after google has authenticated the user
	router.get('/auth/google/callback',
		passport.authenticate('google', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));
    
    return router;
};





//module.exports = router;
