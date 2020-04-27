const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String || Number
    },
    password: {
        type: String || Number || CharacterData,
    },
    imgUrl: {
        type: String
    }
})

var Users = mongoose.model('User', userSchema);

module.exports = Users