var express = require('express');
var router = express.Router();
var authorization = require('../config/authorization');
var auth = new authorization();
var User = null;


module.exports = function(user) {
    User = user;
    return router;
};

    router.route('/')
        .get(getUsers)
        .post(addUser);
        
    router.route('/:id')
        .put(updateUser);
        /*if(true){
            var x = getUsers();
            console.log(x);
            res.render('userList', {users: x,userPermission: auth.validAction(req.user) });  
        }
        
    });*/

function getUsers(req,res)
{
    var permission = auth.validAction(req.user);
    if(permission == '1'){
        User.find({}, function(err, users) {
            var userMap = [];
            users.forEach(function(user) {
                userMap.push(user);
            });
            res.render('userList', {users: userMap,userPermission: permission });  
        });
    }
    else{
        res.render('404');  
    }

}

function addUser(req,res)
{
    
}

function updateUser(req,res)
{
    
}
