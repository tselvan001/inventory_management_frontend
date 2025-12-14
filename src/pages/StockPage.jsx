import { StockTable } from '../component/StockTable.jsx';
import { useState } from 'react';
import { Stock } from '../component/Stock.jsx';
import { useSearchParams } from 'react-router-dom';
import { Modal } from '../component/UI/Modal.jsx';
import { Button } from '../component/Button.jsx';
import './StockPage.css';

export function StockPage() {
    const [searchParams] = useSearchParams();
    const location = searchParams.get("location") ?? 'Stock';
    const [showAddStockForm, setShowAddStockForm] = useState(false);
    const defaultVal = null;

    const [formData, setFormData] = useState(defaultVal);
    const [isEdit, setIsEdit] = useState(false);


    function onClose() {
        setShowAddStockForm(false);
        setFormData(defaultVal);
        setIsEdit(false);
    }

    function onSave(newStock) {
        const newStockData = [...stockData, newStock];
        setStockData(newStockData);
        setShowAddStockForm(false);
        setFormData(defaultVal);
        setIsEdit(false);
    }

    function onEdit(updatedStock) {
        const updatedStockData = stockData.map(item =>
            item.no === updatedStock.no ? updatedStock : item
        );
        setStockData(updatedStockData);
        setShowAddStockForm(false);
        setFormData(defaultVal);
        setIsEdit(false);
    }

    const [stockData, setStockData] = useState([
        {
            no: 1,
            product: 'Sugar',
            quantityInStock: 50,
            quantityInUsage: 10,
            manufacturingDate: '2023-01-01',
            expiryDate: '2024-01-01',
            unit: 'Box',
            mrpPerUnit: 60,
            purchasePricePerUnit: 50
        },
        {
            no: 2,
            product: 'Coffee',
            quantityInStock: 30,
            quantityInUsage: 5,
            manufacturingDate: '2023-02-01',
            expiryDate: '2024-02-01',
            unit: 'Cover',
            mrpPerUnit: 5.0,
            purchasePricePerUnit: 3.0
        }
    ]);

    return (
        <div>
            <div className="stock-page-header">
                <h1 className="stock-page-title">Stock List - {location}</h1>
                <Button onClick={() => setShowAddStockForm(true)} name="Add Stock" variant="primary" />
            </div>

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

            <div>
                <StockTable
                    stockData={stockData}
                    setStockData={setStockData}
                    setShowAddStockForm={setShowAddStockForm}
                    setFormData={setFormData}
                    setIsEdit={setIsEdit}
                />
            </div>
        </div>
    );
}