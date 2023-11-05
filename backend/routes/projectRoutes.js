const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const uploadProject = require('../middleware/uploadProject');
const {
  createProject,
  getProjectById,
  updateProject,
  addCommentToProject,
  deleteProject,
  getAllProjects
} = require('../controllers/projectController');

router.route('/').post(protect, uploadProject, createProject);
router.route('/').get(protect, getAllProjects);
router.route('/:id').get(protect, getProjectById);
router.route('/:id').put(protect, uploadProject, updateProject);
router.route('/:id/comment').post(protect, addCommentToProject);
router.route('/:id').delete(protect, deleteProject);

module.exports = router;