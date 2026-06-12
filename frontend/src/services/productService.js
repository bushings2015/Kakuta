import http from "./http-common";

const API_URL = "/api/products";

const searchProductByCategory = (category) => {
  return http.get(`${API_URL}/search`, { params: { category } });
};

const getAllProducts = () => http.get(API_URL);
const getProductById = (id) => http.get(`${API_URL}/${id}`);
const createProduct = (data) => http.post(API_URL, data);
const updateProduct = (id, data) => http.put(`${API_URL}/${id}`, data);
const deleteProduct = (id) => http.delete(`${API_URL}/${id}`);

const uploadProductImages = (id, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file); 
  });

  return http.post(`${API_URL}/${id}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const uploadProductModel = (id, gltf, bin, step) => {
  const formData = new FormData();
  if (gltf) formData.append("gltf", gltf);
  if (bin) formData.append("bin", bin);
  if (step) formData.append("step", step);

  return http.post(`${API_URL}/${id}/models`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const getProductImages = (id) => http.get(`${API_URL}/${id}/images`);
const getProductModels = (id) => http.get(`${API_URL}/${id}/models`);

const productService = {
  searchProductByCategory,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  uploadProductModel,
  getProductImages,
  getProductModels,
};

export default productService;
