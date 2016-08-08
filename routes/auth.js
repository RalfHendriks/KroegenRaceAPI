var express = require('express');
var router = express.Router();

router.route('/login')
    get()
    post(validateLogin);
 
router.route('/logout')
    get(logout);
    
router.route('/singup')
    get()
    post(registerUser);
    
router.route('/google')
    get();
    
router.route('/facebook')
    get();
   
router.route('/google/callback')
    get();
    
router.route('/facebook/callback')
    get();



module.exports = function() {
    return router;
};