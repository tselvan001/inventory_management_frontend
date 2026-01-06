import React from 'react';
import './Alert.css';

export function Alert({ message, type = 'info', onClose, className = '' }) {
    if (!message) return null;

    return (
        <div className={`alert alert-${type} ${className}`} role="alert">
            <span className="alert-message">{message}</span>
            {onClose && (
                <button type="button" className="alert-close" onClick={onClose} aria-label="Close">
                    &times;
                </button>
            )}
        </div>
    );
}
