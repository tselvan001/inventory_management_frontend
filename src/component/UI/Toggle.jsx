import React from 'react';

export function Toggle({ label, checked, onChange, disabled = false }) {
    return (
        <label className="toggle-container" style={{
            display: 'flex',
            alignItems: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            gap: '12px',
            opacity: disabled ? 0.6 : 1
        }}>
            <div className={`toggle-switch ${checked ? 'checked' : ''}`} style={{
                position: 'relative',
                width: '44px',
                height: '24px',
                background: checked ? 'var(--color-primary, #6366f1)' : 'var(--color-input-bg, #374151)',
                borderRadius: '9999px',
                transition: 'all 0.2s ease',
                flexShrink: 0
            }}>
                <div style={{
                    position: 'absolute',
                    top: '2px',
                    left: checked ? '22px' : '2px',
                    width: '20px',
                    height: '20px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} />
            </div>
            {label && <span style={{
                color: 'var(--color-text-main, #f3f4f6)',
                fontWeight: '500',
                fontSize: '0.95rem'
            }}>{label}</span>}

            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                style={{ display: 'none' }}
            />
        </label>
    );
}
