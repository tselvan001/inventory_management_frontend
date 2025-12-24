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
            [name]: value
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

    return (
        <form onSubmit={handleSubmit} className="stock-form">
            <div className="stock-summary-card">
                <div className="summary-item">
                    <span className="summary-label">Product Name</span>
                    <span className="summary-value highlight">{productName}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Quantity Taken</span>
                    <span className="summary-value">{record.takenQuantity}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Taken Date</span>
                    <span className="summary-value">{record.dateTaken}</span>
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
                <label htmlFor="emptyQuantity">Empty Quantity</label>
                <input
                    type="number"
                    id="emptyQuantity"
                    name="emptyQuantity"
                    value={formData.emptyQuantity}
                    onChange={handleChange}
                    min="1"
                    max={record.takenQuantity}
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
