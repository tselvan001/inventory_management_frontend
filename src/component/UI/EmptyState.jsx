import React from 'react';
import { IoCubeOutline } from 'react-icons/io5';

export function EmptyState({ title = "No items found", message = "Get started by adding some items.", action }) {
    const style = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        color: 'var(--color-text-secondary, #9ca3af)',
        textAlign: 'center'
    };

    return (
        <div style={style}>
            <div style={{
                background: 'rgba(55, 65, 81, 0.5)',
                padding: '20px',
                borderRadius: '50%',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <IoCubeOutline size={48} color="var(--color-primary, #6366f1)" />
            </div>
            <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--color-text-main, #f3f4f6)',
                marginBottom: '8px'
            }}>{title}</h3>
            <p style={{ marginBottom: action ? '24px' : '0', maxWidth: '300px' }}>{message}</p>
            {action}
        </div>
    );
}
