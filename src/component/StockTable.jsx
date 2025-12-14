import { StockItems } from "./StockItems.jsx";

export function StockTable( { stockData, setStockData, setShowAddStockForm, setFormData, setIsEdit } )
{
    function handleEdit(item) 
    {
        setFormData(item);
        setShowAddStockForm(true);
        setIsEdit(true);
    }

    function handleDelete(no) {
        if (!window.confirm("Are you sure?")) return;
        const newStockData = stockData.filter(item => item.no !== no);
        setStockData(newStockData);
    }

    function handleClone(item) {
        const clonedItem = { ...item, no: stockData.length + 1 };
        setFormData(clonedItem);
        setIsEdit(false);
        setShowAddStockForm(true);
    }

    return (
        <div>
            <table>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Product</th>
                            <th>Quantity In Stock</th>
                            <th>Quantity In Usage</th>
                            <th>Cost Per Unit</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockData.map(
                            (item) => (
                                    <StockItems 
                                        key={item.no} 
                                        item={item} 
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onClone={handleClone}
                                    />
                                )
                            )
                        }
                    </tbody>
                </table>
        </div>
    );

    
}
