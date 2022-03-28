const Messages = require('../models/messageModel')
const Room = require('../models/roomModel')

module.exports.createMessages = async(req, res, next) => {
    try{
        const id = req.body.id
        const room = await Room.findOne({ id })
        const messages = await Messages.findOne({ id })
        if(!room) {
            return res.json({status: false, msg: "Can't find this room"})
        }
        if(messages) {
            return res.json({status: false, msg: "This message for this room had been created"})
        }
        await Messages.create({
            id: id, 
            chatsData: [],
            donatesData: []
        })
        return res.json({status: true, msg: "Successfully created"})
    }
    catch(ex){
        next(ex)
    }
}

module.exports.deleteMesages = async(req, res, next) => {
    try{
        const id = req.body.id
        const messages = await Messages.findOne({ id: id })
        if(!messages){
            return res.json({status: false, msg: "No messages found"})
        }
        await Messages.deleteOne({ id: id })
        return res.json({status: true, msg: 'successfully deleted'})
    }
    catch(ex){
        next(ex)
    }
}

module.exports.getMessagesByRoomId = async(req, res, next) => {
    try{
        const id = req.body.id
        const messages = await Messages.findOne({ id: id })
        if(!messages){
            return res.json({status: false, msg: "No messages found"})
        }
        return res.json({status: true, messages: messages})
    }
    catch(ex){
        next(ex)
    }
}