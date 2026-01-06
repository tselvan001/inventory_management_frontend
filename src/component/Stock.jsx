import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "./UI/Button";
import { Input } from "./UI/Input";
import './Stock.css';

const schema = yup.object().shape({
    product: yup.string().required("Product name is required"),
    quantityInStock: yup.number()
        .typeError("Must be a number")
        .min(0, "Cannot be negative")
        .required("Required"),
    manufacturingDate: yup.string(),
    expiryDate: yup.string(),
    mrpPerUnit: yup.number()
        .typeError("Must be a number")
        .min(0, "Cannot be negative")
        .required("Required"),
    purchasePricePerUnit: yup.number()
        .typeError("Must be a number")
        .min(0, "Cannot be negative")
        .required("Required"),
});

export function Stock({ location, onSave, onClose, stock, onEdit, isEdit }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: stock || {
            product: '',
            quantityInStock: '',
            manufacturingDate: '',
            expiryDate: '',
            mrpPerUnit: '',
            purchasePricePerUnit: ''
        }
    });

    useEffect(() => {
        if (stock) {
            reset(stock);
        }
    }, [stock, reset]);

    const onSubmit = (data) => {
        const processedData = {
            ...data,
            quantityInStock: Number(data.quantityInStock),
            mrpPerUnit: Number(data.mrpPerUnit),
            purchasePricePerUnit: Number(data.purchasePricePerUnit)
        };

        if (isEdit) {
            onEdit(processedData);
        } else {
            onSave(processedData);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="stock-form">
            <Input
                label="Product Name"
                placeholder="e.g. Shampoo"
                {...register("product")}
                error={errors.product?.message}
                required
            />

            <Input
                label="Quantity In Stock"
                type="number"
                placeholder="0"
                {...register("quantityInStock")}
                error={errors.quantityInStock?.message}
                required
            />

            <Input
                label="Manufacturing Date"
                type="date"
                {...register("manufacturingDate")}
                error={errors.manufacturingDate?.message}
            />

            <Input
                label="Expiry Date"
                type="date"
                {...register("expiryDate")}
                error={errors.expiryDate?.message}
            />

            <Input
                label="MRP per Unit"
                type="number"
                placeholder="0.00"
                {...register("mrpPerUnit")}
                error={errors.mrpPerUnit?.message}
                required
            />

            <Input
                label="Purchase Price per Unit"
                type="number"
                placeholder="0.00"
                {...register("purchasePricePerUnit")}
                error={errors.purchasePricePerUnit?.message}
                required
            />

            <div className="form-actions">
                <Button
                    name="Cancel"
                    variant="secondary"
                    onClick={onClose}
                />
                <Button
                    type="submit"
                    name={isEdit ? "Update Stock" : "Save Stock"}
                    variant="primary"
                />
            </div>
        </form>
    );
}