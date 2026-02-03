import { FaEdit, FaTrash, FaClone } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useState } from 'react';

export function StockItems({ item, index, onEdit, onDelete, onClone, onTake, onViewTakenHistory, onViewEmptyHistory, onEmpty, onSell, onViewSoldHistory, location }) {
    const isRetail = location?.type === 'RETAIL';
    const { user, hasPermission } = useAuth();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <>
            <tr>
                <td className="col-compact text-center">{index}</td>
                <td className="text-left-align col-product">{item.product}</td>
                <td className="text-left-align col-batch">{item.batchNumber}</td>
                <td className="col-compact text-right">{item.totalQuantity}</td>
                <td className="col-compact text-right">{item.quantityInStock}</td>
                {isRetail ? (
                    <td
                        className="col-compact text-right"
                        onClick={() => hasPermission('STOCKS_SELL_VIEW') && onViewSoldHistory(item)}
                        style={{
                            cursor: hasPermission('STOCKS_SELL_VIEW') ? 'pointer' : 'default',
                            color: hasPermission('STOCKS_SELL_VIEW') ? 'var(--color-primary)' : 'inherit',
                            textDecoration: hasPermission('STOCKS_SELL_VIEW') ? 'underline' : 'none'
                        }}
                        title={hasPermission('STOCKS_SELL_VIEW') ? "Click to view sales history" : ""}
                    >
                        {item.quantitySold || 0}
                    </td>
                ) : (
                    <>
                        <td
                            className="col-compact text-right"
                            onClick={() => hasPermission('STOCKS_TAKE_VIEW') && onViewTakenHistory(item)}
                            style={{
                                cursor: hasPermission('STOCKS_TAKE_VIEW') ? 'pointer' : 'default',
                                color: hasPermission('STOCKS_TAKE_VIEW') ? 'var(--color-primary)' : 'inherit',
                                textDecoration: hasPermission('STOCKS_TAKE_VIEW') ? 'underline' : 'none'
                            }}
                            title={hasPermission('STOCKS_TAKE_VIEW') ? "Click to view taken stock history" : ""}
                        >
                            {item.quantityInUsage}
                        </td>
                        <td
                            className="col-compact text-right"
                            onClick={() => hasPermission('STOCKS_EMPTY_VIEW') && onViewEmptyHistory(item)}
                            style={{
                                cursor: hasPermission('STOCKS_EMPTY_VIEW') ? 'pointer' : 'default',
                                color: hasPermission('STOCKS_EMPTY_VIEW') ? 'var(--color-primary)' : 'inherit',
                                textDecoration: hasPermission('STOCKS_EMPTY_VIEW') ? 'underline' : 'none'
                            }}
                            title={hasPermission('STOCKS_EMPTY_VIEW') ? "Click to view empty stock history" : ""}
                        >
                            {item.quantityEmpty || 0}
                        </td>
                    </>
                )}

                <td className="col-compact">{item.expiryDate}</td>
                <td className="actions-cell col-actions">
                    <div className="actions-container">
                        {showDeleteConfirm ? (
                            <div className="action-icons-group">
                                <span className="confirm-text">Sure?</span>
                                <button
                                    className="table-btn table-btn-primary"
                                    onClick={() => {
                                        onDelete();
                                        setShowDeleteConfirm(false);
                                    }}
                                    title="Confirm Delete"
                                >
                                    Yes
                                </button>
                                <button
                                    className="table-btn table-btn-secondary"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    title="Cancel"
                                >
                                    No
                                </button>
                            </div>
                        ) : (
                            <div className="action-icons-group">
                                {hasPermission('STOCKS_UPDATE') && (
                                    <FaEdit
                                        title="Edit"
                                        size={18}
                                        className="action-icon edit-icon"
                                        style={{ cursor: "pointer", color: "var(--color-primary)" }}
                                        onClick={() => onEdit(item)}
                                    />
                                )}

                                {hasPermission('STOCKS_DELETE') && (
                                    <FaTrash
                                        title="Delete"
                                        size={18}
                                        className="action-icon delete-icon"
                                        style={{ cursor: "pointer", color: "var(--color-danger)" }}
                                        onClick={() => setShowDeleteConfirm(true)}
                                    />
                                )}

                                {hasPermission('STOCKS_CLONE') && (
                                    <FaClone
                                        title="Clone"
                                        size={18}
                                        className="action-icon clone-icon"
                                        style={{ cursor: "pointer", color: "var(--color-success)" }}
                                        onClick={() => onClone(item)}
                                    />
                                )}
                            </div>
                        )}

                        {/* Show Take button only for non-Retail locations */}
                        {!isRetail && hasPermission('STOCKS_TAKE_CREATE') && (
                            <button className="table-btn table-btn-primary" onClick={() => onTake(item)}>Take</button>
                        )}

                        {/* Show Sell button only for Retail locations */}
                        {isRetail && hasPermission('STOCKS_SELL_CREATE') && (
                            <button className="table-btn table-btn-success" onClick={() => onSell(item)}>Sell</button>
                        )}

                        {/* Show Empty button only for non-Retail locations */}
                        {!isRetail && hasPermission('STOCKS_EMPTY_CREATE') && (
                            <button className="table-btn table-btn-secondary" onClick={() => onEmpty(item)}>Empty</button>
                        )}
                    </div>
                </td>
            </tr>
        </>
    );
}