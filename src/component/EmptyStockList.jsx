import './StockTable.css';

export function EmptyStockList({ takenRecords, productName, onEmptyRecord }) {
    return (
        <div className="empty-stock-list">
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(takenRecords || []).map((record, index) => (
                                <tr key={record.id}>
                                    <td>{index + 1}</td>
                                    <td>{record.dateTaken}</td>
                                    <td>{record.takenQuantity}</td>
                                    <td>{record.takenBy}</td>
                                    <td className="actions-cell">
                                        <button
                                            onClick={() => onEmptyRecord(record)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                backgroundColor: 'var(--color-danger)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Empty
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
