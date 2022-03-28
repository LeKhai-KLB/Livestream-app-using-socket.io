const Room = require('../models/roomModel')
const User = require('../models/userModel')

module.exports.createRoom = async(req, res, next) => {
    try{
        const id = req.body.id
        const checkId = await Room.findOne({ id })
        if(checkId){
            return res.json({msg: "id already exists", status: false})
        }
        const newRoom = await Room.create({ 
            ...req.body
        })
        return res.json({status: true, newRoom})
    }
    catch(ex){
        next(ex)
    }
} 

module.exports.deleteRoom = async(req, res, next) => {
    try{
        const id = req.body.id
        const room = await Room.findOne({id})
        await Room.deleteOne({ id })
        return res.json({msg: 'deleted', status: true, tags: room.tags})
    }
    catch(ex){
        next(ex)
    }
}

module.exports.getRoomById = async(req, res, next) => {
    try{
        const id = req.body.id
        const room = await Room.findOne({id})
        if(room){
            return res.json({status: true, roomData: room, msg: "found room"})
        }
        else{
            return res.json({status: false, msg: "Can't find room'"})
        }
    }
    catch(ex){
        next(ex)  
    }
}

module.exports.getAllRoom = async(req, res, next) => {
    try{
        const roomList = await Room.find();
        return res.json({status: true, roomList: [...roomList]})
    }
    catch{ex}{
        next(ex)
    }
}

module.exports.joinRoom = async(req, res, next) => {
    try{
        const {roomId, userId} = req.body;
        const room = await Room.findOne({ id: roomId })
        if(!room){
            return res.json({status:false, msg: "Can't find room"})
        }
        const user = await User.findOne({ id: userId })
        if(!user){
            return res.json({status:false, msg: "Can't find user"})
        }
        
        if(room.blackList.findIndex(u => u.id === userId) !== -1){
            return res.json({status:false, msg: "You are not allowed to join this room"})
        }
        if(room.userList.findIndex(u => u.id === userId) === -1){
            await Room.findOneAndUpdate({id: roomId}, {$push: {userList: user}, $set: {views:room.userList.length + 1}}, {new: true})
            return res.json({status:true, msg: "Successfully join the room"})
        }
        else{
            return res.json({status: false, msg: "You are already in this room"})
        }
    }
    catch(ex){
        next(ex)
    }
}