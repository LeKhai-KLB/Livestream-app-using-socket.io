import {createSlice} from '@reduxjs/toolkit'

export default createSlice({
    name: 'rooms',
    initialState: {
        userRoom: '',
        currentRoom: '',
        roomList: [],
        roomSubscribedList: []
    }, 
    reducers:{
        set_userRoom: (state, action) => {
            state.userRoom = action.payload;
        },
        set_currentRoom: (state, action) => {
            state.currentRoom = action.payload;
        },
        set_roomList: (state, action) => {
            if(state.roomList.length < action.payload.length){
                for(let i = state.roomList.length; i < action.payload.length; i++){
                    state.roomList.push(action.payload[i]);
                }
            }
        },
        set_roomById: (state, action) => {
            const id = action.payload.id
            let room = state.roomList.find(r => r.id === id)
            if(room){
                room = {...action.payload}
            }
        },
        add_roomList: (state, action) => {
            if(action.payload !== undefined) {
                const res = state.roomList.findIndex(r => action.payload.id === r.id)
                if(res === -1) {
                    state.roomList.push(action.payload);
                }
            }
        },
        remove_room: (state, action) => {
            if(action.payload.user === 'this'){
                const newRoomList = state.roomList.filter(room => room.id !== action.payload.id)
                state.roomList = newRoomList
                state.userRoom = ''
            }
            else{
                const res = state.roomList.find(r => r.id === action.payload.id)
                const newStateUserList = res.userList.filter(u => u.id !== action.payload.user.id)
                res.userList = newStateUserList
                res.views -= 1;
                const newRoomSubscribedList = state.roomSubscribedList.filter(id => id !== action.payload.id)
                state.roomSubscribedList = newRoomSubscribedList
            }
        },
        destroy_other_room: (state, action) => {
            const res = state.roomList.findIndex(r => r.id === action.payload)
            if(res !== -1){
                const newRes = state.roomSubscribedList.findIndex(id => id === action.payload)
                if(newRes !== -1){
                    const newRoomSubscribedList = state.roomSubscribedList.filter(id => id !== action.payload)
                    state.roomSubscribedList = newRoomSubscribedList
                }
                const newRoomList = state.roomList.filter(room => room.id !== action.payload)
                state.roomList = newRoomList
            }
        },
        add_roomSubscribedList: (state, action) => {
            if(!state.roomSubscribedList.find(r => r === action.payload.id)){
                state.roomSubscribedList.push(action.payload.id);
            }
        },
        add_user_join_room: (state, action) => {
            const { id, user } = action.payload;
            const room = state.roomList.find(r => r.id === id)
            if(room !== undefined) {
                const res_in_whiteList = room.userList.find(u => u.id === user.id)
                const res_in_blackList = room.blackList.find(u => u.id === user.id)
                if(res_in_whiteList === undefined && res_in_blackList === undefined) {
                    room.userList.push(user)
                    room.views += 1
                }
            }
        },
        ban_user: (state, action) => {
            const {id, userData} = action.payload;
            const room = state.roomList.find(r => r.id === id)
            if(room !== undefined) {
                const newRoom = room.userList.filter(u => u.id !== userData.id)
                room.userList = newRoom
                room.views -= 1
                room.blackList.push(userData)
            }
        },
        remove_roomSubscribedList: (state, action) => {
            const newState =  state.roomSubscribedList.filter(r => r !== action.payload)
            state.roomSubscribedList = newState
        },
        remove_user_after_leave: (state, action) => {
            const { id, user } = action.payload;
            const room = state.roomList.find(r => r.id === id)
            if(room !== undefined){
                if(room.userList.findIndex(u => u.id === user.id) !== -1){
                    const newRoom = room.userList.filter(u => u.id !== user.id)
                    room.userList = newRoom
                    room.views -= 1
                }
            }
        },
        reset_rooms: (state, action) => {
            if(action.payload === true){
                return {
                    userRoom: '',
                    currentRoom: '',
                    roomList: [],
                    roomSubscribedList: []
                }
            }
        }
    }
})