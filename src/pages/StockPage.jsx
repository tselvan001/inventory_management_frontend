import { StockTable } from '../component/StockTable.jsx';
import { useState, useEffect } from 'react';
import { Stock } from '../component/Stock.jsx';
import { useSearchParams } from 'react-router-dom';
import { Modal } from '../component/UI/Modal.jsx';
import { Button } from '../component/Button.jsx';
import { stockService } from '../services/api.js';
import './StockPage.css';

export function StockPage() {
    const [searchParams] = useSearchParams();
    const location = searchParams.get("location") ?? 'Stock';
    const [showAddStockForm, setShowAddStockForm] = useState(false);
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const defaultVal = null;

    const [formData, setFormData] = useState(defaultVal);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchStocks(location);
    }, [location]);

    const fetchStocks = async (loc) => {
        try {
            setLoading(true);
            const response = await stockService.getAllStocks(loc);
            setStockData(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching stocks:", err);
            setError("Failed to load stocks. Please ensure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    function onClose() {
        setShowAddStockForm(false);
        setFormData(defaultVal);
        setIsEdit(false);
    }

    async function onSave(newStock) {
        try {
            const stockToSave = {
                ...newStock,
                location: location // Map current page location to stock item
            };
            await stockService.createStock(stockToSave);
            await fetchStocks(location); // Refresh list
            onClose();
        } catch (err) {
            alert(err.response?.data?.error || "Error saving stock");
        }
    }

    async function onEdit(updatedStock) {
        try {
            await stockService.updateStock(updatedStock.id, updatedStock);
            await fetchStocks(location); // Refresh list
            onClose();
        } catch (err) {
            alert(err.response?.data?.error || "Error updating stock");
        }
    }

    return (
        <div>
            <div className="stock-page-header">
                <h1 className="stock-page-title">Stock List - {location}</h1>
                <Button onClick={() => setShowAddStockForm(true)} name="Add Stock" variant="primary" />
            </div>

            {loading && <div className="loading">Loading stocks...</div>}
            {error && <div className="error-message">{error}</div>}

            <Modal
                isOpen={showAddStockForm}
                onClose={onClose}
                title={isEdit ? `Edit ${location} Stock` : `Add ${location} Stock`}
            >
                <Stock
                    location={location}
                    onSave={onSave}
                    onClose={onClose}
                    onEdit={onEdit}
                    stock={formData}
                    isEdit={isEdit}
                />
            </Modal>

            <div style={{ opacity: loading ? 0.5 : 1 }}>
                <StockTable
                    stockData={stockData}
                    setStockData={setStockData}
                    refreshData={fetchStocks}
                    setShowAddStockForm={setShowAddStockForm}
                    setFormData={setFormData}
                    setIsEdit={setIsEdit}
                    location={location}
                />
            </div>
        </div>
    );
}