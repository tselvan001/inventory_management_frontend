import React from 'react';
import './Card.css';

export function Card({ title, children, className = '', onClick }) {
    return (
        <div className={`card ${className}`} onClick={onClick}>
            {title && <h3 className="card-title">{title}</h3>}
            <div className="card-content">
                {children}
            </div>
        </div>
    );
}
