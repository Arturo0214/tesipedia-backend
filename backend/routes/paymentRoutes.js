const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {checkPaymentExists} = require('../middleware/paymentMiddleware')
const { 
    createPayment, 
    cancelPayment, 
    getPaymentById, 
    updatePaymentStatus, 
    completePayment } = require('../controllers/paymentController')

router.route('/').post(protect, createPayment)
router.route('/:id').get(protect, getPaymentById).put(protect, updatePaymentStatus)
router.route('/:id/cancel').put(protect, cancelPayment)
router.route('/:id/complete').put(protect, completePayment)

module.exports = router
