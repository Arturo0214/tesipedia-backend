const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Por favor, ingresa un título']
  },
  description: {
    type: String,
    required: [true, 'Por favor, ingresa una descripción']
  },
  price: {
    type: Number,
    required: [true, 'Por favor, ingresa un precio']
  },
  status: {
    type: String,
    enum: ['pendiente', 'en proceso', 'completado', 'cancelado'],
    default: 'pendiente'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Order', orderSchema)