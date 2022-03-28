import { createSlice } from '@reduxjs/toolkit'

export default createSlice({ 
    name: "messagesData",
    initialState: [],
    reducers: {
        set_room_messagesData:(state,action) => {
            const res = state.find(mess => mess.id === action.payload.id);
            if(res === undefined){
                state.push({...action.payload, currentDonate:null})
            }
            else{
                res.chatsData = [...action.payload.chatsData]
                res.donatesData = [...action.payload.donatesData]
            }
        },
        add_chat(state, action){
            const res = state.find(mess => mess.id === action.payload.id)
            if(res === undefined){
                const data = {
                    id: action.payload.id,
                    chatsData: [{...action.payload.chatData}],
                    donatesData: [],
                    currentDonate: null
                }
                state.push(data)
            }
            else{
                res.chatsData = [{...action.payload.chatData}, ...res.chatsData]
            }
        },
        add_donate(state, action){
            const res = state.find(mess => mess.id === action.payload.id)
            if(res === undefined){
                const data = {
                    id: action.payload.id,
                    chatsData: [],
                    donatesData: [{...action.payload.donateData}],
                    currentDonate: {...action.payload.donateData}
                }
                state.push(data)

            }
            else{
                res.donatesData = [{...action.payload.donateData}, ...res.donatesData]
                res.currentDonate = {...action.payload.donateData, isShow: false}
            }
        },
        set_isShowCurrentDonate: (state, action) => {
            const res = state.find(mess => mess.id === action.payload)
            if(res !== undefined){
                const curDonate = res.currentDonate
                curDonate.isShow = true
            }
        },
        remove_messSageRoomData(state, action){
            const res = state.find(mess => mess.id === action.payload)
            if(res !== undefined){
                const newList = state.filter(mess => mess.id !== action.payload)
                return newList
            }
        },
        reset_messages(state, action){
            if(action.payload === true)
                return []
        }
    }
})