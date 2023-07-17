const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Por favor, ingresa el monto']
  },
  currency: {
    type: String,
    required: [true, 'Por favor, ingresa la moneda']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Por favor, ingresa el método de pago']
  },
  status: {
    type: String,
    enum: ['pendiente', 'completado', 'cancelado'],
    default: 'pendiente'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Payment', paymentSchema)