const Payment = require('../models/paymentModel');
const AuditLog = require('../models/auditLogModel');

// Middleware para verificar si un pago existe por su ID
const checkPaymentExists = async (req, res, next) => {
  try {
    const paymentId = req.params.id;
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' });
    }

    // Adjuntar el objeto de pago a la solicitud para que los controladores posteriores puedan acceder a él
    req.payment = payment;

    next(); // Continuar con la siguiente función de middleware o controlador
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Middleware para validar el monto del pago
const validatePaymentAmount = (req, res, next) => {
  const { costo } = req.body;

  if (typeof costo !== 'number' || costo <= 0) {
    return res.status(400).json({ success: false, error: 'El monto del pago no es válido' });
  }

  next();
};

// Middleware para verificar el estado del pago
const checkPaymentStatus = (status) => {
  return (req, res, next) => {
    const { payment } = req;

    if (payment.status !== status) {
      return res.status(400).json({ success: false, error: `La operación solo es válida para pagos en estado "${status}"` });
    }

    next();
  };
};

// Middleware para auditoría de acciones
const auditPaymentAction = async (req, res, next) => {
  try {
    // Obtener el ID del usuario que realiza la acción (esto depende de cómo gestionas la autenticación)
    const userId = req.user ? req.user._id : null;

    // Crear un nuevo registro de auditoría
    const auditLog = new AuditLog({
      userId,
      action: 'Operación en pago', // Puedes personalizar esta descripción
      timestamp: new Date(),
    });

    // Guardar el registro de auditoría en la base de datos
    await auditLog.save();

    next();
  } catch (error) {
    console.error('Error al registrar la acción de auditoría:', error);
    // Puedes manejar errores de registro de auditoría aquí
    next(error); // Continúa con el siguiente middleware o controlador, pero pasa el error
  }
};

// Middleware de seguridad adicional
const additionalSecurity = (req, res, next) => {
  // Verificar la autenticidad de la solicitud (ejemplo: comprobar si se incluye un encabezado de autenticación válido)
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Solicitud no autenticada' });
  }

  // Si llegamos a este punto, la solicitud está autenticada y se permite continuar
  next();
};

module.exports = { checkPaymentExists, validatePaymentAmount, checkPaymentStatus, auditPaymentAction, additionalSecurity };

