import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import './StockTable.css';
import './EmptyStockHistory.css';

export function EmptyStockHistory({ emptyRecords, productName, onEdit, onDelete }) {
    const { hasPermission } = useAuth();
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    return (
        <div className="empty-stock-history">
            {!emptyRecords || emptyRecords.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                    No empty stock records found for this item.
                </p>
            ) : (
                <div className="table-container">
                    <table className="stock-table">
                        <thead>
                            <tr>
                                <th className="col-compact text-center">S.No</th>
                                <th className="col-compact">Taken Date</th>
                                <th className="col-compact">Empty Date</th>
                                <th className="col-compact text-right">Empty Quantity</th>
                                <th>Reason</th>
                                <th className="col-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(emptyRecords || []).map((record, index) => (
                                <tr key={record.id}>
                                    <td className="col-compact text-center">{index + 1}</td>
                                    <td className="col-compact">{record.dateTaken}</td>
                                    <td className="col-compact">{record.emptyDate}</td>
                                    <td className="col-compact text-right">{record.emptyQuantity}</td>
                                    <td>{record.reason}</td>
                                    <td className="actions-cell col-actions">
                                        {deleteConfirmId === record.id ? (
                                            <div className="action-icons-group">
                                                <span className="confirm-text">Sure?</span>
                                                <button
                                                    className="table-btn table-btn-primary"
                                                    onClick={() => {
                                                        onDelete(record.id);
                                                        setDeleteConfirmId(null);
                                                    }}
                                                    title="Confirm Delete"
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    className="table-btn table-btn-secondary"
                                                    onClick={() => setDeleteConfirmId(null)}
                                                    title="Cancel"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="action-icons-group">
                                                {hasPermission('STOCKS_EMPTY_UPDATE') && (
                                                    <FaEdit
                                                        title="Edit"
                                                        className="action-icon edit-icon"
                                                        style={{ cursor: "pointer", color: "var(--color-primary)" }}
                                                        onClick={() => onEdit(record)}
                                                    />
                                                )}
                                                {hasPermission('STOCKS_EMPTY_DELETE') && (
                                                    <FaTrash
                                                        title="Delete"
                                                        className="action-icon delete-icon"
                                                        style={{ cursor: "pointer", color: "var(--color-danger)" }}
                                                        onClick={() => setDeleteConfirmId(record.id)}
                                                    />
                                                )}
                                            </div>
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
