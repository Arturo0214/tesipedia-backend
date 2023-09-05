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
    type: Number,
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
