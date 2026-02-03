import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the JWT token to the headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle unauthorized errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                // Clear both localStorage and session-level auth data
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Redirect to login if not already there
                const currentPath = window.location.pathname;
                if (currentPath !== '/login') {
                    // Using replace to avoid back-button loops
                    window.location.replace('/login');
                }
            } else if (error.response.status === 403) {
                // Do NOT clear token or redirect for 403
                console.error("Access Denied: You do not have permission to perform this action.");
                // The promise rejection will let the specific component handle the error display
            }
        }
        return Promise.reject(error);
    }
);

export const stockService = {
    getAllStocks: (locationId, productName, batchNumber, page = 0, size = 10, zeroQuantity = null) =>
        api.get('/stocks', { params: { locationId, productName, batchNumber, page, size, zeroQuantity } }),
    getStockById: (id) => api.get(`/stocks/${id}`),
    createStock: (data) => api.post('/stocks', data),
    updateStock: (id, data) => api.put(`/stocks/${id}`, data),
    deleteStock: (id) => api.delete(`/stocks/${id}`),
};

export const dashboardService = {
    getLocations: () => api.get('/dashboard/locations'),
};

export const locationService = {
    getAll: () => api.get('/locations'),
    getById: (id) => api.get(`/locations/${id}`),
    create: (data) => api.post('/locations', data),
    update: (id, data) => api.put(`/locations/${id}`, data),
    delete: (id) => api.delete(`/locations/${id}`),
};

export const takenStockService = {
    getAllTakenStocks: () => api.get('/taken-stocks'),
    getTakenStocksByStockId: (stockId) => api.get(`/taken-stocks/stock/${stockId}`),
    takeStock: (data) => api.post('/taken-stocks', data),
    updateTakenStock: (id, data) => api.put(`/taken-stocks/${id}`, data),
    deleteTakenStock: (id) => api.delete(`/taken-stocks/${id}`),
};

export const emptyStockService = {
    getAllEmptyStocks: () => api.get('/empty-stocks'),
    getEmptyStocksByStockId: (stockId) => api.get(`/empty-stocks/stock/${stockId}`),
    emptyStock: (data) => api.post('/empty-stocks', data),
    updateEmptyStock: (id, data) => api.put(`/empty-stocks/${id}`, data),
    deleteEmptyStock: (id) => api.delete(`/empty-stocks/${id}`),
};

export const soldStockService = {
    getAllSoldStocks: () => api.get('/sold-stocks'),
    getSoldStocksByStockId: (stockId) => api.get(`/sold-stocks/stock/${stockId}`),
    sellStock: (data) => api.post('/sold-stocks', data),
    updateSoldStock: (id, data) => api.put(`/sold-stocks/${id}`, data),
    deleteSoldStock: (id) => api.delete(`/sold-stocks/${id}`),
};

export const roleService = {
    getAllRoles: () => api.get('/roles'),
    getAllPermissions: () => api.get('/roles/permissions'),
    updateRolePermissions: (roleId, permissions) => api.put(`/roles/${roleId}/permissions`, permissions),
};

export const userService = {
    getAllUsers: () => api.get('/users'),
    createUser: (data) => api.post('/users', data),
    updateUser: (id, data) => api.put(`/users/${id}`, data),
    deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;
