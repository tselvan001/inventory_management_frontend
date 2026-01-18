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
import { stockService, takenStockService, emptyStockService, soldStockService } from "../services/api.js";
import './StockTable.css';

export function StockTable({ stockData, setStockData, refreshData, setShowAddStockForm, setFormData, setIsEdit, location }) {
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

    // Sell Stock States
    const [showSellModal, setShowSellModal] = useState(false);
    const [selectedItemForSell, setSelectedItemForSell] = useState(null);
    const [showSoldHistoryModal, setShowSoldHistoryModal] = useState(false);
    const [selectedItemForSoldHistory, setSelectedItemForSoldHistory] = useState(null);

    const [loadingHistory, setLoadingHistory] = useState(false);

    function handleEdit(item) {
        setFormData(item);
        setShowAddStockForm(true);
        setIsEdit(true);
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this stock?")) return;
        try {
            await stockService.deleteStock(id);
            refreshData();
        } catch (err) {
            alert(err.response?.data?.error || "Error deleting stock");
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
        } catch (err) {
            alert(err.response?.data?.error || "Error taking stock");
        }
    }

    async function handleViewTakenHistory(item) {
        setSelectedItemForHistory(item);
        setLoadingHistory(true);
        try {
            const response = await takenStockService.getTakenStocksByStockId(item.id);
            setTakenStockRecords(response.data || []);
            setShowHistoryModal(true);
        } catch (err) {
            alert("Error fetching history");
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
            alert("Error fetching taken stocks");
        }
    }

    async function handleViewEmptyHistory(item) {
        setSelectedItemForEmptyHistory(item);
        try {
            const response = await emptyStockService.getEmptyStocksByStockId(item.id);
            setEmptyStockRecords(response.data || []);
            setShowEmptyHistoryModal(true);
        } catch (err) {
            alert("Error fetching empty history");
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
        } catch (err) {
            alert(err.response?.data?.error || "Error recording empty stock");
        }
    }

    function handleSell(item) {
        setSelectedItemForSell(item);
        setShowSellModal(true);
    }

    async function handleSaveSell(soldRecord) {
        try {
            await soldStockService.sellStock({
                stockId: soldRecord.stockId,
                customerName: soldRecord.customerName,
                mobileNumber: soldRecord.mobileNumber,
                quantity: soldRecord.quantity,
                sellingPrice: soldRecord.sellingPrice
            });
            setShowSellModal(false);
            refreshData();
        } catch (err) {
            alert(err.response?.data?.error || "Error selling stock");
        }
    }

    async function handleViewSoldHistory(item) {
        setSelectedItemForSoldHistory(item);
        try {
            const response = await soldStockService.getSoldStocksByStockId(item.id);
            setSoldStockRecords(response.data || []);
            setShowSoldHistoryModal(true);
        } catch (err) {
            alert("Error fetching sales history");
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
                    title={'Taken Stock History - ' + selectedItemForHistory.product}
                    size="large"
                >
                    <TakenStockHistory
                        takenRecords={takenStockRecords}
                        productName={selectedItemForHistory.product}
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
                    title={'Empty Stock History - ' + selectedItemForEmptyHistory.product}
                    size="large"
                >
                    <EmptyStockHistory
                        emptyRecords={emptyStockRecords}
                        productName={selectedItemForEmptyHistory.product}
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
                    />
                </Modal>
            )}

            <table className="stock-table">
                <thead>
                    <tr>
                        <th className="col-compact">S.No</th>
                        <th className="text-left-align col-product">Product</th>
                        <th className="text-left-align col-batch">Batch No</th>
                        <th className="col-compact">Stock Qty</th>
                        {location === 'retail' ? (
                            <th className="col-compact">Sold Qty</th>
                        ) : (
                            <>
                                <th className="col-compact">Taken Qty</th>
                                <th className="col-compact">Empty Qty</th>
                            </>
                        )}
                        <th className="col-compact">Exp Date</th>
                        <th className="col-actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {!stockData || stockData.length === 0 ? (
                        <tr>
                            <td colSpan="11" style={{ textAlign: 'center', padding: '2rem' }}>No items found. Add some stock!</td>
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
