const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { createRequest, cancelRequest, getRequest, updateRequest } = require('../controllers/requestController')

router.route('/').post(protect, createRequest)
router.route('/:id').get(protect, getRequest).put(protect, updateRequest)
router.route('/:id/cancel').put(protect, cancelRequest)

module.exports = router
