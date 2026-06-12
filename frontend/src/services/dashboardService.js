import http from './http-common';

const getDashboardStats = () => {
    return http.get('/api/dashboard/stats');
};

const getAllRequests = () => {
    return http.get('/api/requests3d'); 
};

const updateRequestStatus = (id, handled) => {
    return http.patch(`/api/requests3d/${id}/status`, { handled });
};

const deleteRequest = (id) => {
    return http.delete(`/api/requests3d/${id}`);
};

const dashboardService = {
    getDashboardStats,
    getAllRequests,
    updateRequestStatus,
    deleteRequest
};

export default dashboardService;