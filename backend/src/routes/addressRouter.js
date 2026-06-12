const addressController = require("../controllers/addressController");
const express = require("express");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const addressRouter = express.Router();

addressRouter.post("/", [authMiddleware, adminMiddleware], addressController.createAddress);

addressRouter.get("/", addressController.getAllAddresses);
addressRouter.get("/:id", addressController.getAddressById);

addressRouter.put("/:id", [authMiddleware, adminMiddleware], addressController.updateAddress);
addressRouter.delete("/:id", [authMiddleware, adminMiddleware], addressController.deleteAddress);

module.exports = addressRouter;