const express = require('express');
const router = express.Router();
const handleFileUpload = require('../middleware/uploadFile');
const { protect } = require('../middleware/authMiddleware');
const { createRequest, 
        cancelRequestUser, 
        getRequest, 
        updateRequest, 
        updateFileForRequest, 
        getAllRequests, 
        deleteRequest,
        getPDFForRequest } = require('../controllers/requestController');

router.route('/').post(protect, handleFileUpload, createRequest);
router.route('/all').get(protect, getAllRequests);
router.route('/:id').get(protect, getRequest);
router.route('/:id').put(protect, updateRequest);
router.route('/:id/updateFile').put(protect, handleFileUpload, updateFileForRequest);
router.route('/:id/cancel').put(protect, cancelRequestUser);
router.route('/:id/delete').delete(protect, deleteRequest);
router.route('/:id/pdf').get(protect, getPDFForRequest);

module.exports = router;
