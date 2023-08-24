const asyncHandler = require('express-async-handler')
const Request = require('../models/requestModel')

const createRequest = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id
    
    const { title, areaEstudios, requerimientos, tipoTrabajo, otroTipoTrabajo, extension } = req.body
    if(!req.body) {
      res.status(400)
      throw new Error("All the fields are required")
    }

    if (!req.user) {
      res.status(401)
      throw new Error('Error de autenticación: no se encontró un usuario en la solicitud')
    }

    const request = new Request({
      user: userId,
      title,
      areaEstudios,
      requerimientos,
      tipoTrabajo,
      otroTipoTrabajo,
      extension,
      status: 'pendiente'
    })

/* This code is handling the creation of a new request. */
    const createdRequest = await request.save()
    res.status(201).json(createdRequest)
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
    console.log(error)
  }
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

module.exports = { createRequest, cancelRequest, getRequest, updateRequest }