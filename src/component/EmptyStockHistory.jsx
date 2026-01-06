import './StockTable.css';

export function EmptyStockHistory({ emptyRecords, productName }) {
    return (
        <div className="empty-stock-history">
            {emptyRecords.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                    No empty stock records found for this item.
                </p>
            ) : (
                <div className="table-container">
                    <table className="stock-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Taken Date</th>
                                <th>Empty Date</th>
                                <th>Empty Quantity</th>
                                <th>Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emptyRecords.map((record, index) => (
                                <tr key={record.id}>
                                    <td>{index + 1}</td>
                                    <td>{record.dateTaken}</td>
                                    <td>{record.emptyDate}</td>
                                    <td>{record.emptyQuantity}</td>
                                    <td>{record.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
