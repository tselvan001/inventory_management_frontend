// Mock data for taken stock records
export const TAKEN_STOCK_RECORDS = [
    {
        id: 1,
        stockNo: 1,
        product: 'Sugar',
        takenQuantity: 5,
        dateTaken: '2025-12-10',
        takenBy: 'Admin'
    },
    {
        id: 2,
        stockNo: 1,
        product: 'Sugar',
        takenQuantity: 5,
        dateTaken: '2025-12-12',
        takenBy: 'Admin'
    },
    {
        id: 3,
        stockNo: 2,
        product: 'Coffee',
        takenQuantity: 3,
        dateTaken: '2025-12-11',
        takenBy: 'Admin'
    },
    {
        id: 4,
        stockNo: 2,
        product: 'Coffee',
        takenQuantity: 2,
        dateTaken: '2025-12-13',
        takenBy: 'Admin'
    }
];

// Mock data for empty stock records
export const EMPTY_STOCK_RECORDS = [
    {
        id: 1,
        stockNo: 1,
        product: 'Sugar',
        takenRecordId: 1,
        dateTaken: '2025-12-10',
        emptyQuantity: 3,
        emptyDate: '2025-12-14',
        reason: 'Damaged during storage'
    },
    {
        id: 2,
        stockNo: 1,
        product: 'Sugar',
        takenRecordId: 2,
        dateTaken: '2025-12-12',
        emptyQuantity: 2,
        emptyDate: '2025-12-15',
        reason: 'Expired'
    },
    {
        id: 3,
        stockNo: 2,
        product: 'Coffee',
        takenRecordId: 3,
        dateTaken: '2025-12-11',
        emptyQuantity: 1,
        emptyDate: '2025-12-14',
        reason: 'Spilled'
    },
    {
        id: 4,
        stockNo: 2,
        product: 'Coffee',
        takenRecordId: 4,
        dateTaken: '2025-12-13',
        emptyQuantity: 2,
        emptyDate: '2025-12-15',
        reason: 'Quality issue'
    }
];

// Mock data for sold stock records
export const SOLD_STOCK_RECORDS = [];
