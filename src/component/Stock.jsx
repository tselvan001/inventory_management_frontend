import { useEffect, useState } from "react";

export function Stock( { location, onSave, onClose, stock, onEdit, isEdit } ) 
{
    const [stockData, setStockData] = useState(stock ? stock : {
        no: '',
        product: 'Test',
        quantityInStock: 5,
        quantityInUsage: 3,
        costPerUnit: 100
    });

    function handleSubmit() 
    {
        const newStock = {...stockData};

        onSave(newStock);
    }

    function handleEdit()
    {
        const updatedStock = {...stockData};
        
        onEdit(updatedStock);
    }

    useEffect(() => {
        if (stock) {
            setStockData(stock);
        }
    }, [stock]);

    return (
        <div>
            <h2> { stock ? `Edit ${location} Stock` : `Add ${location} Stock` }</h2>  
            <input 
                name="no"
                type="text"
                placeholder="S. No"
                value={stockData.no}
                onChange={(e) => setStockData({ ...stockData, no: e.target.value })}
            />
            <input
                name="product"
                type="text"
                placeholder="Product Name"
                value={stockData.product}
                onChange={(e) => setStockData({ ...stockData, product: e.target.value })}
            />
            <input
                name="quantityInStock"
                type="number"
                placeholder="Quantity In Stock"
                value={stockData.quantityInStock}
                onChange={(e) => setStockData({ ...stockData, quantityInStock: e.target.value })}
            />
            <input
                name="quantityInUsage"
                type="number"
                placeholder="Quantity In Usage"
                value={stockData.quantityInUsage}
                onChange={(e) => setStockData({ ...stockData, quantityInUsage: e.target.value })}
            />
            <input
                name="costPerUnit"
                type="number"
                placeholder="Cost Per Unit"
                value={stockData.costPerUnit}
                onChange={(e) => setStockData({ ...stockData, costPerUnit: e.target.value })}
            />
            <button onClick={isEdit ? handleEdit : handleSubmit}>{ 'Save' }</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
}