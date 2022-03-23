import { createSlice } from '@reduxjs/toolkit'

export default createSlice({
    name: 'filter',
    initialState: {
        text: '',
        tag: ''
    },
    reducers: {
        set_text: (state, action) => {
            state.text = action.payload
        },
        set_tag: (state,action) => {
            state.tag = action.payload
        },
        set_filter: (state, action) => {
            return action.payload
        },
        reset_filter: (state, action) =>{
            if(action.payload === true){
                state.text = ''
                state.tag = ''
            }
        }
    }
})