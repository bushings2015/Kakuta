import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, ChevronLeft, ChevronRight, Eye, Search, Filter, Calendar } from 'lucide-react';
import contentService from '../../../services/contentServices';

const Content = () => {
  const [contents, setContents] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, ids: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // New features
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByType, setFilterByType] = useState('');
  const [filterByStatus, setFilterByStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const [formData, setFormData] = useState({
    contentTypeId: '',
    language: 'en',
    title: '',
    detail: '',
    image: null, // Change from imageUrl to image file
    imageUrl: '', // Keep for displaying preview
    isPublished: false,
  });

  // Alert
  const showAlert = (message, type = 'success', duration = 3000) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), duration);
  };

  // Fetch data
  const fetchContents = async (searchParams = {}) => {
    try {
      setLoading(true);
      let res;
      
      // If we have search parameters, use the search API
      if (searchParams.contentType) {
        res = await contentService.searchContentsByType(searchParams.contentType);
      } else {
        res = await contentService.getAllContents();
      }
      
      setContents(res.data.data);
    } catch (err) {
      console.error(err);
      showAlert('Error fetching contents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchContentTypes = async () => {
    try {
      const res = await contentService.getAllContentTypes();
      setContentTypes(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContents();
    fetchContentTypes();
  }, []);

  // Apply filters and sorting
  const getFilteredAndSortedContents = () => {
    let result = [...contents];

    // Apply search if term exists
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(content => 
        content.title?.toLowerCase().includes(term) ||
        content.detail?.toLowerCase().includes(term) ||
        content.contentType?.name?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (filterByStatus) {
      if (filterByStatus === 'published') {
        result = result.filter(content => content.isPublished);
      } else if (filterByStatus === 'unpublished') {
        result = result.filter(content => !content.isPublished);
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      let valA, valB;
      switch (sortBy) {
        case 'title':
          valA = a.title?.toLowerCase() || '';
          valB = b.title?.toLowerCase() || '';
          break;
        case 'contentType':
          valA = a.contentType?.name?.toLowerCase() || '';
          valB = b.contentType?.name?.toLowerCase() || '';
          break;
        case 'language':
          valA = a.language?.toLowerCase() || '';
          valB = b.language?.toLowerCase() || '';
          break;
        case 'isPublished':
          valA = a.isPublished ? 1 : 0;
          valB = b.isPublished ? 1 : 0;
          break;
        default: // createdAt
          valA = new Date(a.createdAt || a.updatedAt || 0);
          valB = new Date(b.createdAt || b.updatedAt || 0);
      }
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      } else {
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
    });

    return result;
  };

  // Open Add/Edit modal
  const openModal = (content = null) => {
    if (content) {
      setEditingId(content.id);
      setFormData({
        contentTypeId: content.contentTypeId?.toString() || '', // Convert to string
        language: content.language || 'en',
        title: content.title || '',
        detail: content.detail || '',
        image: null, // Don't preload the file, just the URL for preview
        imageUrl: content.imageUrl || '',
        isPublished: content.isPublished || false,
      });
    } else {
      setEditingId(null);
      setFormData({
        contentTypeId: '',
        language: 'en',
        title: '',
        detail: '',
        image: null,
        imageUrl: '',
        isPublished: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // Clean up object URL if it was created for preview
    if (formData.imageUrl && formData.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(formData.imageUrl);
    }
    setIsModalOpen(false);
    // Reset form data to clear any file selections
    setFormData({
      contentTypeId: '',
      language: 'en',
      title: '',
      detail: '',
      image: null,
      imageUrl: '',
      isPublished: false,
    });
  };

  // Submit Add/Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.contentTypeId) {
      showAlert('Content Type is required', 'error');
      return;
    }
    
    if (!formData.title.trim()) {
      showAlert('Title is required', 'error');
      return;
    }
    
    try {
      // Create form data object to handle file upload
      const submitData = new FormData();
      
      // Add all form fields to FormData
      submitData.append('contentTypeId', formData.contentTypeId.toString()); // Ensure it's a string
      submitData.append('language', formData.language);
      submitData.append('title', formData.title.trim());
      submitData.append('detail', formData.detail?.trim() || '');
      submitData.append('isPublished', formData.isPublished.toString()); // Ensure it's a string
      
      // Add image file if selected
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (editingId) {
        await contentService.updateContent(editingId, submitData);
        showAlert('Content updated successfully!');
      } else {
        await contentService.createContent(submitData);
        showAlert('Content created successfully!');
      }
      closeModal();
      fetchContents(); // Refresh data
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      showAlert('Error saving content: ' + errorMessage, 'error');
    }
  };

  // Delete
  const handleDelete = async (id) => {
    setConfirmDelete({ open: true, ids: [id] });
  };

  const deleteContentType = async () => {
    try {
      await Promise.all(confirmDelete.ids.map((id) => contentService.deleteContent(id)));
      fetchContents();
      showAlert(`${confirmDelete.ids.length} content deleted successfully!`);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      showAlert('Error deleting content', 'error');
    } finally {
      setConfirmDelete({ open: false, ids: [] });
    }
  };

  // Perform backend search based on filters
  const performBackendSearch = async () => {
    try {
      setLoading(true);
      
      // If filtering by content type, use the search API
      if (filterByType) {
        const contentTypeName = contentTypes.find(ct => ct.id === parseInt(filterByType))?.name;
        if (contentTypeName) {
          const res = await contentService.searchContentsByType(contentTypeName);
          setContents(res.data.data);
        } else {
          const res = await contentService.getAllContents();
          setContents(res.data.data);
        }
      } else {
        // Otherwise, fetch all contents
        const res = await contentService.getAllContents();
        setContents(res.data.data);
      }
    } catch (err) {
      console.error(err);
      showAlert('Error fetching contents', 'error');
    } finally {
      setLoading(false);
    }
  };

  // View Details
  const viewDetails = (content) => {
    setSelectedContent(content);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    // Clean up object URL if it was created for preview
    if (selectedContent?.imageUrl && selectedContent.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(selectedContent.imageUrl);
    }
    setSelectedContent(null);
    setViewModalOpen(false);
  };

  // Apply filters
  const filteredContents = getFilteredAndSortedContents();
  
  // Pagination
  const totalPages = Math.ceil(filteredContents.length / pageSize);
  const paginatedData = filteredContents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 relative">

      {/* Alert */}
      {alert.message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
          <div
            className={`px-4 py-2 rounded-lg shadow-lg ${alert.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
          >
            <span>{alert.message}</span>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete {confirmDelete.ids.length} content?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete({ open: false, ids: [] })} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={deleteContentType} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search contents..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <select
              value={filterByType}
              onChange={(e) => {
                setFilterByType(e.target.value);
                setCurrentPage(1); // Reset to first page when filtering
                // If filtering by content type, perform backend search
                if (e.target.value) {
                  performBackendSearch();
                } else {
                  // If clearing the filter, fetch all contents
                  fetchContents();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {contentTypes.map((ct) => (
                <option key={ct.id} value={ct.id}>{ct.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filterByStatus}
              onChange={(e) => {
                setFilterByStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">Date</option>
              <option value="title">Title</option>
              <option value="contentType">Content Type</option>
              <option value="language">Language</option>
              <option value="isPublished">Status</option>
            </select>
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg flex items-center"
            >
              <span className="mr-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              Order
            </button>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-gray-500">
            Showing {filteredContents.length} of {contents.length} contents
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setFilterByType('');
              setFilterByStatus('');
              setSearchTerm('');
              setSortBy('createdAt');
              setSortOrder('desc');
              setCurrentPage(1); // Reset to first page when refreshing
              fetchContents(); // Refresh all data
            }} 
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Refresh
          </button>
          <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
            <Plus className="w-4 h-4" /> Add Content
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Contents</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-4 text-center">Loading...</p>
          ) : filteredContents.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No contents found</p>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Published</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((c, i) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{(currentPage - 1) * pageSize + i + 1}</td>
                      <td className="px-6 py-4 text-sm">{c.contentType?.name}</td>
                      <td className="px-6 py-4 text-sm">{c.language}</td>
                      <td className="px-6 py-4 text-sm">{c.title}</td>
                      <td className="px-6 py-4 text-sm">{c.isPublished ? 'Yes' : 'No'}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => viewDetails(c)} className="p-1 hover:bg-gray-100 rounded">
                          <Eye className="w-4 h-4 text-green-600" />
                        </button>
                        <button onClick={() => openModal(c)} className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1 hover:bg-gray-100 rounded">
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
            </>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedContent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40" onClick={closeViewModal}>
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeViewModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">Content Details</h3>
            <p><strong>Content Type:</strong> {selectedContent.contentType?.name}</p>
            <p><strong>Language:</strong> {selectedContent.language}</p>
            <p><strong>Title:</strong> {selectedContent.title}</p>
            <p><strong>Detail:</strong> <div className="whitespace-pre-line">{selectedContent.detail}</div></p>
            <p><strong>Published:</strong> {selectedContent.isPublished ? 'Yes' : 'No'}</p>
            {selectedContent.imageUrl && (
              <img src={selectedContent.imageUrl} alt={selectedContent.title} className="mt-4 rounded max-h-64 w-auto object-contain" />
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Content' : 'Add Content'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block">Content Type</label>
                <select
                  value={formData.contentTypeId}
                  onChange={(e) => setFormData({ ...formData, contentTypeId: e.target.value })}
                  className="border px-3 py-2 rounded-lg w-full"
                >
                  <option value="">Select Content Type</option>
                  {contentTypes.map((ct) => (
                    <option key={ct.id} value={ct.id}>{ct.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block">Language</label>
                <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="border px-3 py-2 rounded-lg w-full">
                  <option value="en">English</option>
                  <option value="th">Thai</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block">Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="border px-3 py-2 rounded-lg w-full" placeholder="Enter title" />
              </div>
              <div>
                <label className="mb-1 block">Detail</label>
                <textarea value={formData.detail} onChange={(e) => setFormData({ ...formData, detail: e.target.value })} className="border px-3 py-2 rounded-lg w-full" rows={3} placeholder="Enter detail" />
              </div>
              <div>
                <label className="mb-1 block">Upload Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFormData({ 
                      ...formData, 
                      image: file,
                      // If a new file is selected, update the preview URL
                      imageUrl: file ? URL.createObjectURL(file) : ''
                    });
                  }} 
                  className="border px-3 py-2 rounded-lg w-full" 
                />
                {/* Show preview if there's an image */}
                {formData.imageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Preview:</p>
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="mt-1 max-h-32 rounded border object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} id="isPublished" />
                <label htmlFor="isPublished">Published</label>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">{editingId ? 'Update' : 'Add'}</button>
                <button type="button" onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;