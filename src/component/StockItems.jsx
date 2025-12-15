import { FaEdit, FaTrash, FaClone } from "react-icons/fa";

export function StockItems({ item, onEdit, onDelete, onClone }) {
    return (
        <>
            <tr>
                <td>{item.no}</td>
                <td>{item.product}</td>
                <td>{item.quantityInStock}</td>
                <td>{item.quantityInUsage}</td>
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
                        onClick={() => onDelete(item.no)}
                    />

                    <FaClone
                        title="Clone"
                        className="action-icon clone-icon"
                        style={{ cursor: "pointer", color: "var(--color-success)" }}
                        onClick={() => onClone(item)}
                    />
                    <button>Take</button>
                    <button>Sell</button>
                    <button>Empty</button>
                </td>
            </tr>
        </>
    );
}