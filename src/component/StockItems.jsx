import { FaEdit, FaTrash, FaClone } from "react-icons/fa";

export function StockItems({ item, index, onEdit, onDelete, onClone, onTake, onViewTakenHistory, onViewEmptyHistory, onEmpty, onSell, onViewSoldHistory, location }) {
    const isRetail = location === 'retail';

    return (
        <>
            <tr>
                <td className="col-compact">{index}</td>
                <td className="text-left-align col-product">{item.product}</td>
                <td className="text-left-align col-batch">{item.batchNumber}</td>
                <td className="col-compact">{item.quantityInStock}</td>
                {isRetail ? (
                    <td
                        className="col-compact"
                        onClick={() => onViewSoldHistory(item)}
                        style={{
                            cursor: 'pointer',
                            color: 'var(--color-primary)',
                            textDecoration: 'underline'
                        }}
                        title="Click to view sales history"
                    >
                        {item.quantitySold || 0}
                    </td>
                ) : (
                    <>
                        <td
                            className="col-compact"
                            onClick={() => onViewTakenHistory(item)}
                            style={{
                                cursor: 'pointer',
                                color: 'var(--color-primary)',
                                textDecoration: 'underline'
                            }}
                            title="Click to view taken stock history"
                        >
                            {item.quantityInUsage}
                        </td>
                        <td
                            className="col-compact"
                            onClick={() => onViewEmptyHistory(item)}
                            style={{
                                cursor: 'pointer',
                                color: 'var(--color-primary)',
                                textDecoration: 'underline'
                            }}
                            title="Click to view empty stock history"
                        >
                            {item.quantityEmpty || 0}
                        </td>
                    </>
                )}

                <td className="col-compact">{item.expiryDate}</td>
                <td className="actions-cell col-actions">
                    <FaEdit
                        title="Edit"
                        className="action-icon edit-icon"
                        style={{ cursor: "pointer", color: "var(--color-primary)" }}
                        onClick={() => onEdit(item)}
                    />

                    <FaTrash
                        title="Delete"
                        className="action-icon delete-icon"
                        style={{ cursor: "pointer", color: "var(--color-danger)" }}
                        onClick={() => onDelete()}
                    />

                    <FaClone
                        title="Clone"
                        className="action-icon clone-icon"
                        style={{ cursor: "pointer", color: "var(--color-success)" }}
                        onClick={() => onClone(item)}
                    />

                    {/* Show Take button only for non-Retail locations */}
                    {!isRetail && <button className="table-btn table-btn-primary" onClick={() => onTake(item)}>Take</button>}

                    {/* Show Sell button only for Retail locations */}
                    {isRetail && <button className="table-btn table-btn-success" onClick={() => onSell(item)}>Sell</button>}

                    {/* Show Empty button only for non-Retail locations */}
                    {!isRetail && <button className="table-btn table-btn-secondary" onClick={() => onEmpty(item)}>Empty</button>}
                </td>
            </tr>
        </>
    );
}