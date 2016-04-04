
var mongoose = require('mongoose');

module.exports = function(uri){
    
    mongoose.connect(uri, function(err) {
        if (err) throw err;
    });
    
    return mongoose;
}