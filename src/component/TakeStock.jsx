import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from './UI/Button';
import { Input } from './UI/Input';
import './Stock.css';

const schema = yup.object().shape({
    takenQuantity: yup.number()
        .typeError("Must be a number")
        .min(1, "Must be at least 1")
        .required("Required"),
    dateTaken: yup.string().required("Required"),
    takenBy: yup.string().required("Required")
});

export function TakeStock({ stock, onTakeStock, onCancel }) {
    const today = new Date().toISOString().split('T')[0];

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            takenQuantity: 1,
            dateTaken: today,
            takenBy: ''
        }
    });

    useEffect(() => {
        if (stock) {
            reset({
                takenQuantity: 1,
                dateTaken: today,
                takenBy: ''
            });
        }
    }, [stock, reset, today]);

    const onSubmit = (data) => {
        if (data.takenQuantity > stock.quantityInStock) {
            alert("Cannot take more than available stock");
            return;
        }

        const takenData = {
            ...data,
            takenQuantity: Number(data.takenQuantity),
            stockId: stock.id,
            product: stock.product
        };
        onTakeStock(takenData);
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
            </div>

            <Input
                label="Quantity to Take"
                type="number"
                placeholder="0"
                {...register("takenQuantity")}
                error={errors.takenQuantity?.message}
                max={stock.quantityInStock}
                required
            />

            <Input
                label="Date Taken"
                type="date"
                {...register("dateTaken")}
                error={errors.dateTaken?.message}
                required
            />

            <Input
                label="Taken By"
                type="text"
                placeholder="Enter your name"
                {...register("takenBy")}
                error={errors.takenBy?.message}
                required
            />

            <div className="form-actions">
                <Button
                    type="button"
                    name="Cancel"
                    variant="secondary"
                    onClick={onCancel}
                />
                <Button
                    type="submit"
                    name="Confirm Take"
                    variant="primary"
                />
            </div>
        </form>
    );
}