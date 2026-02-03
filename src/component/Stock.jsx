import { useEffect, useState } from "react";
import { Button } from "./Button";
import './Stock.css';

export function Stock({ location, onSave, onClose, stock, onEdit, isEdit }) {
    const [stockData, setStockData] = useState(stock ? stock : {
        product: '',
        quantityInStock: '',
        manufacturingDate: '',
        expiryDate: '',
        mrpPerUnit: '',
        purchasePricePerUnit: '',
        batchNumber: '',
        stockReceivedDate: ''
    });
    const [errors, setErrors] = useState({});

    function validate() {
        const newErrors = {};
        if (!stockData.product || !stockData.product.trim()) {
            newErrors.product = "Product name is mandatory";
        }
        if (stockData.quantityInStock === '' || Number(stockData.quantityInStock) <= 0) {
            newErrors.quantityInStock = "Quantity must be greater than 0";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit() {
        if (!validate()) return;
        const newStock = {
            product: stockData.product,
            quantityInStock: Number(stockData.quantityInStock),
            manufacturingDate: stockData.manufacturingDate || null,
            expiryDate: stockData.expiryDate || null,
            mrpPerUnit: stockData.mrpPerUnit ? Number(stockData.mrpPerUnit) : null,
            purchasePricePerUnit: stockData.purchasePricePerUnit ? Number(stockData.purchasePricePerUnit) : null,
            batchNumber: stockData.batchNumber || null,
            stockReceivedDate: stockData.stockReceivedDate || null
        };
        onSave(newStock);
    }

    function handleEdit() {
        if (!validate()) return;
        const updatedStock = {
            id: stockData.id,
            product: stockData.product,
            quantityInStock: Number(stockData.quantityInStock),
            manufacturingDate: stockData.manufacturingDate || null,
            expiryDate: stockData.expiryDate || null,
            mrpPerUnit: stockData.mrpPerUnit ? Number(stockData.mrpPerUnit) : null,
            purchasePricePerUnit: stockData.purchasePricePerUnit ? Number(stockData.purchasePricePerUnit) : null,
            batchNumber: stockData.batchNumber || null,
            stockReceivedDate: stockData.stockReceivedDate || null
        };
        onEdit(updatedStock);
    }

    const handleDateClick = (e) => {
        try {
            e.target.showPicker();
        } catch (error) {
            console.log("showPicker not supported");
        }
    };

    useEffect(() => {
        if (stock) {
            setStockData(stock);
        }
    }, [stock]);

    return (
        <div className="stock-form">
            {/* Product Information Section */}
            <div className="form-section">
                <h3 className="form-section-title">Product Information</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Product Name <span className="required-star">*</span></label>
                        <input
                            className={`form-control ${errors.product ? 'invalid' : ''}`}
                            name="product"
                            type="text"
                            placeholder="e.g. Shampoo"
                            value={stockData.product}
                            onChange={(e) => {
                                setStockData({ ...stockData, product: e.target.value });
                                if (errors.product) setErrors({ ...errors, product: null });
                            }}
                        />
                        {errors.product && <span className="error-text">{errors.product}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Batch Number</label>
                        <input
                            className="form-control"
                            name="batchNumber"
                            type="text"
                            placeholder="e.g. B123"
                            value={stockData.batchNumber}
                            onChange={(e) => setStockData({ ...stockData, batchNumber: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Quantity Section */}
            <div className="form-section">
                <h3 className="form-section-title">Quantity</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Quantity In Stock <span className="required-star">*</span></label>
                        <input
                            className={`form-control ${errors.quantityInStock ? 'invalid' : ''}`}
                            name="quantityInStock"
                            type="number"
                            placeholder="0"
                            value={stockData.quantityInStock}
                            min="0"
                            step="1"
                            inputMode="numeric"
                            onKeyDown={(e) => {
                                if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '.') {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                if (inputValue === '') {
                                    setStockData((prev) => ({ ...prev, quantityInStock: '' }));
                                    return;
                                }
                                if (/^\d+$/.test(inputValue)) {
                                    setStockData((prev) => ({ ...prev, quantityInStock: inputValue }));
                                    if (errors.quantityInStock) setErrors({ ...errors, quantityInStock: null });
                                }
                            }}
                        />
                        {errors.quantityInStock && <span className="error-text">{errors.quantityInStock}</span>}
                    </div>
                </div>
            </div>

            {/* Dates Section */}
            <div className="form-section">
                <h3 className="form-section-title">Dates</h3>
                <div className="form-grid form-grid-3">
                    <div className="form-group">
                        <label className="form-label">Manufacturing Date</label>
                        <div className="date-input-wrapper" onClick={(e) => e.currentTarget.querySelector('input').showPicker()}>
                            <input
                                className="form-control date-input"
                                name="manufacturingDate"
                                type="date"
                                value={stockData.manufacturingDate}
                                onChange={(e) => setStockData({ ...stockData, manufacturingDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Expiry Date</label>
                        <div className="date-input-wrapper" onClick={(e) => e.currentTarget.querySelector('input').showPicker()}>
                            <input
                                className="form-control date-input"
                                name="expiryDate"
                                type="date"
                                value={stockData.expiryDate}
                                onChange={(e) => setStockData({ ...stockData, expiryDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Stock Received</label>
                        <div className="date-input-wrapper" onClick={(e) => e.currentTarget.querySelector('input').showPicker()}>
                            <input
                                className="form-control date-input"
                                name="stockReceivedDate"
                                type="date"
                                value={stockData.stockReceivedDate}
                                onChange={(e) => setStockData({ ...stockData, stockReceivedDate: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="form-section">
                <h3 className="form-section-title">Pricing</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">MRP per Unit</label>
                        <div className="price-input-wrapper">
                            <span className="price-symbol">₹</span>
                            <input
                                className="form-control price-input"
                                name="mrpPerUnit"
                                type="number"
                                placeholder="0.00"
                                value={stockData.mrpPerUnit}
                                min="0"
                                onChange={(e) => {
                                    const val = e.target.value === '' ? '' : Number(e.target.value);
                                    if (val === '' || val >= 0) setStockData({ ...stockData, mrpPerUnit: val });
                                }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Purchase Price per Unit</label>
                        <div className="price-input-wrapper">
                            <span className="price-symbol">₹</span>
                            <input
                                className="form-control price-input"
                                name="purchasePricePerUnit"
                                type="number"
                                placeholder="0.00"
                                value={stockData.purchasePricePerUnit}
                                min="0"
                                onChange={(e) => {
                                    const val = e.target.value === '' ? '' : Number(e.target.value);
                                    if (val === '' || val >= 0) setStockData({ ...stockData, purchasePricePerUnit: val });
                                }}
                            />
                        </div>
                    </div>
                </div>
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