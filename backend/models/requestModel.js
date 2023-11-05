const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Por favor, ingresa un título'],
  },
  areaEstudios: {
    type: String,
    enum: ['Area1', 'Area2', 'Area3', 'Area4'],
    required: [true, 'Por favor, selecciona un área de estudios'],
  },
  nivelEstudios: {
    type: String,
    enum: ['Licenciatura', 'Maestría', 'Doctorado'],
    required: [true, 'Por favor, selecciona un nivel de estudios'],
  },
  requerimientos: {
    text: {
      type: String,
    },
    file: {
      type: Object,
    },
  },
  tipoTrabajo: {
    type: String,
    required: [true, 'Por favor, selecciona un tipo de trabajo'],
  },
  otroTipoTrabajo: String, // Campo opcional si se selecciona 'Otro' en tipoTrabajo
  extension: {
    type: Number,
    required: [true, 'Por favor, ingresa la extensión del proyecto (cuartillas)'],
  },
  costo: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pendiente', 'en proceso', 'completado'],
    default: 'pendiente',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Request', requestSchema);
