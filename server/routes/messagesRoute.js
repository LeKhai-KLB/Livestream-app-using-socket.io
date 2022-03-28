const { createMessages, deleteMesages, getMessagesByRoomId } = require('../controllers/messagesController')
const router = require('express').Router()

router.post('/create', createMessages)
router.post('/delete', deleteMesages)
router.post('/getMessages', getMessagesByRoomId)

module.exports = router
