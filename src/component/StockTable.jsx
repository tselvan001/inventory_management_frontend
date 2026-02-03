import { useState, useEffect } from 'react';
import { StockItems } from "./StockItems.jsx";
import { Modal } from "./UI/Modal.jsx";
import { TakeStock } from "./TakeStock.jsx";
import { TakenStockHistory } from "./TakenStockHistory.jsx";
import { EmptyStockList } from "./EmptyStockList.jsx";
import { EmptyStockForm } from "./EmptyStockForm.jsx";
import { EmptyStockHistory } from "./EmptyStockHistory.jsx";
import { SellStock } from "./SellStock.jsx";
import { SoldStockHistory } from "./SoldStockHistory.jsx";
import { EditTakenStockForm } from "./EditTakenStockForm.jsx";
import { EditEmptyStockForm } from "./EditEmptyStockForm.jsx";
import { stockService, takenStockService, emptyStockService, soldStockService } from "../services/api.js";
import './StockTable.css';
import { EmptyState } from './UI/EmptyState';
import { Skeleton } from './UI/Skeleton';
import { useToast } from '../context/ToastContext';

export function StockTable({ stockData, setStockData, refreshData, setShowAddStockForm, setFormData, setIsEdit, location, loading }) {
    const [showTakeStockForm, setShowTakeStockForm] = useState(false);
    const [takingItem, setTakingItem] = useState(null);
    const [takenStockRecords, setTakenStockRecords] = useState([]);
    const [emptyStockRecords, setEmptyStockRecords] = useState([]);
    const [soldStockRecords, setSoldStockRecords] = useState([]);

    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedItemForHistory, setSelectedItemForHistory] = useState(null);
    const [showEmptyModal, setShowEmptyModal] = useState(false);
    const [selectedItemForEmpty, setSelectedItemForEmpty] = useState(null);
    const [showEmptyFormModal, setShowEmptyFormModal] = useState(false);
    const [selectedRecordForEmpty, setSelectedRecordForEmpty] = useState(null);
    const [showEmptyHistoryModal, setShowEmptyHistoryModal] = useState(false);
    const [selectedItemForEmptyHistory, setSelectedItemForEmptyHistory] = useState(null);

    const [showEditTakenModal, setShowEditTakenModal] = useState(false);
    const [selectedTakenRecordForEdit, setSelectedTakenRecordForEdit] = useState(null);

    const [showEditEmptyModal, setShowEditEmptyModal] = useState(false);
    const [selectedEmptyRecordForEdit, setSelectedEmptyRecordForEdit] = useState(null);

    // Sell Stock States
    const [showSellModal, setShowSellModal] = useState(false);
    const [selectedItemForSell, setSelectedItemForSell] = useState(null);
    const [showSoldHistoryModal, setShowSoldHistoryModal] = useState(false);
    const [selectedItemForSoldHistory, setSelectedItemForSoldHistory] = useState(null);

    const [showEditSoldModal, setShowEditSoldModal] = useState(false);
    const [selectedSoldRecordForEdit, setSelectedSoldRecordForEdit] = useState(null);

    const [loadingHistory, setLoadingHistory] = useState(false);
    const { success, error } = useToast();

    function handleEdit(item) {
        setFormData(item);
        setShowAddStockForm(true);
        setIsEdit(true);
    }

    async function handleDelete(id) {
        try {
            await stockService.deleteStock(id);
            refreshData();
            success("Stock deleted successfully");
        } catch (err) {
            error(err.response?.data?.error || "Error deleting stock");
        }
    }

    function handleClone(item) {
        const clonedItem = { ...item };
        delete clonedItem.id; // Don't clone the ID
        setFormData(clonedItem);
        setIsEdit(false);
        setShowAddStockForm(true);
    }

    function handleTake(item) {
        setTakingItem(item);
        setShowTakeStockForm(true);
    }

    async function handleTakeStock(takenRecord) {
        try {
            await takenStockService.takeStock({
                stockId: takenRecord.stockId,
                takenQuantity: takenRecord.takenQuantity,
                dateTaken: takenRecord.dateTaken,
                takenBy: takenRecord.takenBy
            });
            setShowTakeStockForm(false);
            refreshData();
            success("Stock processed successfully");
        } catch (err) {
            error(err.response?.data?.error || "Error taking stock");
        }
    }

    async function handleViewTakenHistory(item) {
        setSelectedItemForHistory(item);
        try {
            const response = await takenStockService.getTakenStocksByStockId(item.id);
            setTakenStockRecords(response.data || []);
            setShowHistoryModal(true);
        } catch (err) {
            error("Error fetching history");
        } finally {
            setLoadingHistory(false);
        }
    }

    async function handleEmpty(item) {
        setSelectedItemForEmpty(item);
        try {
            const response = await takenStockService.getTakenStocksByStockId(item.id);
            setTakenStockRecords(response.data || []);
            setShowEmptyModal(true);
        } catch (err) {
            error("Error fetching taken stocks");
        }
    }

    async function handleViewEmptyHistory(item) {
        setSelectedItemForEmptyHistory(item);
        try {
            const response = await emptyStockService.getEmptyStocksByStockId(item.id);
            setEmptyStockRecords(response.data || []);
            setShowEmptyHistoryModal(true);
        } catch (err) {
            error("Error fetching empty history");
        }
    }

    function handleEmptyRecord(record) {
        setSelectedRecordForEmpty(record);
        setShowEmptyFormModal(true);
    }

    async function handleSaveEmptyRecord(emptyData) {
        try {
            await emptyStockService.emptyStock({
                stockId: emptyData.stockId,
                takenStockId: emptyData.id,
                emptyQuantity: emptyData.emptyQuantity,
                emptyDate: emptyData.emptyDate,
                reason: emptyData.reason
            });
            setShowEmptyFormModal(false);
            setShowEmptyModal(false);
            refreshData();
            success("Empty stock recorded");
        } catch (err) {
            error(err.response?.data?.error || "Error recording empty stock");
        }
    }

    function handleSell(item) {
        setSelectedItemForSell(item);
        setShowSellModal(true);
    }

    async function handleSaveSell(soldRecord) {
        try {
            if (soldRecord.id) {
                await soldStockService.updateSoldStock(soldRecord.id, {
                    stockId: soldRecord.stockId,
                    customerName: soldRecord.customerName,
                    mobileNumber: soldRecord.mobileNumber,
                    quantity: soldRecord.quantity,
                    sellingPrice: soldRecord.sellingPrice,
                    dateSold: soldRecord.dateSold
                });
                setShowEditSoldModal(false);
                // Refresh history if it's open
                if (selectedItemForSoldHistory) {
                    handleViewSoldHistory(selectedItemForSoldHistory);
                }
            } else {
                await soldStockService.sellStock({
                    stockId: soldRecord.stockId,
                    customerName: soldRecord.customerName,
                    mobileNumber: soldRecord.mobileNumber,
                    quantity: soldRecord.quantity,
                    sellingPrice: soldRecord.sellingPrice,
                    dateSold: soldRecord.dateSold
                });
                setShowSellModal(false);
            }
            refreshData();
            success("Sale recorded successfully");
        } catch (err) {
            error(err.response?.data?.error || "Error saving sale");
        }
    }

    async function handleDeleteSoldStock(id) {
        // Confirmation is handled in SoldStockHistory component
        try {
            await soldStockService.deleteSoldStock(id);
            refreshData();
            // Refresh history if it's open
            if (selectedItemForSoldHistory) {
                handleViewSoldHistory(selectedItemForSoldHistory);
            }
            success("Sale deleted");
        } catch (err) {
            error(err.response?.data?.error || "Error deleting sale");
        }
    }

    function handleEditSoldStock(record) {
        setSelectedSoldRecordForEdit(record);
        setShowEditSoldModal(true);
    }

    async function handleViewSoldHistory(item) {
        setSelectedItemForSoldHistory(item);
        try {
            const response = await soldStockService.getSoldStocksByStockId(item.id);
            setSoldStockRecords(response.data || []);
            setShowSoldHistoryModal(true);
        } catch (err) {
            error("Error fetching sales history");
        }
    }

    // Handlers for Taken Stock Edit/Delete
    function handleEditTaken(record) {
        setSelectedTakenRecordForEdit(record);
        setShowEditTakenModal(true);
    }

    async function handleDeleteTaken(id) {
        try {
            await takenStockService.deleteTakenStock(id);
            // Refresh history
            if (selectedItemForHistory) {
                const response = await takenStockService.getTakenStocksByStockId(selectedItemForHistory.id);
                setTakenStockRecords(response.data || []);
            }
            refreshData();
            success("Record deleted");
        } catch (err) {
            error(err.response?.data?.error || "Error deleting record");
        }
    }

    async function handleSaveTakenEdit(updatedRecord) {
        try {
            await takenStockService.updateTakenStock(updatedRecord.id, updatedRecord);
            setShowEditTakenModal(false);
            // Refresh history
            if (selectedItemForHistory) {
                const response = await takenStockService.getTakenStocksByStockId(selectedItemForHistory.id);
                setTakenStockRecords(response.data || []);
            }
            refreshData();
            success("Record updated");
        } catch (err) {
            error(err.response?.data?.error || "Error updating record");
        }
    }

    // Handlers for Empty Stock Edit/Delete
    function handleEditEmpty(record) {
        setSelectedEmptyRecordForEdit(record);
        setShowEditEmptyModal(true);
    }

    async function handleDeleteEmpty(id) {
        try {
            await emptyStockService.deleteEmptyStock(id);
            // Refresh history
            if (selectedItemForEmptyHistory) {
                const response = await emptyStockService.getEmptyStocksByStockId(selectedItemForEmptyHistory.id);
                setEmptyStockRecords(response.data || []);
            }
            refreshData();
            success("Record deleted");
        } catch (err) {
            error(err.response?.data?.error || "Error deleting record");
        }
    }

    async function handleSaveEmptyEdit(updatedRecord) {
        try {
            await emptyStockService.updateEmptyStock(updatedRecord.id, updatedRecord);
            setShowEditEmptyModal(false);
            // Refresh history
            if (selectedItemForEmptyHistory) {
                const response = await emptyStockService.getEmptyStocksByStockId(selectedItemForEmptyHistory.id);
                setEmptyStockRecords(response.data || []);
            }
            refreshData();
            success("Record updated");
        } catch (err) {
            error(err.response?.data?.error || "Error updating record");
        }
    }

    return (
        <div className="table-container">

            {takingItem && (
                <Modal
                    isOpen={showTakeStockForm}
                    onClose={() => setShowTakeStockForm(false)}
                    title={'Take Stock'}
                >
                    <TakeStock
                        stock={takingItem}
                        onTakeStock={handleTakeStock}
                        onCancel={() => setShowTakeStockForm(false)}
                    />
                </Modal>
            )}

            {selectedItemForHistory && (
                <Modal
                    isOpen={showHistoryModal}
                    onClose={() => setShowHistoryModal(false)}
                    title={`Taken History - ${selectedItemForHistory?.product}`}
                    size="large"
                >
                    <TakenStockHistory
                        takenRecords={takenStockRecords}
                        productName={selectedItemForHistory?.product}
                        onEdit={handleEditTaken}
                        onDelete={handleDeleteTaken}
                    />
                </Modal>
            )}

            {showEditTakenModal && selectedTakenRecordForEdit && (
                <Modal
                    isOpen={showEditTakenModal}
                    onClose={() => setShowEditTakenModal(false)}
                    title="Edit Taken Stock"
                >
                    <EditTakenStockForm
                        record={selectedTakenRecordForEdit}
                        stock={selectedItemForHistory}
                        onSave={handleSaveTakenEdit}
                        onCancel={() => setShowEditTakenModal(false)}
                    />
                </Modal>
            )}

            {selectedItemForEmpty && (
                <Modal
                    isOpen={showEmptyModal}
                    onClose={() => setShowEmptyModal(false)}
                    title={'Empty Taken Stock - ' + selectedItemForEmpty.product}
                    size="large"
                >
                    <EmptyStockList
                        takenRecords={takenStockRecords}
                        productName={selectedItemForEmpty.product}
                        onEmptyRecord={handleEmptyRecord}
                    />
                </Modal>
            )}

            {selectedRecordForEmpty && (
                <Modal
                    isOpen={showEmptyFormModal}
                    onClose={() => {
                        setShowEmptyFormModal(false);
                        setSelectedRecordForEmpty(null);
                    }}
                    title={'Empty Stock - ' + selectedRecordForEmpty.product}
                >
                    <EmptyStockForm
                        record={selectedRecordForEmpty}
                        productName={selectedRecordForEmpty.product}
                        onSave={handleSaveEmptyRecord}
                        onCancel={() => {
                            setShowEmptyFormModal(false);
                            setSelectedRecordForEmpty(null);
                        }}
                    />
                </Modal>
            )}

            {selectedItemForEmptyHistory && (
                <Modal
                    isOpen={showEmptyHistoryModal}
                    onClose={() => setShowEmptyHistoryModal(false)}
                    title={`Empty History - ${selectedItemForEmptyHistory?.product}`}
                    size="large"
                >
                    <EmptyStockHistory
                        emptyRecords={emptyStockRecords}
                        productName={selectedItemForEmptyHistory?.product}
                        onEdit={handleEditEmpty}
                        onDelete={handleDeleteEmpty}
                    />
                </Modal>
            )}

            {showEditEmptyModal && selectedEmptyRecordForEdit && (
                <Modal
                    isOpen={showEditEmptyModal}
                    onClose={() => setShowEditEmptyModal(false)}
                    title="Edit Empty Stock"
                >
                    <EditEmptyStockForm
                        record={selectedEmptyRecordForEdit}
                        productName={selectedItemForEmptyHistory?.product}
                        onSave={handleSaveEmptyEdit}
                        onCancel={() => setShowEditEmptyModal(false)}
                    />
                </Modal>
            )}

            {selectedItemForSell && (
                <Modal
                    isOpen={showSellModal}
                    onClose={() => setShowSellModal(false)}
                    title={'Sell Stock - ' + selectedItemForSell.product}
                >
                    <SellStock
                        stock={selectedItemForSell}
                        onSellStock={handleSaveSell}
                        onCancel={() => setShowSellModal(false)}
                    />
                </Modal>
            )}

            {selectedItemForSoldHistory && (
                <Modal
                    isOpen={showSoldHistoryModal}
                    onClose={() => setShowSoldHistoryModal(false)}
                    title={'Sales History - ' + selectedItemForSoldHistory.product}
                    size="large"
                >
                    <SoldStockHistory
                        soldRecords={soldStockRecords}
                        productName={selectedItemForSoldHistory.product}
                        onEdit={handleEditSoldStock}
                        onDelete={handleDeleteSoldStock}
                    />
                </Modal>
            )}

            {showEditSoldModal && selectedSoldRecordForEdit && selectedItemForSoldHistory && (
                <Modal
                    isOpen={showEditSoldModal}
                    onClose={() => setShowEditSoldModal(false)}
                    title={'Edit Sale - ' + selectedItemForSoldHistory.product}
                >
                    <SellStock
                        stock={selectedItemForSoldHistory}
                        initialData={selectedSoldRecordForEdit}
                        onSellStock={handleSaveSell}
                        onCancel={() => setShowEditSoldModal(false)}
                    />
                </Modal>
            )}

            <table className="stock-table">
                <thead>
                    <tr>
                        <th className="col-compact text-center">S.No</th>
                        <th className="text-left-align col-product">Product</th>
                        <th className="text-left-align col-batch">Batch No</th>
                        <th className="col-compact text-right">Total Qty</th>
                        <th className="col-compact text-right">Available Qty</th>
                        {location?.type === 'RETAIL' ? (
                            <th className="col-compact text-right">Sold Qty</th>
                        ) : (
                            <>
                                <th className="col-compact text-right">Taken Qty</th>
                                <th className="col-compact text-right">Empty Qty</th>
                            </>
                        )}
                        <th className="col-compact">Exp Date</th>
                        <th className="col-actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {!stockData || stockData.length === 0 ? (
                        <tr>
                            <td colSpan="11">
                                <EmptyState
                                    title="No stocks found"
                                    message="Add your first stock item to get started."
                                    action={
                                        <button
                                            className="btn-primary"
                                            onClick={() => {
                                                setFormData(null);
                                                setIsEdit(false);
                                                setShowAddStockForm(true);
                                            }}
                                        >
                                            Add Stock
                                        </button>
                                    }
                                />
                            </td>
                        </tr>
                    ) : (
                        (stockData || []).map(
                            (item, index) => (
                                <StockItems
                                    key={item.id}
                                    index={index + 1}
                                    item={item}
                                    onEdit={handleEdit}
                                    onDelete={() => handleDelete(item.id)}
                                    onClone={handleClone}
                                    onTake={handleTake}
                                    onViewTakenHistory={handleViewTakenHistory}
                                    onViewEmptyHistory={handleViewEmptyHistory}
                                    onEmpty={handleEmpty}
                                    onSell={handleSell}
                                    onViewSoldHistory={handleViewSoldHistory}
                                    location={location}
                                />
                            )
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}
