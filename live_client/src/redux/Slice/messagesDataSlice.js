import { createSlice } from '@reduxjs/toolkit'

export default createSlice({ 
    name: "messagesData",
    initialState: [],
    reducers: {
        add_chat(state, action){
            const res = state.find(mess => mess.id === action.payload.id)
            if(res === undefined){
                const data = {
                    id: action.payload.id,
                    chatsData: [{...action.payload.data}],
                    donatesData: [],
                    currentDonate: undefined
                }
                state.push(data)
            }
            else{
                res.chatsData = [{...action.payload.data}, ...res.chatsData]
            }
        },
        add_donate(state, action){
            const res = state.find(mess => mess.id === action.payload.id)
            if(res === undefined){
                const data = {
                    id: action.payload.id,
                    chatsData: [],
                    donatesData: [{...action.payload.data}],
                    currentDonate: {...action.payload.data}
                }
                state.push(data)

            }
            else{
                res.donatesData = [{...action.payload.data}, ...res.donatesData]
                res.currentDonate = {...action.payload.data, isShow: false}
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