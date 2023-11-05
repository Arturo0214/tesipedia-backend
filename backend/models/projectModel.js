const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    stage: {
      type: Number,
      default: 1, // Inicialmente, el proyecto comienza en la etapa 1
    },
    comments: [
      {
        text: String,
        author: String, // Puede ser "admin" o el nombre del usuario
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    files: [
      {
        originalname: String,
        filename: String,
        stage: Number, // Etapa a la que pertenece el archivo
        size: Number, // Tamaño del archivo en bytes
        fileType: String,
        uploadedBy: String, // ID o nombre del usuario que subió el archivo
        description: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);

