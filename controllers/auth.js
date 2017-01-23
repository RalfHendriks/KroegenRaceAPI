var controller = {};

module.exports = function(pageHelper){
  
  controller.login = function(req,res,next){
     pageHelper.renderPage(req,res,'login',[]);
     //res.render('login', , userPermission: 'user'});
  };

  controller.signup = function(req,res,next){
    res.render('signup', { message: req.flash('signupMessage'), userPermission: 'user' });
  }; 

  controller.logout = function(req,res,next) {

    req.session.destroy();
    res.redirect('/'); 
  };

  controller.GetRole = function(req,res,next){
    return req.user.role;
  }

  controller.proccessValidLogin = function(req ,res){
    if(req.get('Content-Type') == 'application/json')
        Self.renderUserObject(req,res);
    else{
        res.render('home', {userPermission: 'user'});
    }
  };

  controller.proccessInvalidLogin = function(req, res){
        if(req.get('Content-Type') == 'application/json')
            res.json('Invalid password');
        else
            res.redirect('/auth/login');
  };

  /*this.getUserObject = function(req,res,next){
    var userResponse = req.user.toObject();
    delete userResponse["google"];
    delete userResponse["facebook"];
    delete userResponse.local.password;
    return userResponse;
  };

  this.renderUserObject = function(req,res,next){
      console.log(req.user);
        var userResponse = req.user.toObject();
        delete userResponse["google"];
        delete userResponse["facebook"];
        delete userResponse.local.password;
        res.json(userResponse);
  }; */

  /*this.getUserRole = function(req,res,next){
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

  };*/

  /*this.hasAcces = function(req,res,next){
      return 'hello';
  };*/

  return controller;
};