import {createSlice} from '@reduxjs/toolkit'
import Rooms_table from '../../data/Rooms_table'

export default createSlice({
    name: 'rooms',
    initialState: {
        userRoom: '',
        currentRoom: '',
        roomList: Rooms_table,
        roomSubscribedList: []
    }, 
    reducers:{
        set_userRoom: (state, action) => {
            state.userRoom = action.payload;
        },
        set_currentRoom: (state, action) => {
            state.currentRoom = action.payload;
        },
        add_roomList: (state, action) => {
            state.roomList.push({...action.payload});
        },
        remove_room: (state, action) => {
            if(action.payload === state.userRoom){
                const newRoomList = state.roomList.filter(room => room.id !== action.payload)
                state.roomList = newRoomList
                state.userRoom = ''
            }
            else{
                const res = state.roomList.find(r => r.id === action.payload)
                res.views -= 1;
                const newRoomSubscribedList = state.roomSubscribedList.filter(id => id !== action.payload)
                state.roomSubscribedList = newRoomSubscribedList
            }
        },
        add_roomSubscribedList: (state, action) => {
            if(!state.roomSubscribedList.find(r => r === action.payload)){
                state.roomSubscribedList.push(action.payload);
                const res = state.roomList.find(r => r.id === action.payload)
                res.views += 1;
            }
        },
        reset_rooms: (state, action) => {
            if(action.payload === true){
                return {
                    userRoom: '',
                    currentRoom: '',
                    roomList: Rooms_table,
                    roomSubscribedList: []
                }
            }
        }
    }
})