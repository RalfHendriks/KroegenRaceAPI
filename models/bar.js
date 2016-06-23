module.exports = function(mongoose){
    var barSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        google_id: {
            type: String,
            required: true
        },
        location: {
            lat: { type: Number, required: true },
            long: { type: Number, required: true },
            address: { 
                street: {type: String, required: false},
                city: {type: String, required: true}
            }
        },
        ratings: 
            [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
               score: { type: Number, required: true},
               comment: {type: String, required: false} }],
        available: {
            type: Boolean,
            required: true
        },
        races: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Race' }]
    });

    barSchema.methods.findDuplicate = function findDuplicate (cb) {
        return this.model('Bar').find({ name: this.name }, cb);
    };
    
    barSchema.pre('save', function(next) {
        next();
    });
   
    return mongoose.model('Bar', barSchema);
};