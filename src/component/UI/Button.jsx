import React from 'react';
import './Button.css';

export function Button({ name, onClick, variant = 'primary', className = '', type = 'button' }) {
    return (
        <button
            type={type}
            className={`btn btn-${variant} ${className}`}
            onClick={onClick}
        >
            {name}
        </button>
    );
}