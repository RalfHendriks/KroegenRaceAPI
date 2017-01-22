module.exports = function(mongoose,bcrypt){

    var userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            min: 2,
            max: 20
        },
        role: {
            type: String,
            required: true,
            default: 'user',
            enum: ['admin', 'user']
        },
        created_at: Date,
        updated_at: Date,
        local            : {
            email        : { type: String },
            password     : { type: String },
        },
        facebook         : {
            id           : { type: String, select: false },
            token        : { type: String, select: false },
            email        : { type: String },
            name         : { type: String }
        },
        google           : {
            id           : { type: String, select: false },
            token        : { type: String, select: false },
            email        : { type: String },
            name         : { type: String }
        } 
    });

    userSchema.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    userSchema.methods.isAdmin = function () {
        return this.role == 'admin';
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
    
    return mongoose.model('User', userSchema);
};

