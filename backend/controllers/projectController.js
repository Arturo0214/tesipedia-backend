const asyncHandler = require('express-async-handler');
const Project = require('../models/projectModel');
const Payment = require('../models/paymentModel');

const createProject = asyncHandler(async (req, res) => {
  try {
    const { payment, state, files } = req.body;

    const foundPayment = await Payment.findById(payment);

    if (!foundPayment) {
      return res.status(400).json({ success: false, error: 'El usuario no tiene un pago asociado' });
    }

    const project = new Project({
      payment: payment,
      state,
      files,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

const getProjectById = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Proyecto no encontrado' });
  }

  res.status(200).json(project);
});

const updateProject = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const { state, comments, files } = req.body;

  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      state,
      comments,
      files,
    },
    { new: true }
  );

  if (!project) {
    return res.status(404).json({ message: 'proyecto no encontrado' });
  }

  res.status(200).json({ message: 'proyecto actualizado con éxito', project });
});

// Agregar un comentario a un proyecto por ID
const addCommentToProject = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const { comment } = req.body;

  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'proyecto no encontrado' });
  }

  project.comments.push({ text: comment, author: req.user.username });
  await project.save();

  res.status(200).json({ message: 'Comentario agregado con éxito', project });
});

// Eliminar un proyecto por ID
const deleteProject = asyncHandler(async (req, res) => {
  const projectId = req.params.id;

  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'proyecto no encontrado' });
  }

  // Verificar si el usuario es un administrador (puedes implementar esta lógica según tus necesidades)
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden borrar proyectos.' });
  }

  await project.remove();

  res.status(200).json({ message: 'proyecto eliminado con éxito' });
});

// Obtener todos los proyectos
const getAllProjects = asyncHandler(async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


module.exports = {
  createProject,
  getProjectById,
  updateProject,
  addCommentToProject,
  deleteProject,
  getAllProjects,
};
