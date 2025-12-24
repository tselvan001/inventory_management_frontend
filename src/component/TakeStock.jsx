import { useState } from 'react';
import { Button } from './Button';
import './Stock.css';

export function TakeStock({ stock, onTakeStock, onCancel }) {
    const [takenQuantity, setTakenQuantity] = useState('1');
    const [dateTaken, setDateTaken] = useState(new Date().toISOString().split('T')[0]);

    function handleSubmit() {
        if (!takenQuantity || takenQuantity <= 0) {
            alert("Please enter a valid quantity");
            return;
        }

        const qty = Number(takenQuantity);
        if (qty > stock.quantityInStock) {
            alert("Cannot take more than available stock");
            return;
        }

        const updatedStock = {
            ...stock,
            quantityInStock: Number(stock.quantityInStock) - qty,
            quantityInUsage: Number(stock.quantityInUsage || 0) + qty
        };

        const takenRecord = {
            stockId: stock.id,
            product: stock.product,
            takenQuantity: qty,
            dateTaken: dateTaken,
            takenBy: 'Admin'
        };

        onTakeStock(takenRecord);
    }

    const currentStock = Number(stock.quantityInStock);
    const taken = Number(takenQuantity) || 0;
    const remainingStock = currentStock - taken;

    const handleQuantityChange = (e) => {
        const val = e.target.value;
        if (val === '') {
            setTakenQuantity('');
            return;
        }
        const numVal = parseInt(val);
        if (numVal < 0) return; // Prevent negative
        if (numVal > currentStock) return; // Prevent > stock
        setTakenQuantity(val);
    };

    return (
        <div className="stock-form">
            <div className="stock-summary-card cols-4">
                <div className="summary-item">
                    <span className="summary-label">Product Name</span>
                    <span className="summary-value highlight">{stock.product}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Current Stock</span>
                    <span className="summary-value">{currentStock}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">New Stock Qty</span>
                    <span className="summary-value">{remainingStock}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Expiry Date</span>
                    <span className="summary-value">{stock.expiryDate}</span>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Taken Quantity</label>
                <input
                    className="form-control"
                    type="number"
                    value={takenQuantity}
                    onChange={handleQuantityChange}
                    placeholder="Enter quantity"
                    min="1"
                    max={currentStock}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Date Taken</label>
                <input
                    className="form-control"
                    type="date"
                    value={dateTaken}
                    onChange={(e) => setDateTaken(e.target.value)}
                />
            </div>

            <div className="form-actions">
                <Button
                    name="Cancel"
                    variant="secondary"
                    onClick={onCancel}
                />
                <Button
                    name="Take"
                    variant="primary"
                    onClick={handleSubmit}
                />
            </div>
        </div >
    );
}