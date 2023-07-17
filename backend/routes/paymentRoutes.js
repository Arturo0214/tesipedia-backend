const express = require('express')
const router = express.Router()
const paymentController = require('../controllers/paymentController')
const emailService = require('../services/emailService')

// Ruta para crear un nuevo pago
router.post('/payments', async (req, res) => {
  try {
    const { request, amount, currency, paymentMethod } = req.body

    const payment = await paymentController.createPayment(
      request,
      amount,
      currency,
      paymentMethod
    );

    // Enviar correo electrónico de notificación
    emailService.sendPaymentNotificationEmail(payment)

    res.status(201).json({ success: true, payment })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Ruta para obtener los detalles de un pago por ID
router.get('/payments/:id', async (req, res) => {
  try {
    const payment = await paymentController.getPaymentById(req.params.id);

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' })
    }

    res.json({ success: true, payment })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
});

// Ruta para actualizar el estado de un pago por ID
router.put('/payments/:id', async (req, res) => {
  try {
    const { status } = req.body

    const payment = await paymentController.updatePaymentStatus(req.params.id, status)
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' })
    }

    res.json({ success: true, payment })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Ruta para cancelar un pago por ID
router.put('/payments/:id/cancel', async (req, res) => {
  try {
    const payment = await paymentController.cancelPayment(req.params.id)

    res.json({ success: true, payment })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
});

module.exports = router
