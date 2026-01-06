import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding JWT token
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

// Response interceptor for handling common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                // Unauthorized - clear token and redirect to login if necessary
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
};

export const stockService = {
    getAllStocks: (params) => api.get('/stocks', { params }),
    getStockById: (id) => api.get(`/stocks/${id}`),
    createStock: (data) => api.post('/stocks', data),
    updateStock: (id, data) => api.put(`/stocks/${id}`, data),
    deleteStock: (id) => api.delete(`/stocks/${id}`),
};

export const takenStockService = {
    getAllTakenStocks: (params) => api.get('/taken-stocks', { params }),
    getTakenStocksByStockId: (stockId, params) => api.get(`/taken-stocks/stock/${stockId}`, { params }),
    takeStock: (data) => api.post('/taken-stocks', data),
    updateTakenStock: (id, data) => api.put(`/taken-stocks/${id}`, data),
    deleteTakenStock: (id) => api.delete(`/taken-stocks/${id}`),
};

export const emptyStockService = {
    getAllEmptyStocks: (params) => api.get('/empty-stocks', { params }),
    getEmptyStocksByStockId: (stockId, params) => api.get(`/empty-stocks/stock/${stockId}`, { params }),
    emptyStock: (data) => api.post('/empty-stocks', data),
    updateEmptyStock: (id, data) => api.put(`/empty-stocks/${id}`, data),
    deleteEmptyStock: (id) => api.delete(`/empty-stocks/${id}`),
};

export const soldStockService = {
    getAllSoldStocks: (params) => api.get('/sold-stocks', { params }),
    getSoldStocksByStockId: (stockId, params) => api.get(`/sold-stocks/stock/${stockId}`, { params }),
    sellStock: (data) => api.post('/sold-stocks', data),
    updateSoldStock: (id, data) => api.put(`/sold-stocks/${id}`, data),
    deleteSoldStock: (id) => api.delete(`/sold-stocks/${id}`),
};

export default api;
