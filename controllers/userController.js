var _ = require('underscore');
var https = require('https');
var async = require('async');
var User;
var self;

function Users(user) {
    User = user;
    self = this;
};

Users.prototype.addToRace = function(race,users,mainCallback){
    async.waterfall([
        function(callback) {
            async.forEach(users, function (user, callback1) {
                User.find({'local.email':user},function(err,foundUser){
                    if(foundUser[0] == undefined){
                        var newUser = new User();
                        newUser.local.email = user;
                        newUser.role = 'user';
                        newUser.name = 'undefined';
                        newUser.save(function(err,createdUser) {
                            if (err){
                                console.log(err);
                            }
                            else{
                                race.participants.push(createdUser._id);
                            }
                            callback1();
                        });
                    }
                    else{
                        race.participants.push(foundUser[0]._id);
                        callback1();
                    }
                    
                });
            }, function (err) {
                callback(null,'');
            });
        }
    ],
     function (err, result) {
        mainCallback(null,race);
    });
};

Users.prototype.removeFromRace = function(race,users,mainCallback){
    async.waterfall([
        function(callback) {
            async.forEach(users, function (user, callback1) {
                var index = race.participants.indexOf(user);
                if(index != -1){
                    race.participants.splice(index,1);
                }
                callback1();
            }, function (err) {
                callback(null,'');
            });
        }
    ],
        function (err, result) {
        mainCallback(null,race);
    });
};

Users.prototype.add = function(users){
    console.log('rest');
};

Users.prototype.find = function(users){
    var newUserList = [];
    async.forEach(users, function(item, callback1){
            User.find({'_id':item}, function(err,user){
                newUserList.push(user);
                callback1();
            });
        },
        function(err){
            return newUserList; 
        }
    );
}

module.exports = Users;

    