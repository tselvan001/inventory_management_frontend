import { useState } from 'react';
import { Button } from './Button';
import './Stock.css';

export function EditTakenStockForm({ record, stock, onSave, onCancel }) {
    // Current available stock is stock.quantityInStock
    // The previous taken quantity is record.takenQuantity
    // So the "True Total Available" if we reverted this transaction would be:
    const currentStockBeforeTransaction = (Number(stock?.quantityInStock) || 0) + (Number(record?.takenQuantity) || 0);

    const [formData, setFormData] = useState({
        takenQuantity: record.takenQuantity,
        dateTaken: record.dateTaken,
        takenBy: record.takenBy || 'Admin'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'takenQuantity' ? (value === '' ? '' : Number(value)) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const qty = Number(formData.takenQuantity);
        if (!qty || qty <= 0) {
            alert("Please enter a valid quantity");
            return;
        }

        if (qty > currentStockBeforeTransaction) {
            alert(`Cannot take more than total available stock (${currentStockBeforeTransaction})`);
            return;
        }

        onSave({
            ...record,
            takenQuantity: qty,
            dateTaken: formData.dateTaken,
            takenBy: formData.takenBy
        });
    };

    const newTakenQty = Number(formData.takenQuantity) || 0;
    const remainingStock = currentStockBeforeTransaction - newTakenQty;

    return (
        <form onSubmit={handleSubmit} className="stock-form">
            <div className="form-section-title">Edit Taken Stock</div>

            <div className="stock-summary-card">
                <div className="summary-item">
                    <span className="summary-label">Product</span>
                    <span className="summary-value highlight">{stock?.product}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Current Stock</span>
                    <span className="summary-value">{currentStockBeforeTransaction}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">New Stock Qty</span>
                    <span className="summary-value">{remainingStock}</span>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Taken Quantity</label>
                <input
                    className="form-control"
                    type="number"
                    name="takenQuantity"
                    value={formData.takenQuantity}
                    onChange={handleChange}
                    min="1"
                    max={currentStockBeforeTransaction}
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Date Taken</label>
                <input
                    className="form-control"
                    type="date"
                    name="dateTaken"
                    value={formData.dateTaken}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-actions">
                <Button
                    type="button"
                    name="Cancel"
                    variant="secondary"
                    onClick={onCancel}
                />
                <Button
                    type="submit"
                    name="Save Changes"
                    variant="primary"
                />
            </div>
        </form>
    );
}
