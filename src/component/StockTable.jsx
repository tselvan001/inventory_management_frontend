import { StockItems } from "./StockItems.jsx";
import './StockTable.css';

export function StockTable({ stockData, setStockData, setShowAddStockForm, setFormData, setIsEdit }) 
{
    const [showTakeStockForm, setShowTakeStockForm] = useState(false);

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

    function handleTake(item) {
        setShowTakeStockForm(true);
    }

    return (
        <div className="table-container">

            <Modal
                isOpen={showTakeStockForm}
                onClose={onClose}
                title={'Take Stock'}
            >
                <TakeStock
                    stock={formData}
                    onTakeStock={(updatedStock) => {
                        const updatedStockData = stockData.map(item =>
                            item.no === updatedStock.no ? updatedStock : item
                        );
                        setStockData(updatedStockData);
                        setShowTakeStockForm(false);
                    }}
                    onCancel={() => setShowTakeStockForm(false)}
                />
            </Modal>
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
                                    onTake={handleTake}
                                    onDispose={handleDispose}
                                />
                            )
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}

