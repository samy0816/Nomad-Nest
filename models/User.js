const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }
});

UserSchema.plugin(passportLocalMongoose);

// IMPORTANT FIX
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;