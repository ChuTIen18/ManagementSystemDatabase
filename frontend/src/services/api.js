import axios from 'axios';
import { tokenStore } from '../utils/tokenStore';
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '/api/v1';
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Ensure cookies (httpOnly refresh token) are sent for same-origin or proxied requests
axios.defaults.withCredentials = true;
apiClient.defaults.withCredentials = true;
// Add token to requests
apiClient.interceptors.request.use((config) => {
    const token = tokenStore.getToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// Handle token refresh
apiClient.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            // Try refreshing access token. Backend will read refresh token from cookie if present.
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`);
            const { accessToken } = response.data.data;
            // store in memory
            tokenStore.setToken(accessToken);
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(originalRequest);
        }
        catch (refreshError) {
            tokenStore.clear();
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});
// Auth API
export const authAPI = {
    login: (email, password) => apiClient.post('/auth/login', { email, password }),
    logout: () => apiClient.post('/auth/logout'),
    getMe: () => apiClient.get('/auth/me'),
};
// Orders API
export const ordersAPI = {
    getAll: (params) => apiClient.get('/orders', { params }),
    getById: (id) => apiClient.get(`/orders/${id}`),
    create: (data) => apiClient.post('/orders', data),
    updateStatus: (id, status) => apiClient.put(`/orders/${id}/status`, { status }),
    addItem: (id, data) => apiClient.post(`/orders/${id}/items`, data),
    removeItem: (id, itemId) => apiClient.delete(`/orders/${id}/items/${itemId}`),
    updatePayment: (id, data) => apiClient.put(`/orders/${id}/payment`, data),
    cancel: (id) => apiClient.delete(`/orders/${id}`),
};
// Menu API
export const menuAPI = {
    getAll: (params) => apiClient.get('/menu', { params }),
    getById: (id) => apiClient.get(`/menu/${id}`),
    create: (data) => apiClient.post('/menu', data),
    update: (id, data) => apiClient.put(`/menu/${id}`, data),
    toggleAvailability: (id) => apiClient.put(`/menu/${id}/availability`),
    delete: (id) => apiClient.delete(`/menu/${id}`),
};
// Users API
export const usersAPI = {
    getAll: (params) => apiClient.get('/users', { params }),
    getById: (id) => apiClient.get(`/users/${id}`),
    create: (data) => apiClient.post('/users', data),
    update: (id, data) => apiClient.put(`/users/${id}`, data),
    delete: (id) => apiClient.delete(`/users/${id}`),
};
// Schedules API
export const schedulesAPI = {
    getAll: (params) => apiClient.get('/schedules', { params }),
    getById: (id) => apiClient.get(`/schedules/${id}`),
    create: (data) => apiClient.post('/schedules', data),
    approve: (id) => apiClient.put(`/schedules/${id}/approve`),
    reject: (id) => apiClient.put(`/schedules/${id}/reject`),
    delete: (id) => apiClient.delete(`/schedules/${id}`),
};
// Attendance API
export const attendanceAPI = {
    getAll: (params) => apiClient.get('/attendance', { params }),
    getById: (id) => apiClient.get(`/attendance/${id}`),
    checkIn: (data) => apiClient.post('/attendance/checkin', data),
    checkOut: (id) => apiClient.put(`/attendance/${id}/checkout`),
    update: (id, data) => apiClient.put(`/attendance/${id}`, data),
};
// Salary API
export const salaryAPI = {
    calculate: (data) => apiClient.post('/salary/calculate', data),
    getAll: (params) => apiClient.get('/salary', { params }),
    getById: (id) => apiClient.get(`/salary/${id}`),
    update: (id, data) => apiClient.put(`/salary/${id}`, data),
    pay: (id) => apiClient.put(`/salary/${id}/pay`),
};
// Leave Requests API
export const leaveRequestsAPI = {
    getAll: (params) => apiClient.get('/leave-requests', { params }),
    getById: (id) => apiClient.get(`/leave-requests/${id}`),
    create: (data) => apiClient.post('/leave-requests', data),
    approve: (id) => apiClient.put(`/leave-requests/${id}/approve`),
    reject: (id) => apiClient.put(`/leave-requests/${id}/reject`),
    delete: (id) => apiClient.delete(`/leave-requests/${id}`),
};
// Inventory API
export const inventoryAPI = {
    getAll: (params) => apiClient.get('/inventory', { params }),
    getById: (id) => apiClient.get(`/inventory/${id}`),
    create: (data) => apiClient.post('/inventory', data),
    update: (id, data) => apiClient.put(`/inventory/${id}`, data),
    addStock: (id, data) => apiClient.post(`/inventory/${id}/add`, data),
    removeStock: (id, data) => apiClient.post(`/inventory/${id}/remove`, data),
    delete: (id) => apiClient.delete(`/inventory/${id}`),
};
// Equipment API
export const equipmentAPI = {
    getAll: (params) => apiClient.get('/equipment', { params }),
    getById: (id) => apiClient.get(`/equipment/${id}`),
    create: (data) => apiClient.post('/equipment', data),
    update: (id, data) => apiClient.put(`/equipment/${id}`, data),
    recordMaintenance: (id, data) => apiClient.post(`/equipment/${id}/maintenance`, data),
    delete: (id) => apiClient.delete(`/equipment/${id}`),
};
// Promotions API
export const promotionsAPI = {
    getAll: (params) => apiClient.get('/promotions', { params }),
    getById: (id) => apiClient.get(`/promotions/${id}`),
    create: (data) => apiClient.post('/promotions', data),
    update: (id, data) => apiClient.put(`/promotions/${id}`, data),
    delete: (id) => apiClient.delete(`/promotions/${id}`),
    applyToOrder: (orderId, data) => apiClient.post(`/promotions/orders/${orderId}/apply`, data),
};
// Tables API
export const tablesAPI = {
    getAll: (params) => apiClient.get('/tables', { params }),
    getById: (id) => apiClient.get(`/tables/${id}`),
    create: (data) => apiClient.post('/tables', data),
    update: (id, data) => apiClient.put(`/tables/${id}`, data),
    delete: (id) => apiClient.delete(`/tables/${id}`),
};
// Feedback API
export const feedbackAPI = {
    getCustomerAll: () => apiClient.get('/feedback/customer'),
    getCustomerById: (id) => apiClient.get(`/feedback/customer/${id}`),
    getCustomerSummary: () => apiClient.get('/feedback/customer/summary'),
    createCustomer: (data) => apiClient.post('/feedback/customer', data),
    deleteCustomer: (id) => apiClient.delete(`/feedback/customer/${id}`),
    getPosAll: () => apiClient.get('/feedback/pos'),
    createPos: (data) => apiClient.post('/feedback/pos', data),
    updatePosStatus: (id, data) => apiClient.put(`/feedback/pos/${id}/status`, data),
    deletePos: (id) => apiClient.delete(`/feedback/pos/${id}`),
};
// Reports API
export const reportsAPI = {
    getSummary: () => apiClient.get('/reports/summary'),
    getDailyRevenue: () => apiClient.get('/reports/daily-revenue'),
    getLowStock: () => apiClient.get('/reports/low-stock'),
    getTopItems: () => apiClient.get('/reports/top-items'),
    getCustomerSatisfaction: () => apiClient.get('/reports/customer-satisfaction'),
};
export default apiClient;
