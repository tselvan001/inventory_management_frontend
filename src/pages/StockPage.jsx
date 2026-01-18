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
    const location = searchParams.get("location");

    const locationMapping = {
        'retail': 'Retail',
        'pantry': 'Pantry',
        'salon_products_in_pantry': 'Salon Products in Pantry',
        'colours': 'Colours',
        'men_hairwash': 'Men Hairwash',
        'men_facial_room': 'Men Facial Room',
        'nail_art': 'Nail Art',
        'bridal': 'Bridal'
    };

    const displayName = locationMapping[location] || location || 'Stock';
    const [showAddStockForm, setShowAddStockForm] = useState(false);
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const defaultVal = null;

    const [formData, setFormData] = useState(defaultVal);
    const [isEdit, setIsEdit] = useState(false);

    // Filter states
    const [filterProductName, setFilterProductName] = useState("");
    const [filterBatchNumber, setFilterBatchNumber] = useState("");

    useEffect(() => {
        fetchStocks(location, filterProductName, filterBatchNumber);
    }, [location, filterProductName, filterBatchNumber]);

    const fetchStocks = async (loc, productName, batchNumber) => {
        try {
            setLoading(true);
            const response = await stockService.getAllStocks(loc, productName, batchNumber);
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
            await fetchStocks(location, filterProductName, filterBatchNumber); // Refresh list with current filters
            onClose();
        } catch (err) {
            alert(err.response?.data?.error || "Error saving stock");
        }
    }

    async function onEdit(updatedStock) {
        try {
            await stockService.updateStock(updatedStock.id, updatedStock);
            await fetchStocks(location, filterProductName, filterBatchNumber); // Refresh list with current filters
            onClose();
        } catch (err) {
            alert(err.response?.data?.error || "Error updating stock");
        }
    }

    return (
        <div>
            <div className={`stock-page-header ${stockData.length === 0 ? 'header-empty' : ''}`}>
                <div className="header-left">
                    <h1 className="stock-page-title">{displayName}</h1>
                </div>
                <div className="header-right">
                    <div className="filter-bar">
                        <input
                            type="text"
                            placeholder="Filter by Product..."
                            value={filterProductName}
                            onChange={(e) => setFilterProductName(e.target.value)}
                            className="filter-input"
                        />
                        <input
                            type="text"
                            placeholder="Filter by Batch No..."
                            value={filterBatchNumber}
                            onChange={(e) => setFilterBatchNumber(e.target.value)}
                            className="filter-input"
                        />
                    </div>
                    <Button onClick={() => setShowAddStockForm(true)} name="Add Stock" variant="primary" />
                </div>
            </div>

            {loading && <div className="loading">Loading stocks...</div>}
            {error && <div className="error-message">{error}</div>}

            <Modal
                isOpen={showAddStockForm}
                onClose={onClose}
                title={isEdit ? `Edit ${displayName} Stock` : `Add ${displayName} Stock`}
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
                    refreshData={() => fetchStocks(location, filterProductName, filterBatchNumber)}
                    setShowAddStockForm={setShowAddStockForm}
                    setFormData={setFormData}
                    setIsEdit={setIsEdit}
                    location={location}
                />
            </div>
        </div>
    );
}