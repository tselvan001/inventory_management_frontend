import { useState, useEffect } from 'react';
import { Button } from './Button';
import './Stock.css';

export function SellStock({ stock, onSellStock, onCancel }) {
    const [customerName, setCustomerName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [sellingPrice, setSellingPrice] = useState(stock.mrpPerUnit);

    const currentStock = Number(stock.quantityInStock);
    const available = currentStock;

    useEffect(() => {
        setSellingPrice(stock.mrpPerUnit);
    }, [stock]);

    function handleSubmit() {
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

        const updatedStock = {
            ...stock,
            quantityInStock: Number(stock.quantityInStock) - qty,
            quantitySold: (stock.quantitySold || 0) + qty
        };

        const soldRecord = {
            stockId: stock.id,
            product: stock.product,
            customerName,
            mobileNumber,
            quantity: qty,
            sellingPrice: Number(sellingPrice),
            totalAmount: qty * Number(sellingPrice),
            dateSold: new Date().toISOString().split('T')[0]
        };

        onSellStock(soldRecord);
    }

    return (
        <div className="stock-form">
            <div className="stock-summary-card cols-4">
                <div className="summary-item">
                    <span className="summary-label">Product Name</span>
                    <span className="summary-value highlight">{stock.product}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Qty Available</span>
                    <span className="summary-value">{available}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">MRP</span>
                    <span className="summary-value">{stock.mrpPerUnit}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Expiry Date</span>
                    <span className="summary-value">{stock.expiryDate}</span>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group half-width">
                    <label className="form-label">Mobile Number</label>
                    <input
                        className="form-control"
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="Enter mobile number"
                    />
                </div>
                <div className="form-group half-width">
                    <label className="form-label">Customer Name</label>
                    <input
                        className="form-control"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter customer name"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group half-width">
                    <label className="form-label">Quantity</label>
                    <input
                        className="form-control"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Enter quantity"
                        min="1"
                        max={available}
                    />
                </div>
                <div className="form-group half-width">
                    <label className="form-label">Selling Price</label>
                    <input
                        className="form-control"
                        type="number"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value)}
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
                    name="Sell"
                    variant="primary"
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
}
