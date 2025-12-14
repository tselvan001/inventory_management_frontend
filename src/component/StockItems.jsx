import { FaEdit, FaTrash, FaClone } from "react-icons/fa";

export function StockItems( { item, onEdit, onDelete, onClone } ) 
{
        return (
            <>
                <tr>
                    <td>{item.no}</td>
                    <td>{item.product}</td>
                    <td>{item.quantityInStock}</td>
                    <td>{item.quantityInUsage}</td>
                    <td>{item.costPerUnit}</td>
                    <td style={{ display: "flex", gap: "10px" }}>
                        <FaEdit
                            title="Edit"
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={() => onEdit(item)}
                        />

                        <FaTrash
                            title="Delete"
                            style={{ cursor: "pointer", color: "red" }}
                            onClick={() => onDelete(item.no)}
                        />

                        <FaClone
                            title="Clone"
                            style={{ cursor: "pointer", color: "green" }}
                            onClick={() => onClone(item)}
                        />
                    </td>
                </tr>
            </>
        );
}