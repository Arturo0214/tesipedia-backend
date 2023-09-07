const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/paymentModel');

// Controlador para crear un nuevo pago
const createPayment = asyncHandler(async (req, res) => {
  try {
    const { request, currency, metodoPago, costo } = req.body;

    // Verificar si la solicitud ya tiene un pago asociado
    const existingPayment = await Payment.findOne({ request });
    if (existingPayment) {
      return res.status(400).json({ success: false, error: 'La solicitud ya tiene un pago asociado' });
    }

    // Crear un intento de pago en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: costo * 100, // El monto en centavos
      currency,
      payment_method_types: [metodoPago], // Tipo de método de pago, ej. 'card'
    });

    // Crear el registro del pago en la base de datos
    const payment = new Payment({
      request,
      currency,
      metodoPago,
      costo,
      status: 'pendiente',
      stripePaymentIntentId: paymentIntent.id, // Almacena el ID del intento de pago de Stripe
    });

    await payment.save();

    // Respuesta con la URL de la API y el stripeApiKey
    res.status(201).json({
      success: true,
      payment,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

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
    const { status } = req.body;

    // Verificar si el usuario que realiza la solicitud es un administrador
    if (!req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'No tienes permisos para realizar esta operación' });
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' });
    }

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Controlador para cancelar un pago por ID
const cancelPayment = asyncHandler(async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' });
    }

    // Verificar si el usuario que realiza la solicitud es un administrador
    if (!req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'No tienes permisos para realizar esta operación' });
    }

    if (payment.status !== 'pendiente') {
      return res.status(400).json({ success: false, error: 'No se puede cancelar un pago que no está pendiente' });
    }

    payment.status = 'cancelado';
    await payment.save();

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const completePayment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Busca el pago en la base de datos por su ID
  const payment = await Payment.findById(id);

  if (!payment) {
    return res.status(404).json({ success: false, error: 'Pago no encontrado' });
  }

  // Verifica si el estado actual del pago es 'pendiente'
  if (payment.status === 'pendiente') {
    // Actualiza el estado del pago a 'completado'
    payment.status = 'completado';
    await payment.save();

    res.json({ success: true, payment });
  } else {
    res.status(400).json({ success: false, error: 'El pago no está pendiente' });
  }
});

// Controlador para obtener la clave secreta de Stripe
const getStripeSecretKey = async (req, res) => {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (secretKey) {
      res.json({ secretKey });
    } else {
      res.status(500).json({ error: 'La Stripe Secret Key no está configurada en el servidor.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { cancelPayment, getPaymentById, createPayment, updatePaymentStatus, completePayment, getStripeSecretKey }

