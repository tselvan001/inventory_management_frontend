import { useState } from 'react';
import { Button } from './Button.jsx';
import './Stock.css';

export function EditEmptyStockForm({ record, productName, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        emptyDate: record.emptyDate,
        emptyQuantity: record.emptyQuantity,
        reason: record.reason
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

        const qty = Number(formData.emptyQuantity);
        if (qty <= 0) {
            alert('Empty quantity must be greater than 0');
            return;
        }

        if (!formData.reason.trim()) {
            alert('Please provide a reason for emptying');
            return;
        }

        onSave({
            ...record,
            emptyDate: formData.emptyDate,
            emptyQuantity: qty,
            reason: formData.reason
        });
    };

    // record.remainingQuantity is the current state of the take record
    // To show "Current" (before this record's contribution), we add back the current record's quantity
    const available = (record.remainingQuantity || 0) + (record.emptyQuantity || 0);
    const newQuantity = formData.emptyQuantity !== '' ? available - Number(formData.emptyQuantity) : available;



    return (
        <form onSubmit={handleSubmit} className="stock-form">
            <div className="form-section-title">Edit Empty Stock Record</div>

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
                    max={available}
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
                <Button type="button" name="Cancel" variant="secondary" onClick={onCancel} />
                <Button type="submit" name="Save Changes" variant="primary" />
            </div>
        </form>
    );
}
