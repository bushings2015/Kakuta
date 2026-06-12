import React, { useEffect, useState } from 'react'
import { Trash2, ChevronLeft, ChevronRight, Edit, Plus } from 'lucide-react'
import addressService from '../../../services/addressService'
import addressTypeService from '../../../services/addressTypeServices'

const Address = () => {
  const [addresses, setAddresses] = useState([])
  const [addressTypes, setAddressTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    addressTypeId: '',
    address: '',
    phone1: '',
    phone2: '',
    email: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [alert, setAlert] = useState({ message: '', type: '' })
  const [confirmDelete, setConfirmDelete] = useState({ open: false, ids: [] })
  const [selectedIds, setSelectedIds] = useState([])

  const showAlert = (message, type = 'success', duration = 3000) => {
    setAlert({ message, type })
    setTimeout(() => setAlert({ message: '', type: '' }), duration)
  }

  const fetchAddress = async () => {
    try {
      setLoading(true)
      const res = await addressService.getAllAddress()
      setAddresses(res.data.data)
    } catch (err) {
      console.error('Error fetching addresses:', err)
      showAlert('Error fetching addresses', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchAddressTypes = async () => {
    try {
      setLoading(true)
      const res = await addressTypeService.getAllAddressTypes()
      setAddressTypes(res.data.data)
    } catch (err) {
      console.error('Error fetching address types:', err)
      showAlert('Error fetching address types', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        await addressService.updateAddress(editingId, formData)
        showAlert('Address updated successfully!', 'success')
      } else {
        await addressService.createAddress(formData)
        showAlert('Address added successfully!', 'success')
      }
      setShowForm(false)
      setEditingId(null)
      setFormData({ addressTypeId: '', address: '', phone1: '', phone2: '', email: '' })
      fetchAddress()
    } catch (err) {
      console.error('Error saving address:', err)
      showAlert('Error saving address', 'error')
    }
  }

  const handleEdit = (a) => {
    setEditingId(a.id)
    setFormData({
      addressTypeId: a.addressTypeId || '',
      address: a.address || '',
      phone1: a.phone1 || '',
      phone2: a.phone2 || '',
      email: a.email || ''
    })
    setShowForm(true)
  }

  const deleteAddress = async () => {
    try {
      await Promise.all(confirmDelete.ids.map((id) => addressService.deleteAddress(id)))
      fetchAddress()
      showAlert(`${confirmDelete.ids.length} address(es) deleted successfully!`, 'success')
      setSelectedIds([])
    } catch (err) {
      console.error('Error deleting address:', err)
      showAlert('Error deleting address(es)', 'error')
    } finally {
      setConfirmDelete({ open: false, ids: [] })
    }
  }

  useEffect(() => {
    fetchAddress()
    fetchAddressTypes()
  }, [])

  // Pagination
  const totalPages = Math.ceil(addresses.length / pageSize)
  const paginatedData = addresses.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value))
    setCurrentPage(1)
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    const pageIds = paginatedData.map((a) => a.id)
    const allSelected = pageIds.every((id) => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)))
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])])
    }
  }

  return (
    <div>
      {/* Alert */}
      {alert.message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`alert shadow-lg ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}
          >
            <span>{alert.message}</span>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
            <div className="flex flex-col gap-3">
              {/* ✅ AddressType เป็น select */}
              <select
                name="addressTypeId"
                className="input input-bordered"
                value={formData.addressTypeId}
                onChange={handleChange}
              >
                <option value="">Select Address Type</option>
                {addressTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <input
                name="address"
                placeholder="Address"
                className="input input-bordered"
                value={formData.address}
                onChange={handleChange}
              />
              <input
                name="phone1"
                placeholder="Phone 1"
                className="input input-bordered"
                value={formData.phone1}
                onChange={handleChange}
              />
              <input
                name="phone2"
                placeholder="Phone 2"
                className="input input-bordered"
                value={formData.phone2}
                onChange={handleChange}
              />
              <input
                name="email"
                placeholder="Email"
                className="input input-bordered"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="btn btn-ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                {editingId ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Delete Modal */}
      {confirmDelete.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete {confirmDelete.ids.length} address(es)?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete({ open: false, ids: [] })}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={deleteAddress}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <label className="text-gray-700">Rows per page:</label>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border border-gray-300 rounded-lg px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={() => setConfirmDelete({ open: true, ids: selectedIds })}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" /> Delete Selected ({selectedIds.length})
            </button>
          )}

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => {
              setFormData({ addressTypeId: '', address: '', phone1: '', phone2: '', email: '' })
              setEditingId(null)
              setShowForm(true)
            }}
          >
            + Add Address
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full table-auto border-collapse text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/12 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Select</th>
              <th className="w-1/12 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">#</th>
              <th className="w-2/12 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Office</th>
              <th className="w-3/12 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Address</th>
              <th className="w-2/12 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Phone 1</th>
              <th className="w-2/12 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Phone 2</th>
              <th className="w-3/12 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Email</th>
              <th className="w-2/12 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((a, index) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(a.id)}
                    onChange={() => toggleSelect(a.id)}
                  />
                </td>
                <td className="px-6 py-4 text-sm">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="px-6 py-4 text-sm">{a.addressType?.name || '-'}</td>
                <td className="px-6 py-4 text-sm">{a.address}</td>
                <td className="px-6 py-4 text-sm">{a.phone1}</td>
                <td className="px-6 py-4 text-sm">{a.phone2}</td>
                <td className="px-6 py-4 text-sm">{a.email}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(a)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ open: true, ids: [a.id] })}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4 mt-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div >
  )
}

export default Address
