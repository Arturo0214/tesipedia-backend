const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  metodoPago: {
    type: String,
    required: true,
  },
  costo: {
    type: Number, // Cambia el tipo de dato de Number a String
    required: true,
  },
  status: {
    type: String,
    enum: ['pendiente', 'completado', 'cancelado'],
    default: 'pendiente',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
