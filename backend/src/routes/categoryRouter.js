const categoryController = require("../controllers/categoryController");
const express = require("express");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const categoryRouter = express.Router();

categoryRouter.post("/", [authMiddleware, adminMiddleware], categoryController.createCategory);
categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.get("/:id", categoryController.getCategoryById);
categoryRouter.put("/:id", [authMiddleware, adminMiddleware], categoryController.updateCategory);
categoryRouter.delete("/:id", [authMiddleware, adminMiddleware], categoryController.deleteCategory);

module.exports = categoryRouter;
