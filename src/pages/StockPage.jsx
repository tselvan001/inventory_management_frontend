import { StockTable } from '../component/StockTable.jsx';
import { useState, useEffect } from 'react';
import { Stock } from '../component/Stock.jsx';
import { useSearchParams } from 'react-router-dom';
import { Modal } from '../component/UI/Modal.jsx';
import { Button } from '../component/UI/Button.jsx';
import { Pagination } from '../component/UI/Pagination.jsx';
import { Spinner } from '../component/UI/Spinner.jsx';
import { stockService } from '../services/api.js';
import './StockPage.css';

export function StockPage() {
    const [searchParams] = useSearchParams();
    const location = searchParams.get("location") ?? 'Stock';

    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [showAddStockForm, setShowAddStockForm] = useState(false);
    const [formData, setFormData] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchStocks(location, page, pageSize);
    }, [location, page, pageSize]);

    const fetchStocks = async (loc, p = 0, size = 10) => {
        try {
            setLoading(true);
            const response = await stockService.getAllStocks({
                location: loc,
                page: p,
                size: size,
                sort: 'ProductName,asc'
            });

            // Backend returns Page object
            setStockData(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
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
        setFormData(null);
        setIsEdit(false);
    }

    async function onSave(newStock) {
        try {
            const stockToSave = {
                ...newStock,
                location: location
            };
            await stockService.createStock(stockToSave);
            await fetchStocks(location, page, pageSize);
            onClose();
        } catch (err) {
            alert(err.response?.data?.error || "Error saving stock");
        }
    }

    async function onEdit(updatedStock) {
        try {
            await stockService.updateStock(updatedStock.id, updatedStock);
            await fetchStocks(location, page, pageSize);
            onClose();
        } catch (err) {
            alert(err.response?.data?.error || "Error updating stock");
        }
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setPage(0); // Reset to first page when size changes
    };

    return (
        <div className="stock-page-container">
            <div className="stock-page-header">
                <h1 className="stock-page-title">Stock List - {location}</h1>
                <Button onClick={() => setShowAddStockForm(true)} name="Add Stock" variant="primary" />
            </div>

            {loading && <div className="loading-container"><Spinner size="lg" /></div>}

            {error && (
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <Button name="Retry" onClick={() => fetchStocks(location, page, pageSize)} />
                </div>
            )}

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

            {!loading && !error && (
                <>
                    <StockTable
                        stockData={stockData}
                        setStockData={setStockData}
                        refreshData={() => fetchStocks(location, page, pageSize)}
                        setShowAddStockForm={setShowAddStockForm}
                        setFormData={setFormData}
                        setIsEdit={setIsEdit}
                        location={location}
                    />

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalElements={totalElements}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />
                </>
            )}
        </div>
    );
}