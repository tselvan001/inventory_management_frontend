import { StockTable } from '../component/StockTable.jsx';
import { useState } from 'react';
import { Stock } from '../component/Stock.jsx';
import { useSearchParams } from 'react-router-dom';

export function StockPage()
{
    const [searchParams] = useSearchParams();
    const location = searchParams.get("location") ?? 'Stock';
    const [showAddStockForm, setShowAddStockForm] = useState(false);
    const defaultVal = null;

    const [formData, setFormData] = useState(defaultVal);
    const [isEdit, setIsEdit] = useState(false);


    function onClose() 
    {
        setShowAddStockForm(false);
        setFormData(defaultVal);
        setIsEdit(false);
    }

    function onSave(newStock) 
    {
        const newStockData = [...stockData, newStock];
        setStockData(newStockData);
        setShowAddStockForm(false);
        setFormData(defaultVal);
        setIsEdit(false);
    }

    function onEdit(updatedStock)
    {
        const updatedStockData = stockData.map(item =>
            item.no === updatedStock.no ? updatedStock : item
        );
        setStockData(updatedStockData);
        setShowAddStockForm(false);
        setFormData(defaultVal);
        setIsEdit(false);
    }

    const [stockData, setStockData] = useState([
        {
            no: 1,
            product: 'Sugar',
            quantityInStock: 50,
            quantityInUsage: 10,
            costPerUnit: 60
        },
        {
            no: 2,
            product: 'Coffee',
            quantityInStock: 30,
            quantityInUsage: 5,
            costPerUnit: 3.0
        }
    ]);

    return (
        <>
            <div>
                <h1>Stock List - {location}</h1>
            </div>
            <div>
                <button onClick={() => setShowAddStockForm(true)}>Add Stock</button>
            </div>
            {showAddStockForm && (
                <Stock 
                    location={location} 
                    onSave={onSave} 
                    onClose={onClose} 
                    onEdit={onEdit}
                    stock={formData}
                    isEdit={isEdit}
                />
            )}
            <div>
                <StockTable 
                    stockData={stockData}  
                    setStockData={setStockData} 
                    setShowAddStockForm={setShowAddStockForm} 
                    setFormData={setFormData}
                    setIsEdit={setIsEdit}
                />
            </div>
        </>
    );
}