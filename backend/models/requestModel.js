const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
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
  type: {
    type: String,
    required: [true, 'Por favor, ingresa un tipo de trabajo']
  },
  status: {
    type: String,
    enum: ['pendiente', 'en proceso', 'completado'],
    default: 'pendiente'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Request', requestSchema);