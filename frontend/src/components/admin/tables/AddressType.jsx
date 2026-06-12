import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import addressTypeService from '../../../services/addressTypeServices';

const AddressType = () => {
  const [addressTypes, setAddressTypes] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Alert state
  const [alert, setAlert] = useState({ message: '', type: '' });

  // Confirm delete modal
  const [confirmDelete, setConfirmDelete] = useState({ open: false, ids: [] });

  // Selected items for bulk delete
  const [selectedIds, setSelectedIds] = useState([]);

  // Show alert
  const showAlert = (message, type = 'success', duration = 3000) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), duration);
  };

  // Fetch all address types
  const fetchAddressTypes = async () => {
    try {
      setLoading(true);
      const res = await addressTypeService.getAllAddressTypes();
      setAddressTypes(res.data.data);
    } catch (err) {
      console.error('Error fetching address types:', err);
      showAlert('Error fetching address types', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return showAlert('Name is required', 'error');

    try {
      if (editingId) {
        await addressTypeService.updateAddressType(editingId, { name });
        showAlert('Address type updated successfully!', 'success');
      } else {
        await addressTypeService.createAddressType({ name });
        showAlert('Address type created successfully!', 'success');
      }
      setName('');
      setEditingId(null);
      fetchAddressTypes();
    } catch (err) {
      console.error('Error saving address type:', err);
      showAlert('Error saving address type', 'error');
    }
  };

  // Delete single or multiple address types
  const deleteAddressType = async () => {
    try {
      await Promise.all(confirmDelete.ids.map((id) => addressTypeService.deleteAddressType(id)));
      fetchAddressTypes();
      showAlert(`${confirmDelete.ids.length} address type(s) deleted successfully!`, 'success');
      setSelectedIds([]);
    } catch (err) {
      console.error('Error deleting address type:', err);
      showAlert('Error deleting address type(s)', 'error');
    } finally {
      setConfirmDelete({ open: false, ids: [] });
    }
  };

  useEffect(() => {
    fetchAddressTypes();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(addressTypes.length / pageSize);
  const paginatedData = addressTypes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handle page size change
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handle checkbox change
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Handle select all on current page
  const toggleSelectAll = () => {
    const pageIds = paginatedData.map((at) => at.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Alert */}
      {alert.message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
          <div
            className={`alert shadow-lg ${alert.type === 'success' ? 'alert-success' : 'alert-error'
              }`}
          >
            <span>{alert.message}</span>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete.open && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete {confirmDelete.ids.length} address type(s)?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete({ open: false, ids: [] })}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={deleteAddressType}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Address Type' : 'Add Address Type'}
        </h3>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter address type name"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            {editingId ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setName('');
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded-lg flex items-center"
            >
              <X className="w-4 h-4 mr-1" /> Cancel
            </button>
          )}
        </form>
      </div>

      {/* Page size selector */}
      <div className="flex justify-between items-center p-2">
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

        {selectedIds.length > 0 && (
          <button
            onClick={() => setConfirmDelete({ open: true, ids: selectedIds })}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" /> Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full table-auto border-collapse text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/12 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">
                Select
              </th>
              <th className="w-1/12 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">
                #
              </th>
              <th className="w-8/12 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="w-2/12 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((at, index) => (
              <tr key={at.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(at.id)}
                    onChange={() => toggleSelect(at.id)}
                  />
                </td>
                <td className="px-6 py-4 text-sm">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="px-6 py-4 text-sm">{at.name}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(at.id);
                      setName(at.name);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ open: true, ids: [at.id] })}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4">
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

    </div>
  );
};

export default AddressType;
