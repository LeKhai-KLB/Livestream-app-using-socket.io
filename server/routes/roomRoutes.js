const { createRoom, deleteRoom, getAllRoom, joinRoom, getRoomById } = require('../controllers/roomController')
const router = require('express').Router()

router.post('/create', createRoom)
router.post('/delete', deleteRoom)
router.post('/joinRoom', joinRoom)
router.post('/getRoomById', getRoomById)
router.get('/getAllRoom', getAllRoom)

module.exports = router
