var mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    UserName: {
        type: String,
        trim: true,  
        required: true  
    },
    Password: {
        type: String,
        trim: true,  
        required: true
    },
    FirstName: {
        type: String,
        trim: true,  
        required: true
    },
    LastName: {
        type: String,
        trim: true,  
        required: true

    }
});

UserSchema.pre('save', function(next){
    const hash = bcrypt.hashSync(this.Password, saltRounds);
    this.Password=hash;
    next();
});

var users = new mongoose.model('Users',UserSchema);

module.exports = users;