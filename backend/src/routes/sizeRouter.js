const sizeController = require("../controllers/sizeController");
const express = require("express");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const e = require("express");

const sizeRouter = express.Router();

sizeRouter.get('/', sizeController.getAllSizes)
sizeRouter.get('/:id', sizeController.getSizeById)

sizeRouter.post('/', [authMiddleware, adminMiddleware],  sizeController.createSize)

sizeRouter.put('/:id', [authMiddleware, adminMiddleware],  sizeController.updateSize)

sizeRouter.delete('/:id', [authMiddleware, adminMiddleware],  sizeController.deleteSize)

module.exports = sizeRouter