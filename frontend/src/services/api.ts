import axios from 'axios';
import { tokenStore } from '../utils/tokenStore';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

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
        (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
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
            } catch (refreshError) {
                tokenStore.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (email: string, password: string) =>
        apiClient.post('/auth/login', { email, password }),
    logout: () => apiClient.post('/auth/logout'),
    getMe: () => apiClient.get('/auth/me'),
};

// Orders API
export const ordersAPI = {
    getAll: (params?: any) => apiClient.get('/orders', { params }),
    getById: (id: number) => apiClient.get(`/orders/${id}`),
    create: (data: any) => apiClient.post('/orders', data),
    updateStatus: (id: number, status: string) =>
        apiClient.put(`/orders/${id}/status`, { status }),
    addItem: (id: number, data: any) => apiClient.post(`/orders/${id}/items`, data),
    removeItem: (id: number, itemId: number) =>
        apiClient.delete(`/orders/${id}/items/${itemId}`),
    updatePayment: (id: number, data: any) => apiClient.put(`/orders/${id}/payment`, data),
    cancel: (id: number) => apiClient.delete(`/orders/${id}`),
};

// Menu API
export const menuAPI = {
    getAll: (params?: any) => apiClient.get('/menu', { params }),
    getById: (id: number) => apiClient.get(`/menu/${id}`),
    create: (data: any) => apiClient.post('/menu', data),
    update: (id: number, data: any) => apiClient.put(`/menu/${id}`, data),
    toggleAvailability: (id: number) => apiClient.put(`/menu/${id}/availability`),
    delete: (id: number) => apiClient.delete(`/menu/${id}`),
};

// Users API
export const usersAPI = {
    getAll: (params?: any) => apiClient.get('/users', { params }),
    getById: (id: number) => apiClient.get(`/users/${id}`),
    create: (data: any) => apiClient.post('/users', data),
    update: (id: number, data: any) => apiClient.put(`/users/${id}`, data),
    delete: (id: number) => apiClient.delete(`/users/${id}`),
};

// Schedules API
export const schedulesAPI = {
    getAll: (params?: any) => apiClient.get('/schedules', { params }),
    getById: (id: number) => apiClient.get(`/schedules/${id}`),
    create: (data: any) => apiClient.post('/schedules', data),
    approve: (id: number) => apiClient.put(`/schedules/${id}/approve`),
    reject: (id: number) => apiClient.put(`/schedules/${id}/reject`),
    delete: (id: number) => apiClient.delete(`/schedules/${id}`),
};

// Attendance API
export const attendanceAPI = {
    getAll: (params?: any) => apiClient.get('/attendance', { params }),
    getById: (id: number) => apiClient.get(`/attendance/${id}`),
    checkIn: (data: any) => apiClient.post('/attendance/checkin', data),
    checkOut: (id: number) => apiClient.put(`/attendance/${id}/checkout`),
    update: (id: number, data: any) => apiClient.put(`/attendance/${id}`, data),
};

// Salary API
export const salaryAPI = {
    calculate: (data: any) => apiClient.post('/salary/calculate', data),
    getAll: (params?: any) => apiClient.get('/salary', { params }),
    getById: (id: number) => apiClient.get(`/salary/${id}`),
    update: (id: number, data: any) => apiClient.put(`/salary/${id}`, data),
    pay: (id: number) => apiClient.put(`/salary/${id}/pay`),
};

// Leave Requests API
export const leaveRequestsAPI = {
    getAll: (params?: any) => apiClient.get('/leave-requests', { params }),
    getById: (id: number) => apiClient.get(`/leave-requests/${id}`),
    create: (data: any) => apiClient.post('/leave-requests', data),
    approve: (id: number) => apiClient.put(`/leave-requests/${id}/approve`),
    reject: (id: number) => apiClient.put(`/leave-requests/${id}/reject`),
    delete: (id: number) => apiClient.delete(`/leave-requests/${id}`),
};

 // Inventory API
 export const inventoryAPI = {
     getAll: (params?: any) => apiClient.get('/inventory', { params }),
     getById: (id: number) => apiClient.get(`/inventory/${id}`),
     create: (data: any) => apiClient.post('/inventory', data),
     update: (id: number, data: any) => apiClient.put(`/inventory/${id}`, data),
     addStock: (id: number, data: any) => apiClient.post(`/inventory/${id}/add`, data),
     removeStock: (id: number, data: any) => apiClient.post(`/inventory/${id}/remove`, data),
     delete: (id: number) => apiClient.delete(`/inventory/${id}`),
 };

 // Equipment API
 export const equipmentAPI = {
     getAll: (params?: any) => apiClient.get('/equipment', { params }),
     getById: (id: number) => apiClient.get(`/equipment/${id}`),
     create: (data: any) => apiClient.post('/equipment', data),
     update: (id: number, data: any) => apiClient.put(`/equipment/${id}`, data),
     recordMaintenance: (id: number, data: any) => apiClient.post(`/equipment/${id}/maintenance`, data),
     delete: (id: number) => apiClient.delete(`/equipment/${id}`),
 };

// Promotions API
export const promotionsAPI = {
    getAll: (params?: any) => apiClient.get('/promotions', { params }),
    getById: (id: number) => apiClient.get(`/promotions/${id}`),
    create: (data: any) => apiClient.post('/promotions', data),
    update: (id: number, data: any) => apiClient.put(`/promotions/${id}`, data),
    delete: (id: number) => apiClient.delete(`/promotions/${id}`),
    applyToOrder: (orderId: number, data: any) => apiClient.post(`/promotions/orders/${orderId}/apply`, data),
};

// Tables API
export const tablesAPI = {
    getAll: (params?: any) => apiClient.get('/tables', { params }),
    getById: (id: number) => apiClient.get(`/tables/${id}`),
    create: (data: any) => apiClient.post('/tables', data),
    update: (id: number, data: any) => apiClient.put(`/tables/${id}`, data),
    delete: (id: number) => apiClient.delete(`/tables/${id}`),
};

// Feedback API
export const feedbackAPI = {
    getCustomerAll: () => apiClient.get('/feedback/customer'),
    getCustomerById: (id: number) => apiClient.get(`/feedback/customer/${id}`),
    getCustomerSummary: () => apiClient.get('/feedback/customer/summary'),
    createCustomer: (data: any) => apiClient.post('/feedback/customer', data),
    deleteCustomer: (id: number) => apiClient.delete(`/feedback/customer/${id}`),
    getPosAll: () => apiClient.get('/feedback/pos'),
    createPos: (data: any) => apiClient.post('/feedback/pos', data),
    updatePosStatus: (id: number, data: any) => apiClient.put(`/feedback/pos/${id}/status`, data),
    deletePos: (id: number) => apiClient.delete(`/feedback/pos/${id}`),
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
