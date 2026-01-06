import React, { forwardRef } from 'react';
import './Input.css';

export const Input = forwardRef(({
    label,
    type = 'text',
    name,
    placeholder,
    error,
    required = false,
    className = '',
    ...props
}, ref) => {
    return (
        <div className={`input-group ${className} ${error ? 'has-error' : ''}`}>
            {label && (
                <label className="input-label" htmlFor={name}>
                    {label} {required && <span className="required">*</span>}
                </label>
            )}
            {type === 'textarea' ? (
                <textarea
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    className="input-field"
                    required={required}
                    ref={ref}
                    {...props}
                />
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    className="input-field"
                    required={required}
                    ref={ref}
                    {...props}
                />
            )}
            {error && <span className="error-message">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';
