import { createSlice } from '@reduxjs/toolkit'

export default createSlice({
    name: 'darkTheme',
    initialState: false,
    reducers: {
        set_darkTheme: (state, action) => {
            return action.payload
        },
        reset_darkTheme: (state, action) => {
            if(action.payload === true){
                return false;
            }
        }
    }
})