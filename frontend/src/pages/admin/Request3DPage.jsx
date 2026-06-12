import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, CheckCircle, XCircle, Mail, User, MessageSquare } from 'lucide-react';
import dashboardService from '../../services/dashboardService';

const Request3DPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await dashboardService.getAllRequests();
      if (response.data && response.data.data) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedRequest(null);
  };

  const getRequestStatusColor = (handled) => {
    return handled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const handleMarkHandled = async (requestId) => {
    try {
      const response = await dashboardService.updateRequestStatus(requestId, true);
      if (response.data && response.data.data) {
        // Update the request in the list
        setRequests(requests.map(req => 
          req.id === requestId ? response.data.data : req
        ));
        
        // Update the selected request if it's being viewed
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest(response.data.data);
        }
        
        alert('Request marked as handled successfully!');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Error updating request status');
    }
  };

  const handleMarkUnHandled = async (requestId) => {
    try {
      const response = await dashboardService.updateRequestStatus(requestId, false);
      if (response.data && response.data.data) {
        // Update the request in the list
        setRequests(requests.map(req => 
          req.id === requestId ? response.data.data : req
        ));
        
        // Update the selected request if it's being viewed
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest(response.data.data);
        }
        
        alert('Request marked as pending successfully!');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Error updating request status');
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await dashboardService.deleteRequest(requestId);
        
        // Remove the request from the list
        setRequests(requests.filter(req => req.id !== requestId));
        
        // Close details if the deleted request was being viewed
        if (selectedRequest && selectedRequest.id === requestId) {
          setShowDetails(false);
          setSelectedRequest(null);
        }
        
        alert('Request deleted successfully!');
      } catch (error) {
        console.error('Error deleting request:', error);
        alert('Error deleting request');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">3D Model Requests</h2>
          <div className="text-sm text-gray-600">
            Total: {requests.length} requests
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests && requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{request.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {request.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      {request.firstName} {request.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRequestStatusColor(request.handled)}`}>
                        {request.handled ? 'Handled' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(request)}
                          className="p-1 hover:bg-gray-100 rounded text-blue-600"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => request.handled ? handleMarkUnHandled(request.id) : handleMarkHandled(request.id)}
                          className={`p-1 hover:bg-gray-100 rounded ${request.handled ? 'text-yellow-600' : 'text-green-600'}`}
                          title={request.handled ? 'Mark as Pending' : 'Mark as Handled'}
                        >
                          {request.handled ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => handleDelete(request.id)}
                          className="p-1 hover:bg-gray-100 rounded text-red-600"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No 3D model requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Request Details */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Request Details</h3>
              <button 
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Request ID</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">#{selectedRequest.id}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Status</h4>
                  <p className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRequestStatusColor(selectedRequest.handled)}`}>
                    {selectedRequest.handled ? 'Handled' : 'Pending'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Customer Email</h4>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {selectedRequest.email}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Customer Name</h4>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    {selectedRequest.firstName} {selectedRequest.lastName}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Product Requested</h4>
                <p className="mt-1 text-sm text-gray-900">{selectedRequest.productName}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Message</h4>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-900 flex items-start">
                    <MessageSquare className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                    {selectedRequest.message || 'No message provided'}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Request Date</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  selectedRequest.handled ? handleMarkUnHandled(selectedRequest.id) : handleMarkHandled(selectedRequest.id);
                  handleCloseDetails();
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedRequest.handled 
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {selectedRequest.handled ? 'Mark as Pending' : 'Mark as Handled'}
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedRequest.id);
                  handleCloseDetails();
                }}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Request3DPage;