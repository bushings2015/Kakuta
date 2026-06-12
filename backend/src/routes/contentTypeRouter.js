const contentTypeController = require("../controllers/contentTypeController");
const express = require("express");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const contentTypeRouter = express.Router();

contentTypeRouter.get('/', contentTypeController.getAllContentType)
contentTypeRouter.get('/:id', contentTypeController.getContentTypeById)

contentTypeRouter.post('/', [authMiddleware, adminMiddleware], contentTypeController.createContentType)

contentTypeRouter.put('/:id', [authMiddleware, adminMiddleware], contentTypeController.updateContentType)

contentTypeRouter.delete('/:id', [authMiddleware, adminMiddleware], contentTypeController.deleteContentType)

module.exports = contentTypeRouter;
