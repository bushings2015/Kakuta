const express = require('express');
const request3DController = require('../controllers/request3DController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const request3DRouter = express.Router();

// Get all 3D requests
request3DRouter.get('/', [authMiddleware, adminMiddleware], request3DController.getAllRequests);

// Update request status
request3DRouter.patch('/:id/status', [authMiddleware, adminMiddleware], request3DController.updateRequestStatus);

// Delete a request
request3DRouter.delete('/:id', [authMiddleware, adminMiddleware], request3DController.deleteRequest);

module.exports = request3DRouter;