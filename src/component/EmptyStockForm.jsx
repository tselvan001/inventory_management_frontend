import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from './UI/Button';
import { Input } from './UI/Input';
import './Stock.css';

const schema = yup.object().shape({
    emptyDate: yup.string().required("Required"),
    emptyQuantity: yup.number()
        .typeError("Must be a number")
        .min(1, "Must be at least 1")
        .required("Required"),
    reason: yup.string().trim().required("Reason is required")
});

export function EmptyStockForm({ record, productName, onSave, onCancel }) {
    const today = new Date().toISOString().split('T')[0];

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            emptyDate: today,
            emptyQuantity: 1,
            reason: ''
        }
    });

    useEffect(() => {
        if (record) {
            reset({
                emptyDate: today,
                emptyQuantity: 1,
                reason: ''
            });
        }
    }, [record, reset, today]);

    const onSubmit = (data) => {
        if (data.emptyQuantity > record.takenQuantity) {
            alert(`Empty quantity cannot exceed taken quantity (${record.takenQuantity})`);
            return;
        }

        onSave({
            ...record,
            stockId: record.stockId,
            emptyDate: data.emptyDate,
            emptyQuantity: Number(data.emptyQuantity),
            reason: data.reason
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="stock-form">
            <div className="stock-summary-card">
                <div className="summary-item">
                    <span className="summary-label">Product Name</span>
                    <span className="summary-value highlight">{productName}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Quantity Taken</span>
                    <span className="summary-value">{record.takenQuantity}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Taken Date</span>
                    <span className="summary-value">{record.dateTaken}</span>
                </div>
            </div>

            <Input
                label="Empty Date"
                type="date"
                {...register("emptyDate")}
                error={errors.emptyDate?.message}
                required
            />

            <Input
                label="Empty Quantity"
                type="number"
                {...register("emptyQuantity")}
                error={errors.emptyQuantity?.message}
                min="1"
                max={record.takenQuantity}
                required
            />

            <Input
                label="Reason"
                type="textarea"
                {...register("reason")}
                error={errors.reason?.message}
                rows="3"
                placeholder="Enter reason for emptying..."
                required
            />

            <div className="form-actions">
                <Button type="submit" name="Save" variant="primary" />
                <Button type="button" name="Cancel" variant="secondary" onClick={onCancel} />
            </div>
        </form>
    );
}
