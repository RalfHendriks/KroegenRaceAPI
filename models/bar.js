module.exports = function(mongoose){
    var barSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        location: {
            lat: { type: Number, required: true },
            long: { type: Number, required: true }
        }
    });

    barSchema.methods.findDuplicate = function findDuplicate (cb) {
        return this.model('Bar').find({ name: this.name }, cb);
    };
   
    return mongoose.model('Bar', barSchema);
};