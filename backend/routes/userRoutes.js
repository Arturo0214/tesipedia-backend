const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMisDatos, getAllUsers, getUserById } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/misdatos', protect, getMisDatos)
router.get('/getusers', protect, getAllUsers)
router.get('/:id', protect, getUserById)

module.exports = router