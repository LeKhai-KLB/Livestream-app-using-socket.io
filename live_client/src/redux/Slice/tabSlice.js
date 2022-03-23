import { createSlice } from '@reduxjs/toolkit'

export default createSlice({
    name: 'tab',
    initialState: 'home',
    reducers: {
        set_tab: (state, action) => {
            const tab = action.payload
            return tab
        },
        reset_tab: (state, action) => {
            if(action.payload === true){
                return 'home'
            }
        }
    }
})