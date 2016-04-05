function init(mongoose){
    var raceSchema = new mongoose.Schema({
        name: String,
        created_at: Date,
        updated_at: Date,
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        //bars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bar' }],
    });
   
    mongoose.model('Race', raceSchema);
};

module.exports = init;