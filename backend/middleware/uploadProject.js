const multer = require('multer');
const path = require('path');

// Configura el almacenamiento y las restricciones de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './backend/projects'); // Directorio donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname); // Cambia el nombre del archivo para evitar colisiones
  },
});

// Función de filtrado para permitir solo ciertos tipos de archivos
const fileFilter = function (req, file, cb) {
  const allowedFileTypes = ['.docx', '.doc', '.pdf'];
  const extname = path.extname(file.originalname).toLowerCase();

  // Validar mimetypes
  const allowedMimeTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];

  if (allowedFileTypes.includes(extname) && allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no válido'));
  }
};
// Configura Multer con el almacenamiento y el filtro de archivos
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 15 * 1024 * 1024,
        fileTypes: ['.docx', '.doc', '.pdf'] 
    }, // Tamaño máximo de 10 MB
  }).single('file');
  
const uploadProject = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      // Si se produce un error al subir el archivo, registra el error y pasa al siguiente middleware
      console.error('Error al subir el archivo:', err.message);
      return res.status(400).json({ message: 'Error al subir el archivo', error: err.message });
    }

    // Verifica si req.file es indefinido o no
    if (!req.file) {
      return res.status(400).json({ message: 'Archivo no adjuntado' });
    }

    // Si el archivo se subió correctamente, registra el éxito y pasa al siguiente middleware
    const file = req.file;
    console.log('Archivo subido exitosamente:', file);

    next();
  });
};

  
module.exports = uploadProject;
  