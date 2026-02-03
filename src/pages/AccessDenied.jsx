import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../component/Layout/Layout.css'; // Re-use layout styles if applicable, or add specific styles

export const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            textAlign: 'center',
            color: '#e74c3c'
        }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>403</h1>
            <h2 style={{ marginBottom: '1.5rem' }}>Access Denied</h2>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
                You do not have permission to view this page.
            </p>
            <button
                onClick={() => navigate('/')}
                style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                }}
            >
                Go to Home
            </button>
        </div>
    );
};
