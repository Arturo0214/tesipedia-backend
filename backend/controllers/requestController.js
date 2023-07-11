const asyncHandler = require('express-async-handler')
const Request = require('../models/requestModel')

const createRequest = asyncHandler(async (req, res) => {
  const { title, description, type } = req.body

  const request = await Request.create({
    user: req.user._id,
    title,
    description,
    type,
    status: 'pendiente',
  })

  res.status(201).json(request)
})

const cancelRequest = asyncHandler(async (req, res) => {
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
    throw new Error('Acceso denegado. Solo los usuarios administradores pueden actualizar solicitudes.');
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

module.exports = { createRequest, cancelRequest, getRequest, updateRequest }