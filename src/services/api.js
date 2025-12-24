import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const stockService = {
    getAllStocks: (location) => api.get('/stocks', { params: { location } }),
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

export default api;
