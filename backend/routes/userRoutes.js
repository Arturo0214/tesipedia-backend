const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMisDatos } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/misdatos', protect, getMisDatos)

module.exports = router