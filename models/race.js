module.exports = function(mongoose){
    var raceSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            min: 2,
            max: 25
        },
        created_at: Date,
        updated_at: Date,
        raceleader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        bars: [{ _id:false,
                 google_id: {
                    type: String,
                    required: true
                },
                 visited_participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
                },{id: false}],
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
