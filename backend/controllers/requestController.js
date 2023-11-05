const asyncHandler = require('express-async-handler');
const Request = require('../models/requestModel');

const createRequest = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { title, areaEstudios, nivelEstudios, tipoTrabajo, otroTipoTrabajo, extension } = req.body;

    if (!req.user) {
      res.status(401);
      throw new Error('Error de autenticación: no se encontró un usuario en la solicitud');
    }

    // Calcula el costo basado en el área de estudios, nivel de estudios y la extensión
    let costoPorPagina = 0;
    if (nivelEstudios === 'Maestría') {
      costoPorPagina = 20;
    } else if (nivelEstudios === 'Doctorado') {
      costoPorPagina = 40;
    }

    let calculatedCost = 0;
    if (areaEstudios && extension) {
      if (areaEstudios === 'Area1' || areaEstudios === 'Area2') {
        calculatedCost = (130 + costoPorPagina) * extension;
      } else if (areaEstudios === 'Area3' || areaEstudios === 'Area4') {
        calculatedCost = (110 + costoPorPagina) * extension;
      }
    }
    // Accede al archivo adjunto con req.file y conviértelo a cadena JSON
    const requerimientos = {
      text: req.body.requerimientos || null,
      file: req.file ? req.file : null,
    };
    console.log('Requerimientos:', requerimientos);

    // Crear la solicitud con el archivo adjunto
    const request = new Request({
      user: userId,
      title,
      areaEstudios,
      nivelEstudios,
      tipoTrabajo,
      otroTipoTrabajo,
      extension,
      costo: calculatedCost,
      status: 'pendiente',
      requerimientos: requerimientos,
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
    console.error(error);
  }
});

const cancelRequestUser = asyncHandler(async (req, res) => {
  const requestId = req.params.id

  if (!req.user.isAdmin) {
    res.status(403)
    throw new Error('Acceso denegado. Solo los usuarios administradores pueden cancelar solicitudes.')
  }

  const request = await Request.findById(requestId)

  if (!request) {
    res.status(404)
    throw new Error('Solicitud no encontrada.')
  }

  request.status = 'cancelado'
  const updatedRequest = await request.save()

  res.json(updatedRequest)
});

const deleteRequest = asyncHandler(async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await Request.findById(requestId);

    if (!request) {
      res.status(404);
      throw new Error('Solicitud no encontrada.');
    }

    // Verifica si el usuario es un administrador
    if (req.user.isAdmin !== true) {
      res.status(403);
      throw new Error('Acceso denegado. Solo los usuarios administradores pueden eliminar solicitudes.');
    }

    await Request.findByIdAndDelete(req.params.id)

    res.json({ message: 'Solicitud eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

const getRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id

  const request = await Request.findById(requestId)

  if (!request) {
    res.status(404)
    throw new Error('Solicitud no encontrada.')
  }

  res.json(request)
})

const updateRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id
  const { title, description, type } = req.body

  if (!req.user.isAdmin) {
    res.status(403)
    throw new Error('Acceso denegado. Solo los usuarios administradores pueden actualizar solicitudes.')
  }

  const request = await Request.findById(requestId)

  if (!request) {
    res.status(404)
    throw new Error('Solicitud no encontrada.')
  }

  request.title = title
  request.description = description
  request.type = type
  const updatedRequest = await request.save()

  res.json(updatedRequest)
})

// Función para actualizar el archivo adjunto de una solicitud existente
const updateFileForRequest = asyncHandler(async (req, res) => {
  try {
    const requestId = req.params.id;
    
    // Encuentra la solicitud por su ID
    const request = await Request.findById(requestId);

    if (!request) {
      res.status(404);
      throw new Error('Solicitud no encontrada.');
    }

    // Accede al archivo adjunto con req.file y conviértelo a cadena JSON
    const requerimientos = {
      text: req.body.requerimientos || null,
      file: req.file ? JSON.stringify(req.file) : null,
    };
    
    // Actualiza el archivo adjunto en la solicitud
    request.requerimientos = requerimientos;

    // Guarda los cambios en la solicitud
    const updatedRequest = await request.save();

    res.json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

const getAllRequests = asyncHandler(async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      res.status(403);
      throw new Error('Acceso denegado. Solo los usuarios administradores pueden ver todas las solicitudes.');
    }

    const requests = await Request.find({});

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

const getPDFForRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    // Encuentra la solicitud por su ID
    const request = await Request.findById(requestId);

    if (!request) {
      res.status(404);
      throw new Error('Solicitud no encontrada.');
    }

    // Accede al archivo adjunto de la solicitud
    const requerimientos = request.requerimientos;

    // Decodifica el archivo adjunto si es necesario
    let pdfBuffer;
    if (requerimientos.file) {
      pdfBuffer = Buffer.from(requerimientos.file, 'base64');
    } else {
      pdfBuffer = new Buffer(requerimientos.text);
    }

    // Establece el encabezado de tipo de contenido
    res.setHeader('Content-Type', 'application/pdf');

    // Envía el archivo PDF al navegador
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

module.exports = { createRequest, cancelRequestUser, getRequest, updateRequest, updateFileForRequest, getAllRequests, deleteRequest, getPDFForRequest}