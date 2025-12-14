import { useEffect, useState } from "react";
import { Button } from "./Button";
import './Stock.css';

export function Stock({ location, onSave, onClose, stock, onEdit, isEdit }) {
    const [stockData, setStockData] = useState(stock ? stock : {
        no: '',
        product: '',
        quantityInStock: '',
        quantityInUsage: '',
        manufacturingDate: '',
        expiryDate: '',
        unit: 'Box',
        mrpPerUnit: '',
        purchasePricePerUnit: ''
    });

    function handleSubmit() {
        // Simple validation
        if (!stockData.product) return;
        const newStock = { ...stockData };
        onSave(newStock);
    }

    function handleEdit() {
        const updatedStock = { ...stockData };
        onEdit(updatedStock);
    }

    useEffect(() => {
        if (stock) {
            setStockData(stock);
        }
    }, [stock]);

    return (
        <div className="stock-form">
            <div className="form-group">
                <label className="form-label">S. No</label>
                <input
                    className="form-input"
                    name="no"
                    type="text"
                    placeholder="Auto or Manual"
                    value={stockData.no}
                    onChange={(e) => setStockData({ ...stockData, no: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                    className="form-input"
                    name="product"
                    type="text"
                    placeholder="e.g. Shampoo"
                    value={stockData.product}
                    onChange={(e) => setStockData({ ...stockData, product: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Quantity In Stock</label>
                <input
                    className="form-input"
                    name="quantityInStock"
                    type="number"
                    placeholder="0"
                    value={stockData.quantityInStock}
                    onChange={(e) => setStockData({ ...stockData, quantityInStock: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Quantity In Usage</label>
                <input
                    className="form-input"
                    name="quantityInUsage"
                    type="number"
                    placeholder="0"
                    value={stockData.quantityInUsage}
                    onChange={(e) => setStockData({ ...stockData, quantityInUsage: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Manufacturing Date</label>
                <input
                    className="form-input"
                    name="manufacturingDate"
                    type="date"
                    value={stockData.manufacturingDate}
                    onChange={(e) => setStockData({ ...stockData, manufacturingDate: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                    className="form-input"
                    name="expiryDate"
                    type="date"
                    value={stockData.expiryDate}
                    onChange={(e) => setStockData({ ...stockData, expiryDate: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Unit</label>
                <select
                    className="form-input"
                    name="unit"
                    value={stockData.unit}
                    onChange={(e) => setStockData({ ...stockData, unit: e.target.value })}
                >
                    <option value="Box">Box</option>
                    <option value="Cover">Cover</option>
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">MRP per Unit</label>
                <input
                    className="form-input"
                    name="mrpPerUnit"
                    type="number"
                    placeholder="0.00"
                    value={stockData.mrpPerUnit}
                    onChange={(e) => setStockData({ ...stockData, mrpPerUnit: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Purchase Price per Unit</label>
                <input
                    className="form-input"
                    name="purchasePricePerUnit"
                    type="number"
                    placeholder="0.00"
                    value={stockData.purchasePricePerUnit}
                    onChange={(e) => setStockData({ ...stockData, purchasePricePerUnit: e.target.value })}
                />
            </div>

            <div className="form-actions">
                <Button
                    name="Cancel"
                    variant="secondary"
                    onClick={onClose}
                />
                <Button
                    name={isEdit ? "Update Stock" : "Save Stock"}
                    variant="primary"
                    onClick={isEdit ? handleEdit : handleSubmit}
                />
            </div>
        </div>
    );
}