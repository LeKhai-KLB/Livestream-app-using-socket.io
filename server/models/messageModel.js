const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({ 
    id: { 
        type: String,
        required: true
    },
    chatsData: [],
    donatesData: []
})

module.exports = mongoose.model('Messages', messagesSchema)