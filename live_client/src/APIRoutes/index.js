export const host = "http://localhost:5000"

//user
export const registerRoute = `${host}/api/user/register`
export const deleleUserRoute = `${host}/api/user/delete`

// room
export const createRoomRoute = `${host}/api/room/create`
export const deleteRoomRoute = `${host}/api/room/delete`
export const getAllRoomRoute = `${host}/api/room/getAllRoom`
export const getRoomByIdRoute = `${host}/api/room/getRoomById`
export const joinRoomRoute = `${host}/api/room/joinRoom`

// messages
export const createMessagesRoute = `${host}/api/messages/create`
export const deleteMessagesRoute = `${host}/api/messages/delete`
export const getMessagesRoute = `${host}/api/messages/getMessages`