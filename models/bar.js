module.exports = function(mongoose){
    var barSchema = new mongoose.Schema({
        name: String,
        location         : {
            lat          : { type: Number },
            long         : { type: Number },
        },
    });
   
    return mongoose.model('Bar', barSchema);
};