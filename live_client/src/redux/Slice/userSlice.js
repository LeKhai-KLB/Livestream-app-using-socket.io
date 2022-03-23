import { createSlice } from '@reduxjs/toolkit'

export default createSlice({
    name: 'user',
    initialState: {
        name: '',
        id: '',
        image: '',
        coins: 10000
    },
    reducers: {
        set_user: (state, action) => {
            state.name = action.payload.name
            state.id = action.payload.id
            state.image = action.payload.image
        },
        update_coin: (state, action) => {
            state.coins = action.payload
        },
        reset_user: (state, action) => {
            if(action.payload === true){
                return {
                    name: '',
                    id: '',
                    image: '',
                    coins: 10000
                }
            }
        }
    }
})