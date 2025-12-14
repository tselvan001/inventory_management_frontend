import { StockItems } from "./StockItems.jsx";
import './StockTable.css';

export function StockTable({ stockData, setStockData, setShowAddStockForm, setFormData, setIsEdit }) {
    function handleEdit(item) {
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
        <div className="table-container">
            <table className="stock-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Product</th>
                        <th>Stock Qty</th>
                        <th>Taken Qty</th>
                        <th>Exp Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stockData.length === 0 ? (
                        <tr>
                            <td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>No items found. Add some stock!</td>
                        </tr>
                    ) : (
                        stockData.map(
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
                    )}
                </tbody>
            </table>
        </div>
    );
}

