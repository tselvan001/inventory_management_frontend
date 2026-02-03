import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import React from 'react';
import './StockTable.css';
import './SoldStockHistory.css';

export function SoldStockHistory({ soldRecords, productName, onEdit, onDelete }) {
    const { hasPermission } = useAuth();
    const [deleteConfirmId, setDeleteConfirmId] = React.useState(null);

    return (
        <div className="history-container">
            {!soldRecords || soldRecords.length === 0 ? (
                <p className="no-records">No sales history found for {productName}.</p>
            ) : (
                <div className="table-container">
                    <table className="stock-table">
                        <thead>
                            <tr>
                                <th className="col-compact text-center">S.No</th>
                                <th className="col-compact">Date</th>
                                <th>Customer</th>
                                <th>Mobile</th>
                                <th className="col-compact text-right">Qty</th>
                                <th className="col-compact text-right">Price</th>
                                <th className="col-compact text-right">Total</th>
                                <th className="col-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(soldRecords || []).map((record, index) => (
                                <tr key={record.id || index}>
                                    <td className="col-compact text-center">{index + 1}</td>
                                    <td className="col-compact">{record.dateSold}</td>
                                    <td>{record.customerName}</td>
                                    <td>{record.mobileNumber}</td>
                                    <td className="col-compact text-right">{record.quantity}</td>
                                    <td className="col-compact text-right">{record.sellingPrice}</td>
                                    <td className="col-compact text-right">{record.totalAmount}</td>
                                    <td className="actions-cell col-actions">
                                        {deleteConfirmId === record.id ? (
                                            <div className="action-icons-group">
                                                <span className="confirm-text">Sure?</span>
                                                <button
                                                    className="table-btn table-btn-primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(record.id);
                                                        setDeleteConfirmId(null);
                                                    }}
                                                    title="Confirm Delete"
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    className="table-btn table-btn-secondary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteConfirmId(null);
                                                    }}
                                                    title="Cancel"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="action-icons-group">
                                                {hasPermission('STOCKS_SELL_UPDATE') && (
                                                    <FaEdit
                                                        title="Edit"
                                                        className="action-icon edit-icon"
                                                        style={{ cursor: "pointer", color: "var(--color-primary)" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEdit(record);
                                                        }}
                                                    />
                                                )}
                                                {hasPermission('STOCKS_SELL_DELETE') && (
                                                    <FaTrash
                                                        title="Delete"
                                                        className="action-icon delete-icon"
                                                        style={{ cursor: "pointer", color: "var(--color-danger)" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteConfirmId(record.id);
                                                        }}
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
