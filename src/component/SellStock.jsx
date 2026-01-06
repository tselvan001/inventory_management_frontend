import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from './UI/Button';
import { Input } from './UI/Input';
import './Stock.css';

const schema = yup.object().shape({
    mobileNumber: yup.string()
        .matches(/^\d{10}$/, "Mobile number must be 10 digits")
        .required("Required"),
    customerName: yup.string().required("Required"),
    quantity: yup.number()
        .typeError("Must be a number")
        .min(1, "At least 1")
        .required("Required"),
    sellingPrice: yup.number()
        .typeError("Must be a number")
        .min(0, "Cannot be negative")
        .required("Required"),
    dateSold: yup.string().required("Required")
});

export function SellStock({ stock, onSellStock, onCancel }) {
    const today = new Date().toISOString().split('T')[0];

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            mobileNumber: '',
            customerName: '',
            quantity: 1,
            sellingPrice: stock.mrpPerUnit || 0,
            dateSold: today
        }
    });

    const quantity = watch("quantity");
    const sellingPrice = watch("sellingPrice");
    const totalAmount = (Number(quantity) || 0) * (Number(sellingPrice) || 0);

    useEffect(() => {
        if (stock) {
            reset({
                mobileNumber: '',
                customerName: '',
                quantity: 1,
                sellingPrice: stock.mrpPerUnit || 0,
                dateSold: today
            });
        }
    }, [stock, reset, today]);

    const onSubmit = (data) => {
        if (data.quantity > stock.quantityInStock) {
            alert('Insufficient stock!');
            return;
        }

        const sellData = {
            ...data,
            totalAmount: totalAmount,
            stockId: stock.id,
            product: stock.product
        };
        onSellStock(sellData);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="stock-form">
            <div className="stock-summary-card">
                <div className="summary-item">
                    <span className="summary-label">Product Name</span>
                    <span className="summary-value highlight">{stock.product}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Quantity Available</span>
                    <span className="summary-value">{stock.quantityInStock}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">MRP</span>
                    <span className="summary-value">₹{stock.mrpPerUnit}</span>
                </div>
            </div>

            <Input
                label="Mobile Number"
                type="tel"
                placeholder="Enter 10 digit number"
                {...register("mobileNumber")}
                error={errors.mobileNumber?.message}
                required
            />

            <Input
                label="Customer Name"
                type="text"
                placeholder="Enter name"
                {...register("customerName")}
                error={errors.customerName?.message}
                required
            />

            <div className="form-row">
                <Input
                    label="Quantity"
                    type="number"
                    {...register("quantity")}
                    error={errors.quantity?.message}
                    min="1"
                    max={stock.quantityInStock}
                    required
                />
                <Input
                    label="Selling Price"
                    type="number"
                    {...register("sellingPrice")}
                    error={errors.sellingPrice?.message}
                    min="0"
                    step="0.01"
                    required
                />
            </div>

            <div className="total-amount-display">
                <span className="label">Total Amount:</span>
                <span className="value">₹{totalAmount.toFixed(2)}</span>
            </div>

            <div className="form-actions">
                <Button type="submit" name="Confirm Sale" variant="primary" />
                <Button type="button" name="Cancel" variant="secondary" onClick={onCancel} />
            </div>
        </form>
    );
}
