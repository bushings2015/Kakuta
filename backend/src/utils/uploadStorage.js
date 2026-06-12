// utils/uploadStorage.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/";

    if (file.mimetype.startsWith("image/")) {
      folder = "uploads/images";
    } else if (
      file.mimetype === "model/gltf+json" ||
      file.mimetype === "application/octet-stream" ||
      file.originalname.endsWith(".gltf") ||
      file.originalname.endsWith(".bin") ||
      file.originalname.endsWith(".step")
    ) {
      folder = "uploads/models";
    }

    // 
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // 
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
module.exports = upload;
