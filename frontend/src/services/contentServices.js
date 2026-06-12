import http from './http-common'

// ----- API ENDPOINTS -----
const API = {
  CONTENTS: '/api/contents',
  CONTENT_TYPES: '/api/content-types'
}

// ----- Content -----
const searchContentsByType = (contentType) =>
  http.get(`${API.CONTENTS}/search`, { params: { contentType } })

const getAllContents = () => http.get(`${API.CONTENTS}/`)
const getContentById = (id) => http.get(`${API.CONTENTS}/${id}`)

const createContent = (data) => {
  let formData;
  
  if (data instanceof FormData) {
    // If data is already a FormData object, use it directly
    formData = data;
  } else {
    // Otherwise, create a new FormData from the data object
    formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value)
      }
    })
  }

  return http.post(`${API.CONTENTS}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const updateContent = (id, data) => {
  let formData;
  
  if (data instanceof FormData) {
    // If data is already a FormData object, use it directly
    formData = data;
  } else {
    // Otherwise, create a new FormData from the data object
    formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value)
      }
    })
  }

  return http.put(`${API.CONTENTS}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const deleteContent = (id) => http.delete(`${API.CONTENTS}/${id}`)

// ----- Content Types -----
const getAllContentTypes = () => http.get(`${API.CONTENT_TYPES}/`)
const getContentTypeById = (id) => http.get(`${API.CONTENT_TYPES}/${id}`)
const createContentType = (data) => http.post(`${API.CONTENT_TYPES}/`, data)
const updateContentType = (id, data) => http.put(`${API.CONTENT_TYPES}/${id}`, data)
const deleteContentType = (id) => http.delete(`${API.CONTENT_TYPES}/${id}`)

// ----- Export -----
const contentService = {
  getAllContents,
  searchContentsByType,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  getAllContentTypes,
  getContentTypeById,
  createContentType,
  updateContentType,
  deleteContentType
}

export default contentService
