function init(mongoose,bcrypt){

    var userSchema = new mongoose.Schema({
        name: String,
        role: String,
        age: Date,
        created_at: Date,
        updated_at: Date,
        local            : {
            email        : { type: String },
            password     : { type: String },
        },
        facebook         : {
            id           : String,
            token        : String,
            email        : String,
            name         : String
        },
        google           : {
            id           : String,
            token        : String,
            email        : String,
            name         : String
        }
    });

    userSchema.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };
    
    // on every save, add the date
    userSchema.pre('save', function(next) {
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
    
    // checking if password is valid
    userSchema.methods.validPassword = function(password) {
        return bcrypt.compareSync(password, this.local.password);
    };
    
    mongoose.model('User', userSchema);
};

module.exports = init;
