const asyncHandler = require('express-async-handler')
const Payment = require('../models/paymentModel')

// Controlador para crear un nuevo pago
const createPayment = asyncHandler(async (req, res) => {
  try {
    const { request, amount, currency, paymentMethod } = req.body

    const payment = new Payment({
      request,
      amount,
      currency,
      paymentMethod,
      status: 'pendiente'
    })

    await payment.save()

    res.status(201).json({ success: true, payment })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Controlador para obtener detalles de un pago por ID
const getPaymentById = asyncHandler(async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('request')

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' })
    }

    res.json({ success: true, payment })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Controlador para actualizar el estado de un pago por ID
const updatePaymentStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' })
    }

    res.json({ success: true, payment })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
});

// Controlador para cancelar un pago por ID
const cancelPayment = asyncHandler(async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' })
    }

    if (payment.status !== 'pendiente') {
      return res.status(400).json({ success: false, error: 'No se puede cancelar un pago que no está pendiente' })
    }

    payment.status = 'cancelado'
    await payment.save()

    res.json({ success: true, payment })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = { cancelPayment, getPaymentById, createPayment, updatePaymentStatus }

