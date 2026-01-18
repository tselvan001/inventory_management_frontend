import './StockTable.css';

export function TakenStockHistory({ takenRecords, productName }) {
    return (
        <div className="taken-stock-history">

            {!takenRecords || takenRecords.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                    No taken stock records found for this item.
                </p>
            ) : (
                <div className="table-container">
                    <table className="stock-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Date Taken</th>
                                <th>Quantity Taken</th>
                                <th>Taken By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(takenRecords || []).map((record, index) => (
                                <tr key={record.id}>
                                    <td>{index + 1}</td>
                                    <td>{record.dateTaken}</td>
                                    <td>{record.takenQuantity}</td>
                                    <td>{record.takenBy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
