import { createSelector } from '@reduxjs/toolkit'

const userSelectorSelf = state => state.user
const roomSelectorSelf = state => state.rooms
const darkThemeSelectorSelf = state => state.darkTheme
const tabSelectorSelf = state => state.tab
const tagsSelectorSelf = state => state.tags
const filterSliceSelf = state => state.filter
const messagesDataSliceSelf = state => state.messagesData

//get all tags
export const tagsSelector = createSelector(tagsSelectorSelf, state => state.map(t => t.tag))

//get current tab 
export const tabSelector = createSelector(tabSelectorSelf, (state) => {return state})

//get darkTheme
export const darkThemeSelector = createSelector(darkThemeSelectorSelf, (state) => {return state})

// get current user
export const userSelector = createSelector(userSelectorSelf, (user) => {return user})

// get room of user
export const userRoomSelector = createSelector(roomSelectorSelf,userSelectorSelf, (rooms, user) => {
    return rooms.roomList.find(r => r.id === user.id)
})

//get current room id
export const curRoomIdSelector = createSelector(roomSelectorSelf, (rooms) => {
    return rooms.currentRoom
})

// get current room 
export const curRoomSelector = createSelector(roomSelectorSelf, (rooms) => {
    return rooms.roomList.find(r => r.id === rooms.currentRoom)
})

// get all room of website
export const roomListSelector = createSelector(roomSelectorSelf, (rooms) => {
    return rooms.roomList
})

// get all room Subscribed 
export const roomSubscribedListSelector = createSelector(roomSelectorSelf, (rooms) => {
    return rooms.roomList.filter(r =>{
        return rooms.roomSubscribedList.find(s => r.id === s)
    })
})

// get rooom by filter 
export const remainingRoomsSelector = createSelector(filterSliceSelf, roomSelectorSelf, (filter, rooms) => {
    return rooms.roomList.filter(r => {
        return (r.id.includes(filter.text) || 
                r.name.toLowerCase().includes(filter.text.toLowerCase()) ||
                r.title.toLowerCase().includes(filter.text.toLowerCase())) 
                && (r.tags.findIndex(tag => tag.toLowerCase().includes(filter.tag.toLowerCase())) !== -1)
    })
})

//get chats data with current room id
export const chatsDataSelector = createSelector(roomSelectorSelf, messagesDataSliceSelf, (rooms, messagesData) => {
    const mess =  messagesData.find(data => data.id === rooms.currentRoom)
    return mess === undefined ? undefined:mess.chatsData
})

//get donates data with current room id
export const donatesDataSelector = createSelector(roomSelectorSelf, messagesDataSliceSelf, (rooms, messagesData) => {
    const mess =  messagesData.find(data => data.id === rooms.currentRoom)
    return mess === undefined ? undefined:mess.donatesData
})

//get currentDonate
export const currentDonateSelector = createSelector(roomSelectorSelf, messagesDataSliceSelf, (rooms, messagesData) => {
    const mess =  messagesData.find(data => data.id === rooms.currentRoom)
    return mess === undefined ? null:mess.currentDonate
})
