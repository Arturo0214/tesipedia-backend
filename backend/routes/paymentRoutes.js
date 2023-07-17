const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createPayment, cancelPayment, getPaymentById, updatePaymentStatus } = require('../controllers/paymentController');

router.route('/').post(protect, createPayment);
router.route('/:id').get(protect, getPaymentById).put(protect, updatePaymentStatus);
router.route('/:id/cancel').put(protect, cancelPayment);

module.exports = router;
