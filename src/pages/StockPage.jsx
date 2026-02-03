import { StockTable } from '../component/StockTable.jsx';
import { useState, useEffect } from 'react';
import { Stock } from '../component/Stock.jsx';
import { useSearchParams } from 'react-router-dom';
import { Modal } from '../component/UI/Modal.jsx';
import { Button } from '../component/Button.jsx';
import { stockService, dashboardService } from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import './StockPage.css';
import { Card } from '../component/UI/Card';
import { Breadcrumb } from '../component/UI/Breadcrumb';
import { Toggle } from '../component/UI/Toggle';
import { IoSearch } from 'react-icons/io5';
import { useToast } from '../context/ToastContext';

export function StockPage() {
    const [searchParams] = useSearchParams();
    const locationId = searchParams.get("locationId");
    const { user, hasPermission } = useAuth();
    const { error: toastError, success: toastSuccess } = useToast();

    const [currentLocation, setCurrentLocation] = useState(null);
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
    const [showSoldStocks, setShowSoldStocks] = useState(false);

    useEffect(() => {
        // Fetch current location info
        if (locationId) {
            dashboardService.getLocations().then(res => {
                const loc = res.data.find(l => l.id === parseInt(locationId));
                setCurrentLocation(loc);
            }).catch(console.error);
        }
    }, [locationId]);

    useEffect(() => {
        fetchStocks(locationId, filterProductName, filterBatchNumber, showSoldStocks);
    }, [locationId, filterProductName, filterBatchNumber, showSoldStocks]);

    const fetchStocks = async (locId, productName, batchNumber, isSold) => {
        try {
            setLoading(true);
            const response = await stockService.getAllStocks(locId, productName, batchNumber, 0, 1000, isSold);
            setStockData(response.data?.content || response.data || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching stocks:", err);
            if (!err.response || ![401, 403].includes(err.response.status)) {
                setError("Failed to load stocks. Please ensure the backend is running.");
            }
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
                product: newStock.product,
                quantityInStock: newStock.quantityInStock,
                manufacturingDate: newStock.manufacturingDate,
                expiryDate: newStock.expiryDate,
                mrpPerUnit: newStock.mrpPerUnit,
                purchasePricePerUnit: newStock.purchasePricePerUnit,
                batchNumber: newStock.batchNumber,
                stockReceivedDate: newStock.stockReceivedDate,
                locationId: parseInt(locationId)
            };
            await stockService.createStock(stockToSave);
            await fetchStocks(locationId, filterProductName, filterBatchNumber);
            toastSuccess("Stock added successfully!");
            onClose();
        } catch (err) {
            if (!err.response || ![401, 403].includes(err.response.status)) {
                toastError(err.response?.data?.error || "Error saving stock");
            }
        }
    }

    async function onEdit(updatedStock) {
        try {
            const stockToUpdate = {
                product: updatedStock.product,
                quantityInStock: updatedStock.quantityInStock,
                manufacturingDate: updatedStock.manufacturingDate,
                expiryDate: updatedStock.expiryDate,
                mrpPerUnit: updatedStock.mrpPerUnit,
                purchasePricePerUnit: updatedStock.purchasePricePerUnit,
                batchNumber: updatedStock.batchNumber,
                stockReceivedDate: updatedStock.stockReceivedDate,
                locationId: parseInt(locationId)
            };
            await stockService.updateStock(updatedStock.id, stockToUpdate);
            await fetchStocks(locationId, filterProductName, filterBatchNumber);
            toastSuccess("Stock updated successfully!");
            onClose();
        } catch (err) {
            if (!err.response || ![401, 403].includes(err.response.status)) {
                toastError(err.response?.data?.error || "Error updating stock");
            }
        }
    }

    const displayName = currentLocation?.name || 'Stock';
    const isRetail = currentLocation?.type === 'RETAIL';
    const toggleLabel = isRetail ? "Show Sold" : "Show Emptied";

    return (
        <div className="stock-page-container">
            <Breadcrumb items={[
                { label: 'Dashboard', to: '/' },
                { label: displayName }
            ]} />

            <Card>
                <div className={`stock-page-header ${(!stockData || stockData.length === 0) ? 'header-empty' : ''}`}>
                    <div className="header-top">
                        <h1 className="stock-page-title">{displayName}</h1>
                        {hasPermission('STOCKS_CREATE') && <Button onClick={() => setShowAddStockForm(true)} name="Add Stock" variant="primary" />}
                    </div>
                    <div className="header-bottom">
                        <div className="search-input-wrapper">
                            <IoSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Filter by Product..."
                                value={filterProductName}
                                onChange={(e) => setFilterProductName(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <div className="search-input-wrapper">
                            <IoSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Filter by Batch No..."
                                value={filterBatchNumber}
                                onChange={(e) => setFilterBatchNumber(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <Toggle
                            label={toggleLabel}
                            checked={showSoldStocks}
                            onChange={setShowSoldStocks}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Loading stocks...</div>
                ) : (
                    <>
                        {error && <div className="error-message">{error}</div>}
                        <StockTable
                            stockData={stockData}
                            setStockData={setStockData}
                            refreshData={() => fetchStocks(locationId, filterProductName, filterBatchNumber, showSoldStocks)}
                            setShowAddStockForm={setShowAddStockForm}
                            setFormData={setFormData}
                            setIsEdit={setIsEdit}
                            location={currentLocation}
                        />
                    </>
                )}
            </Card>

            <Modal
                isOpen={showAddStockForm}
                onClose={onClose}
                title={isEdit ? `Edit ${displayName} Stock` : `Add ${displayName} Stock`}
                size="lg"
            >
                <Stock
                    location={currentLocation}
                    onSave={onSave}
                    onClose={onClose}
                    onEdit={onEdit}
                    stock={formData}
                    isEdit={isEdit}
                />
            </Modal>
        </div>
    );
}