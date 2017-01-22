module.exports = function(mongoose){
    var raceSchema = new mongoose.Schema({
        id: false,
        name: {
            type: String,
            required: true,
            min: 2,
            max: 25
        },
        created_at: Date,
        updated_at: Date,
        raceleader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        bars: [{ _id:false,
                 google_id: {
                    type: String,
                    required: true
                },
                 visited_participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
                },{id: false}],
    }, {
        toObject: {virtuals: true},
        toJSON: {virtuals: true}
    });

    raceSchema.virtual('amount_bars').get(function () {
        return this.bars.length;
    });

    raceSchema.virtual('amount_participants').get(function () {
        return this.participants.length;
    });

    raceSchema.virtual('has_winner').get(function () {
        for(var i = 0; i < this.participants.length; i++) {
            var visited_count = 0;
            for(var j = 0; j < this.bars.length; j++) {
                if(this.bars[j].visited_participants.indexOf(this.participants[i]._id) != -1)
                    visited_count++;

                if(visited_count === this.bars.length)
                    return this.participants[i]; // We've got a winner!
            }
        }
        return false;
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
