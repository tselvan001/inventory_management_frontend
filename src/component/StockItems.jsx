import { FaEdit, FaTrash, FaClone } from "react-icons/fa";

export function StockItems({ item, index, onEdit, onDelete, onClone, onTake, onViewTakenHistory, onViewEmptyHistory, onEmpty, onSell, onViewSoldHistory, location }) {
    const isRetail = location === 'Retail';

    return (
        <>
            <tr>
                <td>{index}</td>
                <td>{item.product}</td>
                <td>{item.quantityInStock}</td>
                {isRetail ? (
                    <td
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

                <td>{item.expiryDate}</td>
                <td className="actions-cell">
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