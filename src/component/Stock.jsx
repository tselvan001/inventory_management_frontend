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
        purchasePricePerUnit: '',
        batchNumber: '',
        stockReceivedDate: ''
    });

    function handleSubmit() {
        if (!stockData.product) return;
        const newStock = {
            ...stockData,
            quantityInStock: Number(stockData.quantityInStock),
            mrpPerUnit: Number(stockData.mrpPerUnit),
            purchasePricePerUnit: Number(stockData.purchasePricePerUnit)
        };
        onSave(newStock);
    }

    function handleEdit() {
        const updatedStock = {
            ...stockData,
            quantityInStock: Number(stockData.quantityInStock),
            mrpPerUnit: Number(stockData.mrpPerUnit),
            purchasePricePerUnit: Number(stockData.purchasePricePerUnit)
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
            {/* S.No is auto-generated */}

            <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                    className="form-control"
                    name="product"
                    type="text"
                    placeholder="e.g. Shampoo"
                    value={stockData.product}
                    onChange={(e) => setStockData({ ...stockData, product: e.target.value })}
                />
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

            <div className="form-group">
                <label className="form-label">Quantity In Stock</label>
                <input
                    className="form-control"
                    name="quantityInStock"
                    type="number"
                    placeholder="0"
                    value={stockData.quantityInStock}
                    min="0"
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val >= 0) setStockData({ ...stockData, quantityInStock: val });
                    }}
                />
            </div>

            {/* Quantity In Usage is default 0 */}

            <div className="form-grid">
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
            </div>

            <div className="form-group">
                <label className="form-label">Stock Received Date</label>
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

            {/* Unit is default Box */}

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">MRP per Unit</label>
                    <input
                        className="form-control"
                        name="mrpPerUnit"
                        type="number"
                        placeholder="0.00"
                        value={stockData.mrpPerUnit}
                        min="0"
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val >= 0) setStockData({ ...stockData, mrpPerUnit: val });
                        }}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Purchase Price per Unit</label>
                    <input
                        className="form-control"
                        name="purchasePricePerUnit"
                        type="number"
                        placeholder="0.00"
                        value={stockData.purchasePricePerUnit}
                        min="0"
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val >= 0) setStockData({ ...stockData, purchasePricePerUnit: val });
                        }}
                    />
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