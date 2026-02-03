import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SellStock } from './SellStock';
import React from 'react';

describe('SellStock', () => {
    const mockStock = {
        id: 1,
        product: 'Shampoo1',
        mrpPerUnit: 100,
        expiryDate: '2026-03-14',
        quantityInStock: 10
    };

    const mockOnSellStock = vi.fn();
    const mockOnCancel = vi.fn();

    it('renders summary card with Current Qty, New Qty, and Total Amount', () => {
        render(<SellStock stock={mockStock} onSellStock={mockOnSellStock} onCancel={mockOnCancel} />);

        expect(screen.getByText('Current Qty')).toBeInTheDocument();
        expect(screen.getByText('New Qty')).toBeInTheDocument();
        expect(screen.getByText('Total Amount')).toBeInTheDocument();

        // Initial Current Qty should be 10
        expect(screen.getByText('10')).toBeInTheDocument();

        // Initial New Qty (after selling default 1) should be 9
        // 9 is the highlight value
        const newQtyValue = screen.getByText('9');
        expect(newQtyValue).toHaveClass('highlight');

        // Initial Total Amount (1 * 100) should be ₹100
        expect(screen.getByText('₹100')).toBeInTheDocument();
    });

    it('renders Date field at the top and defaults to today', () => {
        render(<SellStock stock={mockStock} onSellStock={mockOnSellStock} onCancel={mockOnCancel} />);

        const dateInput = screen.getByLabelText('Date');
        expect(dateInput).toBeInTheDocument();

        const today = new Date().toISOString().split('T')[0];
        expect(dateInput.value).toBe(today);
    });

    it('updates New Qty highlight value when quantity changes', () => {
        render(<SellStock stock={mockStock} onSellStock={mockOnSellStock} onCancel={mockOnCancel} />);

        const qtyInput = screen.getByLabelText('Quantity');
        fireEvent.change(qtyInput, { target: { value: '5' } });

        // available (10) - quantity (5) = 5
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('submits form with custom date and all details', () => {
        render(<SellStock stock={mockStock} onSellStock={mockOnSellStock} onCancel={mockOnCancel} />);

        fireEvent.change(screen.getByPlaceholderText('Enter mobile number'), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByPlaceholderText('Enter customer name'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2026-01-01' } });
        fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '2' } });

        fireEvent.click(screen.getByText('Sell'));

        expect(mockOnSellStock).toHaveBeenCalledWith(expect.objectContaining({
            customerName: 'Test User',
            mobileNumber: '1234567890',
            quantity: 2,
            dateSold: '2026-01-01'
        }));
    });

    it('renders in Edit mode and pre-populates initialData', () => {
        const initialData = {
            id: 101,
            customerName: 'Existing Customer',
            mobileNumber: '9988776655',
            quantity: 3,
            sellingPrice: 120,
            dateSold: '2026-02-01'
        };

        render(<SellStock stock={mockStock} initialData={initialData} onSellStock={mockOnSellStock} onCancel={mockOnCancel} />);

        expect(screen.getByLabelText('Date').value).toBe('2026-02-01');
        expect(screen.getByLabelText('Customer Name').value).toBe('Existing Customer');
        expect(screen.getByLabelText('Mobile Number').value).toBe('9988776655');
        expect(screen.getByLabelText('Quantity').value).toBe('3');
        expect(screen.getByLabelText('Selling Price').value).toBe('120');

        // Verify summary card values in Edit mode
        // available = currentStock (10) + initialData.quantity (3) = 13
        expect(screen.getByText('13')).toBeInTheDocument(); // Current Qty

        // available (13) - current quantity (3) = 10
        expect(screen.getByText('10')).toBeInTheDocument(); // New Qty (if no change)
    });

    it('submits updated data in Edit mode', () => {
        const initialData = {
            id: 101,
            customerName: 'Existing Customer',
            mobileNumber: '9988776655',
            quantity: 3,
            sellingPrice: 120,
            dateSold: '2026-02-01'
        };

        render(<SellStock stock={mockStock} initialData={initialData} onSellStock={mockOnSellStock} onCancel={mockOnCancel} />);

        fireEvent.change(screen.getByLabelText('Customer Name'), { target: { value: 'Updated Customer' } });
        fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2026-02-03' } });

        fireEvent.click(screen.getByText('Update'));

        expect(mockOnSellStock).toHaveBeenCalledWith(expect.objectContaining({
            id: 101,
            customerName: 'Updated Customer',
            dateSold: '2026-02-03'
        }));
    });

    it('shows alert if selling price is zero on submit', () => {
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });
        render(<SellStock stock={mockStock} onSellStock={mockOnSellStock} onCancel={mockOnCancel} />);

        // Set price to 0
        fireEvent.change(screen.getByLabelText('Selling Price'), { target: { value: '0' } });
        fireEvent.click(screen.getByText('Sell'));

        expect(alertMock).toHaveBeenCalledWith('Selling price must be greater than zero');
        alertMock.mockRestore();
    });

    it('shows alert if date is empty on submit', () => {
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });
        render(<SellStock stock={mockStock} onSellStock={mockOnSellStock} onCancel={mockOnCancel} />);

        // Clear the date
        fireEvent.change(screen.getByLabelText('Date'), { target: { value: '' } });
        fireEvent.click(screen.getByText('Sell'));

        expect(alertMock).toHaveBeenCalledWith('Please select a sale date');
        alertMock.mockRestore();
    });

    it('shows alert if selling price is empty on submit', () => {
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });
        render(<SellStock stock={mockStock} onSellStock={mockOnSellStock} onCancel={mockOnCancel} />);

        // Clear the selling price
        fireEvent.change(screen.getByLabelText('Selling Price'), { target: { value: '' } });
        fireEvent.click(screen.getByText('Sell'));

        expect(alertMock).toHaveBeenCalledWith('Please enter a selling price');
        alertMock.mockRestore();
    });

    it('limits mobile number to 10 digits and numeric characters only', () => {
        render(<SellStock stock={mockStock} onSellStock={mockOnSellStock} onCancel={mockOnCancel} />);

        const mobileInput = screen.getByLabelText('Mobile Number');

        // Try typing non-numeric characters
        fireEvent.change(mobileInput, { target: { value: '123abc456' } });
        expect(mobileInput.value).toBe('123456');

        // Try typing more than 10 digits
        fireEvent.change(mobileInput, { target: { value: '1234567890123' } });
        expect(mobileInput.value).toBe('1234567890');
    });
});
