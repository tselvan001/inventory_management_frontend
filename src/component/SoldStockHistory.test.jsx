import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SoldStockHistory } from './SoldStockHistory';
import { AuthProvider } from '../context/AuthContext';
import React from 'react';

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        hasPermission: () => true,
    }),
}));

describe('SoldStockHistory', () => {
    const mockSoldRecords = [
        {
            id: 1,
            dateSold: '2026-02-03',
            customerName: 'Tamizh',
            mobileNumber: '7667220962',
            quantity: 1,
            sellingPrice: 100,
            totalAmount: 100,
        },
    ];

    it('renders table with stock-table class for consistent styling', () => {
        render(<SoldStockHistory soldRecords={mockSoldRecords} productName="Shampoo1" />);

        const table = screen.getByRole('table');
        expect(table).toHaveClass('stock-table');
    });

    it('contains S.No column', () => {
        render(<SoldStockHistory soldRecords={mockSoldRecords} productName="Shampoo1" />);

        expect(screen.getByText('S.No')).toBeInTheDocument();
        const cells = screen.getAllByText('1');
        const sNoCell = cells.find(cell => cell.classList.contains('col-compact'));
        expect(sNoCell).toBeInTheDocument();
    });

    it('applies text-right alignment to numeric columns', () => {
        render(<SoldStockHistory soldRecords={mockSoldRecords} productName="Shampoo1" />);

        // Check headers
        expect(screen.getByText('Qty')).toHaveClass('text-right');
        expect(screen.getByText('Price')).toHaveClass('text-right');
        expect(screen.getByText('Total')).toHaveClass('text-right');

        // Check cells
        // S.No is 1 (col-compact), Qty is 1 (text-right)
        const cells = screen.getAllByText('1');
        const sNoCell = cells.find(cell => cell.classList.contains('col-compact'));
        const qtyCell = cells.find(cell => cell.classList.contains('text-right'));

        expect(sNoCell).toBeInTheDocument();
        expect(qtyCell).toHaveClass('text-right');

        const priceCells = screen.getAllByText('100');
        expect(priceCells[0]).toHaveClass('text-right'); // Price
        expect(priceCells[1]).toHaveClass('text-right'); // Total
    });
});
