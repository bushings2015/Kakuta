const addressTypeController = require("../controllers/addressTypeController");
const express = require("express");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const addressTypeRouter = express.Router();

addressTypeRouter.post("/", [authMiddleware, adminMiddleware], addressTypeController.createAddressType);

addressTypeRouter.get("/", addressTypeController.getAllAddressTypes);
addressTypeRouter.get("/:id", addressTypeController.getAddressTypeById);

addressTypeRouter.put("/:id", [authMiddleware, adminMiddleware], addressTypeController.updateAddressType);

addressTypeRouter.delete("/:id", [authMiddleware, adminMiddleware], addressTypeController.deleteAddressType);

module.exports = addressTypeRouter;