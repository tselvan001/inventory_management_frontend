import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TakenStockHistory } from './TakenStockHistory';
import { EmptyStockHistory } from './EmptyStockHistory';
import React from 'react';

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        hasPermission: () => true,
    }),
}));

describe('History Alignment Tests', () => {
    it('TakenStockHistory has right-aligned quantity column', () => {
        const mockRecords = [{ id: 1, dateTaken: '2026-02-03', takenQuantity: 5, takenBy: 'User' }];
        render(<TakenStockHistory takenRecords={mockRecords} productName="Test" />);

        expect(screen.getByText('Quantity Taken')).toHaveClass('text-right');
        expect(screen.getByText('5')).toHaveClass('text-right');
    });

    it('EmptyStockHistory has right-aligned quantity column', () => {
        const mockRecords = [{ id: 1, dateTaken: '2026-02-03', emptyDate: '2026-02-03', emptyQuantity: 2, reason: 'Broken' }];
        render(<EmptyStockHistory emptyRecords={mockRecords} productName="Test" />);

        expect(screen.getByText('Empty Quantity')).toHaveClass('text-right');
        expect(screen.getByText('2')).toHaveClass('text-right');
    });
});
