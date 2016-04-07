module.exports = function(mongoose){
    var raceSchema = new mongoose.Schema({
        name: String,
        created_at: Date,
        updated_at: Date,
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        bars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bar' }],
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
