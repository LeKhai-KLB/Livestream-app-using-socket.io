import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import userSlice from './Slice/userSlice'
import roomsSlice from './Slice/roomsSlice'
import darkThemeSlice from './Slice/darkThemeSlice'
import tabSlice from './Slice/tabSlice'
import tagsSlice from './Slice/tagsSlice'
import filterSlice from './Slice/filterSlice'
import messagesDataSlice from './Slice/messagesDataSlice' 
import { 
persistStore, 
persistReducer,
FLUSH,
REHYDRATE,
PAUSE,
PERSIST,
PURGE,
REGISTER, } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
}

const reducer = combineReducers({
    user: userSlice.reducer,
    rooms: roomsSlice.reducer,
    darkTheme: darkThemeSlice.reducer,
    tab: tabSlice.reducer,
    tags: tagsSlice.reducer,
    filter: filterSlice.reducer,
    messagesData: messagesDataSlice.reducer 
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
export default store