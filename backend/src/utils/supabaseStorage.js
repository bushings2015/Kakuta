const multer = require("multer");
const { supabase } = require("../config/supabaseClient");
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * ทำความสะอาดชื่อไฟล์ - แทนที่อักขระพิเศษด้วย underscore หรือลบออก
 */
function sanitizeFileName(fileName) {
  const ext = path.extname(fileName);
  const nameWithoutExt = path.basename(fileName, ext);

  const cleaned = nameWithoutExt
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '')
    .replace(/-+/g, '-');

  return `${cleaned}${ext.toLowerCase()}`;
}

async function uploadFileToSupabase(file, typeFolder = "images", productId = null) {
  if (!file) throw new Error("No file provided");

  let bucketName;

  if (typeFolder === "models") {
    bucketName = "product-models";
  } else if (typeFolder === "content") {
    bucketName = "content-images";
  } else {
    bucketName = "product-images";
  }

  const fileName = sanitizeFileName(file.originalname);

  const filePath = productId
    ? `${typeFolder}/product-${productId}/${fileName}`
    : `${typeFolder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return {
    path: filePath,
    url: data.publicUrl,
    fileName: fileName
  };
}

async function uploadModelFiles(files, productId) {
  if (!files) throw new Error("No files provided");


  let filesArray = [];

  if (Array.isArray(files)) {
    filesArray = files;
  } else if (typeof files === 'object') {
    filesArray = Object.values(files).flat();
  }

  if (filesArray.length === 0) throw new Error("No files provided");

  const uploadedFiles = {};
  const fileMapping = {};

  filesArray.forEach(file => {
    const sanitizedName = sanitizeFileName(file.originalname);
    fileMapping[file.originalname] = sanitizedName;
  });

  for (const file of filesArray) {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext !== '.gltf') {
      const result = await uploadFileToSupabase(file, "models", productId);
      uploadedFiles[ext.replace('.', '')] = result;
    }
  }

  const gltfFile = filesArray.find(f => path.extname(f.originalname).toLowerCase() === '.gltf');

  if (gltfFile) {
    let gltfBuffer = gltfFile.buffer;
    let gltfContent = gltfBuffer.toString('utf-8');
    let modified = false;

    Object.entries(fileMapping).forEach(([oldName, newName]) => {
      if (oldName !== newName) {
        const regex = new RegExp(oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const newContent = gltfContent.replace(regex, newName);
        if (newContent !== gltfContent) {
          gltfContent = newContent;
          modified = true;
        }
      }
    });

    const fileToUpload = modified
      ? { ...gltfFile, buffer: Buffer.from(gltfContent, 'utf-8') }
      : gltfFile;

    const result = await uploadFileToSupabase(fileToUpload, "models", productId);
    uploadedFiles.gltf = result;
  }

  return uploadedFiles;
}

async function deleteFileFromSupabase(filePath, typeFolder = "images") {
  if (!filePath) return;

  let bucketName;

  if (typeFolder === "models") {
    bucketName = "product-models";
  } else if (typeFolder === "content") {
    bucketName = "content-images";
  } else {
    bucketName = "product-images";
  }

  const { error } = await supabase.storage.from(bucketName).remove([filePath]);
  if (error) console.error("Failed to delete file:", error);
}

module.exports = {
  upload,
  uploadFileToSupabase,
  uploadModelFiles,
  deleteFileFromSupabase
};