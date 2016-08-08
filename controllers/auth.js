
module.exports = {
    
  logout: function login(req,res,next) {
    req.session.destroy();
    res.redirect('/'); 
  }, 

  isLoggedIn: function(req,res,next) {
    var loggedUser = req.user;
    if(req.user == undefined){
        res.status(403).send('Forbidden');
    }
    else{
        return true;
    }
  },

  hasNeededPermission: function(req,res,next){
      var permissions = req.user.role;
  }
};