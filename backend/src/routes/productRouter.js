const express = require("express");
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { upload } = require("../utils/supabaseStorage");

const productRouter = express.Router();

productRouter.post("/", [authMiddleware, adminMiddleware], productController.createProduct);

productRouter.get("/search", productController.getProductByCategory);
productRouter.get("/", productController.getAllProducts);
productRouter.get("/:id", productController.getProductById);
productRouter.get("/:id/images", productController.getProductImages);
productRouter.get("/:id/models", productController.getProductModels);

productRouter.put("/:id", [authMiddleware, adminMiddleware], upload.any(), productController.updateProduct);
productRouter.delete("/:id", [authMiddleware, adminMiddleware], productController.deleteProduct);

// Multi-images upload
productRouter.post(
  "/:id/images",
  [authMiddleware, adminMiddleware],
  upload.array("images", 10),
  productController.uploadImages
);

// GLTF/BIN upload
productRouter.post(
  "/:id/models",
  [authMiddleware, adminMiddleware],
  upload.fields([
    { name: "gltf", maxCount: 1 },
    { name: "bin", maxCount: 1 },
    { name: "step", maxCount: 1 },
  ]),
  productController.uploadModel
);

module.exports = productRouter;
