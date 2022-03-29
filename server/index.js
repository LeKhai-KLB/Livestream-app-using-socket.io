const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes')
const roomRoutes = require('./routes/roomRoutes')
const messagesRoutes = require('./routes/messagesRoute')
const User = require('./models/userModel')
const Room = require('./models/roomModel')
const Messages = require('./models/messageModel')
const socket = require('socket.io')
const app = express();
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use('/api/user', userRoutes)
app.use('/api/room', roomRoutes)
app.use('/api/messages', messagesRoutes)

const server = require('http').Server(app)

mongoose
    .connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Connected to DB')
        server.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log('error', err)
    });

const io = socket(server, { 
    cors: {
        origin: '*',
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log('client connected')

    socket.on('log-out', async(data) => {
        console.log('client log out')
        if(data.isHadRoom){
            socket.broadcast.emit('room-destroy', {id: data.id, tags: data.tags})
            socket.to(data.id).emit('curent-room-destroy')
        }

        if(data.followedRooms.length !== 0){
            for(let i = 0; i < data.followedRooms.length; i++){
                const room = await Room.findOne({ id: data.followedRooms[i] })
                if(room){
                    await Room.findOneAndUpdate({id: data.followedRooms[i]}, {$pull: {userList: {id: data.user.id}}, $set: {views:room.views - 1}})
                    socket.to(data.followedRooms[i]).emit('user-leaved-room', data.user)
                }

            }
        }
        socket.disconnect()
    })

    socket.on('destroy-room', (data) => {
        socket.broadcast.emit('room-destroy', {id: data.id, tags: data.tags})
        socket.to(data.id).emit('curent-room-destroy')
    })

    socket.on('create-room', (newRoom) => {
        socket.join(newRoom.id)
        socket.broadcast.emit('new-room-created', newRoom)
        console.log(newRoom.id)
    })

    socket.on('join-room', (data) => {
        const { id, user } = data

        console.log('client join room')
        console.log()
            socket.join(id)
            socket.to(id).emit('new-user-joined', user)
        
    })  

    socket.on('send-chat', async(data) => {
        const { id, chatData } = data
        
        const messagesData = await Messages.findOne({id})
        if(messagesData){
            console.log('user-send-chat')
            await Messages.findOneAndUpdate({id: id}, {$push:{chatsData: chatData}})
            socket.to(id).emit('user-send-chat', {id: id, chatData: chatData})
        }
    })

    socket.on('send-donate',async(data) => {
        const {id, donateData} = data
        const messagesData = await Messages.findOne({id})
        if(messagesData){
            console.log('user-send-donate')
            await Messages.findOneAndUpdate({id: id}, {$push:{donatesData: donateData}})
            socket.to(id).emit('user-send-donate', {id: id, donateData: donateData})
        }
    })

    socket.on('set-stream', async(data) => {
        const {id , signalData, userId} = data
        console.log('set-stream')
        const room = await Room.findOne({id})
        if(room){
            socket.to(id).emit('get-stream', {signalData: signalData, userId: userId})
        }
    })

    socket.on('client-accept-stream', async(data) => {
        const {id, signalData, userId} = data
        console.log('client-accept-stream')
        const room = await Room.findOne({id})
        if(room){
            socket.to(id).emit('successfully-connected-peer', {signalData: signalData, userId: userId})
        }
    })

    socket.on('ban-user', async(data) => {
        const {id, userData} = data
        const room = await Room.findOne({ id: id })
        if(room){
            await Room.findOneAndUpdate({id: id}, {$pull: {userList: {id: userData.id}}, $push: {blackList: userData}, $set: {views:room.views - 1}}, {new: true})
        }
        socket.to(id).emit('user-banned', {userData: userData})
    })

    socket.on('leave-room', async(data) => {
        const { id, user, isOut } = data

        console.log('client leave room')

        socket.leave(id);
        socket.to(id).emit('destroy-peer', {userId: user.id})
        
        if(isOut){
            const room = await Room.findOne({ id: id })
            if(room){
                await Room.findOneAndUpdate({id: id}, {$pull: {userList: {id: user.id}}, $set: {views:room.views - 1}}, {new: true})
            }
            socket.to(id).emit('user-leaved-room', user)
        }
        
    })
})
