module.exports = function(mongoose){
    var raceSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            min: 2,
            max: 20
        },
        created_at: Date,
        updated_at: Date,
        raceLeader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        bars: [{ bar: {type: mongoose.Schema.Types.ObjectId, ref: 'Bar'},
                 visited: {type: Boolean, default:false, required: true},
                _id: false  }],
    });
   
    raceSchema.pre('save', function(next) {
        var currentDate = new Date();
        this.updated_at = currentDate;
            if (!this.created_at){
                this.created_at = currentDate;
                this.updated_at = currentDate;
            }
            else{
                this.updated_at = currentDate;
            }
        next();
    });
   
    return mongoose.model('Race', raceSchema);
};
