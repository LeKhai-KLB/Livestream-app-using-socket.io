const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    id:{
        type: String, 
        required: true, 
        unique: true
    }
})