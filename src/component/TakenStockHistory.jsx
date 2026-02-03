import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import './StockTable.css';
import './TakenStockHistory.css';

export function TakenStockHistory({ takenRecords, productName, onEdit, onDelete }) {
    const { hasPermission } = useAuth();
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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
                            {(takenRecords || []).map((record, index) => (
                                <tr key={record.id}>
                                    <td className="col-compact text-center">{index + 1}</td>
                                    <td className="col-compact">{record.dateTaken}</td>
                                    <td className="col-compact text-right">{record.takenQuantity}</td>
                                    <td className="col-compact text-right">{record.emptiedQuantity || 0}</td>
                                    <td className="col-compact text-right">{record.remainingQuantity || 0}</td>
                                    <td className="col-compact">{record.takenBy}</td>
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
                                                {hasPermission('STOCKS_TAKE_UPDATE') && (
                                                    <FaEdit
                                                        title="Edit"
                                                        className="action-icon edit-icon"
                                                        style={{ cursor: "pointer", color: "var(--color-primary)" }}
                                                        onClick={() => onEdit(record)}
                                                    />
                                                )}
                                                {hasPermission('STOCKS_TAKE_DELETE') && (
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
