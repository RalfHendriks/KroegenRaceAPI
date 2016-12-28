var User;
var Self;

module.exports = function(user){
  //init controller properties
  User = user;
  Self = this;
  
  this.login = function(req,res,next){
     res.render('login', { message: req.flash('loginMessage'), userPermission: Self.getUserRole(req)});
  };

  this.signup = function(req,res,next){
    res.render('signup', { message: req.flash('signupMessage'), userPermission: Self.getUserRole(req) });
  }; 

  this.logout = function(req,res,next) {
    req.session.destroy();
    res.redirect('/'); 
  };

  this.proccessValidLogin = function(req,res,next){
    if(req.get('Content-Type') == 'application/json')
        Self.renderUserObject(req,res);
    else
        res.render('home', {userPermission: Self.getUserRole(req)});
  };

  this.proccessInvalidLogin = function(req,res,next){
      if(req.get('Content-Type') == 'application/json')
        res.json('Invalid password');
      else{
        console.log('redirect!!');
                res.redirect('/auth/login');
      }
  };

  this.getUserObject = function(req,res,next){
    var userResponse = req.user.toObject();
    delete userResponse["google"];
    delete userResponse["facebook"];
    delete userResponse.local.password;
    return userResponse;
  };

  this.renderUserObject = function(req,res,next){
        var userResponse = req.user.toObject();
        delete userResponse["google"];
        delete userResponse["facebook"];
        delete userResponse.local.password;
        res.json(userResponse);
  };

  this.getUserRole = function(req,res,next){
    if(req.user == undefined)
      return 'visitor';
    else
      return req.user.role;
  };

  this.renderUserRole = function(req,res,next){
      if(req.user == undefined)
        res.json('visitor');
      else
        res.json(req.user.role);
  };

  this.isLoggedIn = function(req,res,next) {
    if(req.user == undefined){
        res.status(403).send('Forbidden');
    }
    else{
        return true;
    }
  };

  this.hasAcces = function(req,res,next){
    try {
          if(req.user == undefined){
        res.status(403).send('Forbidden');
    }
    else{
        return true;
    }
    } catch (error) {
      console.log(error);
    }

  };

  /*this.hasAcces = function(req,res,next){
      return 'hello';
  };*/

};