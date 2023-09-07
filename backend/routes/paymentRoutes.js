const express = require('express');
const router = express.Router();
const { protect, requireStripeApiKey } = require('../middleware/authMiddleware');
const {
  createPayment,
  cancelPayment,
  getPaymentById,
  updatePaymentStatus,
  completePayment,
  getStripeSecretKey
} = require('../controllers/paymentController');
const {
  checkPaymentExists,
  validatePaymentAmount,
  checkPaymentStatus,
  auditPaymentAction,
  additionalSecurity,
} = require('../middleware/paymentMiddleware');

// Ruta para crear un nuevo pago
router.route('/').post(
  protect,
  validatePaymentAmount, // Middleware para validar el monto del pago
  auditPaymentAction, // Middleware para auditoría de acciones
  createPayment
);

// Ruta para obtener la clave secreta de Stripe
router.route('/get-stripe-secret-key').get(
  protect,
  getStripeSecretKey // Controlador para obtener la clave secreta de Stripe
);


// Ruta para obtener un pago por su ID
router.route('/:id').get(
  protect,
  requireStripeApiKey, // Middleware de autenticación
  checkPaymentExists, // Middleware para verificar si un pago existe por su ID
  getPaymentById
);

// Ruta para actualizar el estado de un pago por su ID
router.route('/:id/update-status').put(
  protect,
  requireStripeApiKey, // Middleware de autenticación
  checkPaymentExists, // Middleware para verificar si un pago existe por su ID
  checkPaymentStatus('pendiente'), // Middleware para verificar el estado del pago
  updatePaymentStatus
);

// Ruta para cancelar un pago por su ID
router.route('/:id/cancel').put(
  protect,
  requireStripeApiKey, // Middleware de autenticación
  checkPaymentExists, // Middleware para verificar si un pago existe por su ID
  checkPaymentStatus('pendiente'), // Middleware para verificar el estado del pago
  auditPaymentAction, // Middleware para auditoría de acciones
  cancelPayment
);

// Ruta para marcar un pago como completado por su ID
router.route('/:id/complete').put(
  protect,
  requireStripeApiKey, // Middleware de autenticación
  checkPaymentExists, // Middleware para verificar si un pago existe por su ID
  checkPaymentStatus('pendiente'), // Middleware para verificar el estado del pago
  auditPaymentAction, // Middleware para auditoría de acciones
  completePayment
);



module.exports = router;


