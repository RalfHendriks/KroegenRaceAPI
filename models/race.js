module.exports = function(mongoose){
    var raceSchema = new mongoose.Schema({
        name: String,
        created_at: Date,
        updated_at: Date,
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    });
    

    
    return mongoose.model('Race', raceSchema);
};