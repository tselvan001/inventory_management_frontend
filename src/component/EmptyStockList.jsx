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
                                <th className="col-compact text-center">S.No</th>
                                <th className="col-compact">Date Taken</th>
                                <th className="col-compact text-right">Quantity Taken</th>
                                <th className="col-compact text-right">Emptied Qty</th>
                                <th className="col-compact text-right">Remaining Qty</th>
                                <th className="col-compact">Taken By</th>
                                <th className="col-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(takenRecords || [])
                                .filter(record => record.remainingQuantity > 0)
                                .map((record, index) => (
                                    <tr key={record.id}>
                                        <td className="col-compact text-center">{index + 1}</td>
                                        <td className="col-compact">{record.dateTaken}</td>
                                        <td className="col-compact text-right">{record.takenQuantity}</td>
                                        <td className="col-compact text-right">{record.emptiedQuantity || 0}</td>
                                        <td className="col-compact text-right">{record.remainingQuantity || 0}</td>
                                        <td className="col-compact">{record.takenBy}</td>
                                        <td className="actions-cell col-actions">
                                            {record.remainingQuantity > 0 && (
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
                                            )}
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
