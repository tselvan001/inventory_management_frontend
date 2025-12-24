import './StockTable.css';

export function SoldStockHistory({ soldRecords, productName }) {
    return (
        <div className="history-container">
            {soldRecords.length === 0 ? (
                <p className="no-records">No sales history found for {productName}.</p>
            ) : (
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Mobile</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {soldRecords.map((record, index) => (
                            <tr key={index}>
                                <td>{record.dateSold}</td>
                                <td>{record.customerName}</td>
                                <td>{record.mobileNumber}</td>
                                <td>{record.quantity}</td>
                                <td>{record.sellingPrice}</td>
                                <td>{record.totalAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
