import { useState } from 'react';
import { Button } from './Button.jsx';
import './Stock.css';

export function EmptyStockForm({ record, productName, onSave, onCancel }) {
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        emptyDate: today,
        emptyQuantity: 1,
        reason: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'emptyQuantity' ? (value === '' ? '' : Number(value)) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate empty quantity
        if (formData.emptyQuantity <= 0) {
            alert('Empty quantity must be greater than 0');
            return;
        }

        if (formData.emptyQuantity > record.takenQuantity) {
            alert(`Empty quantity cannot exceed taken quantity (${record.takenQuantity})`);
            return;
        }

        if (!formData.reason.trim()) {
            alert('Please provide a reason for emptying');
            return;
        }

        onSave({
            ...record,
            stockId: record.stockId, // Ensure stockId from TakenStock record is passed
            emptyDate: formData.emptyDate,
            emptyQuantity: parseInt(formData.emptyQuantity),
            reason: formData.reason
        });
    };

    const available = record.remainingQuantity || 0;
    const newQuantity = formData.emptyQuantity && !isNaN(formData.emptyQuantity) ? available - Number(formData.emptyQuantity) : available;



    return (
        <form onSubmit={handleSubmit} className="stock-form">
            <div className="stock-summary-card cols-4">
                <div className="summary-item">
                    <span className="summary-label">Product Name</span>
                    <span className="summary-value highlight">{productName}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Taken Date</span>
                    <span className="summary-value">{record.dateTaken}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Current Stock</span>
                    <span className="summary-value">{available}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">New Stock</span>
                    <span className="summary-value">{newQuantity}</span>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="emptyDate">Empty Date</label>
                <input
                    type="date"
                    id="emptyDate"
                    name="emptyDate"
                    value={formData.emptyDate}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="emptyQuantity" className="form-label">Empty Quantity</label>
                <input
                    type="number"
                    id="emptyQuantity"
                    name="emptyQuantity"
                    value={formData.emptyQuantity}
                    onChange={handleChange}
                    min="1"
                    max={record.remainingQuantity}
                    className="form-control"
                    required
                />

            </div>

            <div className="form-group">
                <label htmlFor="reason">Reason</label>
                <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                    placeholder="Enter reason for emptying..."
                    required
                />
            </div>

            <div className="form-actions">
                <Button type="submit" name="Save" variant="primary" />
                <Button type="button" name="Cancel" variant="secondary" onClick={onCancel} />
            </div>
        </form>
    );
}
