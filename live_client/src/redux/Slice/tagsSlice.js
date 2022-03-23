import { createSlice } from '@reduxjs/toolkit'
import Tags_table from '../../data/Tags_table';

export default createSlice({
    name: 'tags',
    initialState: Tags_table,
    reducers: {
        add_tags: (state, action) => {
            return action.payload.forEach(element => {
                const i = state.findIndex(s => {
                    return s.tag.toLowerCase() === element.toLowerCase();
                })
                if(i === -1){
                    state.push({tag:element, count: 1})
                }
                else{
                    state[i].count += 1
                }
            });
        },
        remove_tags: (state, action) => {
            let newState;
            action.payload.forEach(element => {
                const res = state.find(s => {
                    return s.tag.toLowerCase() === element.toLowerCase();
                })
                if(res.count === 1){
                    newState = state.filter(t => t.tag !== res.tag)
                }
                else{
                    res.count -= 1;
                    newState = state
                }
            })
            return newState
        },
        reset_tags: (state, action) => {
            if(action.payload === true){
                return Tags_table;
            }
        }
    }
})