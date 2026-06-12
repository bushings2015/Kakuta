import http from './http-common'

const API_URL = '/api/address-types'

const getAllAddressTypes = () => {
    return http.get(`${API_URL}`)
}

const getAddressTypeById = (id) => {
    return http.get(`${API_URL}/${id}`)
}

const createAddressType = (createData) => {
    return http.post(`${API_URL}`, createData)
}

const updateAddressType = (id, updateData) => {
    return http.put(`${API_URL}/${id}`, updateData)
}

const deleteAddressType = (id) => {
    return http.delete(`${API_URL}/${id}`)
}

const addressTypeService = {
    getAddressTypeById,
    getAllAddressTypes,
    createAddressType,
    updateAddressType,
    deleteAddressType
}

export default addressTypeService