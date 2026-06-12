import http from './http-common'

const API_URL = '/api/addresses'

const getAllAddress = () => {
  return http.get(`${API_URL}`)
}

const getAddressById = (id) => {
  return http.get(`${API_URL}/${id}`)
}

const createAddress = (createData) => {
  return http.post(`${API_URL}`, createData)
}

const updateAddress = (id, updateData) => {
  return http.put(`${API_URL}/${id}`, updateData)
}

const deleteAddress = (id) => {
  return http.delete(`${API_URL}/${id}`)
}

const addressService = {
  getAllAddress,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
}

export default addressService
