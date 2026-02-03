import { useState, useEffect } from 'react';
import { Button } from './Button';
import './Stock.css';

export function SellStock({ stock, onSellStock, onCancel, initialData }) {
    const isEdit = !!initialData;
    const [customerName, setCustomerName] = useState(initialData?.customerName || '');
    const [mobileNumber, setMobileNumber] = useState(initialData?.mobileNumber || '');
    const [quantity, setQuantity] = useState(initialData?.quantity?.toString() || '1');
    const [sellingPrice, setSellingPrice] = useState(initialData?.sellingPrice ?? stock.mrpPerUnit);
    const [dateSold, setDateSold] = useState(initialData?.dateSold || new Date().toISOString().split('T')[0]);

    const currentStock = Number(stock.quantityInStock);
    const available = isEdit ? currentStock + initialData.quantity : currentStock;

    // The initial state handles the default selling price. 
    // We don't need an effect to reset it, as it might overwrite user input during re-renders.

    function handleSubmit() {
        if (!dateSold) {
            alert("Please select a sale date");
            return;
        }

        if (sellingPrice === '' || sellingPrice === null || sellingPrice === undefined || isNaN(sellingPrice)) {
            alert("Please enter a selling price");
            return;
        }

        if (Number(sellingPrice) <= 0) {
            alert("Selling price must be greater than zero");
            return;
        }

        if (!quantity || Number(quantity) <= 0) {
            alert("Please enter a valid quantity");
            return;
        }

        const qty = Number(quantity);
        if (qty > available) {
            alert("Cannot sell more than available stock");
            return;
        }

        if (!customerName || !mobileNumber) {
            alert("Please enter customer details");
            return;
        }

        if (!/^\d{10}$/.test(mobileNumber)) {
            alert("Please enter a valid 10-digit mobile number");
            return;
        }

        const soldRecord = {
            id: initialData?.id,
            stockId: stock.id,
            product: stock.product,
            customerName,
            mobileNumber,
            quantity: qty,
            sellingPrice: Number(sellingPrice),
            totalAmount: qty * Number(sellingPrice),
            dateSold: dateSold
        };

        onSellStock(soldRecord);
    }

    const newQuantity = quantity && !isNaN(quantity) ? available - Number(quantity) : available;
    const totalAmount = (quantity && sellingPrice) ? Number(quantity) * Number(sellingPrice) : 0;

    return (
        <div className="stock-form">
            <div className="stock-summary-card cols-6">
                <div className="summary-item">
                    <span className="summary-label">Product Name</span>
                    <span className="summary-value highlight">{stock.product}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">MRP</span>
                    <span className="summary-value">{stock.mrpPerUnit}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Expiry Date</span>
                    <span className="summary-value">{stock.expiryDate}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Current Qty</span>
                    <span className="summary-value">{available}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">New Qty</span>
                    <span className="summary-value highlight">{newQuantity}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Total Amount</span>
                    <span className="summary-value highlight">₹{totalAmount.toLocaleString()}</span>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group half-width">
                    <label htmlFor="dateSold" className="form-label">Date</label>
                    <div className="date-input-wrapper">
                        <input
                            id="dateSold"
                            className="form-control date-input"
                            type="date"
                            value={dateSold}
                            onChange={(e) => setDateSold(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-group half-width">
                    <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                    <input
                        id="mobileNumber"
                        className="form-control"
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setMobileNumber(val);
                        }}
                        placeholder="Enter mobile number"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group full-width">
                    <label htmlFor="customerName" className="form-label">Customer Name</label>
                    <input
                        id="customerName"
                        className="form-control"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter customer name"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group full-width">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <input
                        id="quantity"
                        className="form-control"
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                            const val = e.target.value === '' ? '' : Number(e.target.value);
                            setQuantity(val);
                        }}
                        placeholder="Enter quantity"
                        min="1"
                        max={available}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group full-width">
                    <label htmlFor="sellingPrice" className="form-label">Selling Price</label>
                    <input
                        id="sellingPrice"
                        className="form-control"
                        type="number"
                        value={sellingPrice}
                        onChange={(e) => {
                            const val = e.target.value === '' ? '' : Number(e.target.value);
                            setSellingPrice(val);
                        }}
                        placeholder="Enter selling price"
                    />
                </div>
            </div>

            <div className="form-actions">
                <Button
                    name="Cancel"
                    variant="secondary"
                    onClick={onCancel}
                />
                <Button
                    name={isEdit ? "Update" : "Sell"}
                    variant="primary"
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
}
