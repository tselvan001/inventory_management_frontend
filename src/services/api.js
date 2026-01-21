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
        if (error.response && [401, 403].includes(error.response.status)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const stockService = {
    getAllStocks: (location, productName, batchNumber, page = 0, size = 10) =>
        api.get('/stocks', { params: { location, productName, batchNumber, page, size } }),
    getStockById: (id) => api.get(`/stocks/${id}`),
    createStock: (data) => api.post('/stocks', data),
    updateStock: (id, data) => api.put(`/stocks/${id}`, data),
    deleteStock: (id) => api.delete(`/stocks/${id}`),
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

export default api;
