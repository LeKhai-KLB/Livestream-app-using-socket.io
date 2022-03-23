const { register, deleteUser } = require('../controllers/userController')

const router = require('express').Router()

router.post('/register', register)
router.post('/delete', deleteUser)

module.exports = router