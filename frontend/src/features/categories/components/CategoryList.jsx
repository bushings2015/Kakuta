import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, X, Trash2 } from 'lucide-react';
import categoryService from '../../../services/categoryService';
import { DataTable } from '../../../components/ui/DataTable';

const CategoryList = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedIds, setSelectedIds] = useState([]);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, ids: [] });

  const showAlert = (message, type = 'success', duration = 3000) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), duration);
  };

  // Queries
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await categoryService.getAllCategories();
      return res.data.data;
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newCategory) => categoryService.createCategory(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showAlert('Category created successfully!');
      setName('');
      setEditingId(null);
    },
    onError: () => showAlert('Error creating category', 'error')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showAlert('Category updated successfully!');
      setName('');
      setEditingId(null);
    },
    onError: () => showAlert('Error updating category', 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids) => {
      await Promise.all(ids.map((id) => categoryService.deleteCategory(id)));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showAlert(`${variables.length} category(s) deleted successfully!`);
      setSelectedIds([]);
      setConfirmDelete({ open: false, ids: [] });
    },
    onError: () => showAlert('Error deleting category', 'error')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return showAlert('Name is required', 'error');

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: { name } });
    } else {
      createMutation.mutate({ name });
    }
  };

  // Data mapping for table
  const paginatedData = categories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    {
      key: 'index',
      label: '#',
      render: (_, idx) => (currentPage - 1) * pageSize + idx + 1,
      className: 'w-1/12'
    },
    {
      key: 'name',
      label: 'Name',
      className: 'w-7/12'
    }
  ];

  const renderActions = (row) => (
    <>
      <button
        onClick={() => {
          setEditingId(row.id);
          setName(row.name);
        }}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <Edit className="w-4 h-4 text-blue-600" />
      </button>
      <button
        onClick={() => setConfirmDelete({ open: true, ids: [row.id] })}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <Trash2 className="w-4 h-4 text-red-600" />
      </button>
    </>
  );

  return (
    <div className="space-y-6 relative">
      {/* Alert */}
      {alert.message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
          <div className={`alert shadow-lg ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            <span>{alert.message}</span>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete.open && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete {confirmDelete.ids.length} category(s)?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete({ open: false, ids: [] })}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(confirmDelete.ids)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Category' : 'Add Category'}
        </h3>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter category name"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            disabled={createMutation.isPending || updateMutation.isPending}
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

      <DataTable
        title="Categories"
        columns={columns}
        data={paginatedData}
        totalItems={categories.length}
        loading={isLoading}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onDeleteSelected={() => setConfirmDelete({ open: true, ids: selectedIds })}
        renderActions={renderActions}
      />
    </div>
  );
};

export default CategoryList;