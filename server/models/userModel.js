const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id:{
        type: String,
    },
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)