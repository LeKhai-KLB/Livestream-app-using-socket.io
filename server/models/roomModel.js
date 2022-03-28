const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    id:{
        type: String, 
        required: true, 
        unique: true
    },
    name:{ 
        type: String, 
        required: true,
    },
    avatar: {
        type: String, 
        required: true,
    },
    title:{ 
        type: String, 
        required: true
    },
    description:{
        type: String, 
        required: true
    }, 
    thumbnail:{ 
        type: String, 
        required: true
    },
    views:{ 
        type: Number,
        required: true
    },
    tags:[
        
    ],
    userList:[

    ],
    blackList: [ 
    ]
})

module.exports = mongoose.model("Room", roomSchema)