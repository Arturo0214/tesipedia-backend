const asyncHandler = require('express-async-handler');
const Request = require('../models/requestModel');

const createRequest = asyncHandler(async (req, res) => {
  // Obtener los datos del body del request
  const { title, description, type } = req.body;

  // Crear la solicitud
  const request = await Request.create({
    user: req.user._id, // Obtener el ID del usuario actual desde req.user
    title,
    description,
    type,
    status: 'pendiente',
  });

  res.status(201).json(request);
});

const cancelRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;

  // Verificar si el usuario es administrador
  if (!req.user.isAdmin) {
    res.status(403);
    throw new Error('Acceso denegado. Solo los usuarios administradores pueden cancelar solicitudes.');
  }

  // Buscar la solicitud por su ID
  const request = await Request.findById(requestId);

  if (!request) {
    res.status(404);
    throw new Error('Solicitud no encontrada.');
  }

  // Actualizar el estado de la solicitud a "cancelado"
  request.status = 'cancelado';
  const updatedRequest = await request.save();

  res.json(updatedRequest);
});

module.exports = { createRequest, cancelRequest };