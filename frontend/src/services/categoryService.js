import http from './http-common';

const API_URL = '/api/categories';

const getAllCategories = () => {
    return http.get(API_URL);
};

const getCategoryById = (id) => {
    return http.get(`${API_URL}/${id}`);
};

const createCategory = (data) => {
    return http.post(API_URL, data);
};

const updateCategory = (id, data) => {
    return http.put(`${API_URL}/${id}`, data);
};

const deleteCategory = (id) => {
    return http.delete(`${API_URL}/${id}`);
};

const categoryService = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
}
export default categoryService
