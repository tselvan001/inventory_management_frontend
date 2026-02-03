import React, { useEffect } from 'react';
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle, IoClose } from 'react-icons/io5';

export function Toast({ toast, onClose }) {
    const { id, type, message, duration = 3000 } = toast;

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const icons = {
        success: <IoCheckmarkCircle size={20} />,
        error: <IoCloseCircle size={20} />,
        info: <IoInformationCircle size={20} />
    };

    const styles = {
        base: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: 'white',
            minWidth: '300px',
            maxWidth: '450px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            animation: 'slideIn 0.3s ease-out forwards',
            marginBottom: '10px',
            zIndex: 9999
        },
        success: { background: '#10B981', borderLeft: '4px solid #047857' },
        error: { background: '#EF4444', borderLeft: '4px solid #B91C1C' },
        info: { background: '#3B82F6', borderLeft: '4px solid #1D4ED8' }
    };

    return (
        <div style={{ ...styles.base, ...styles[type] }}>
            <div style={{ flexShrink: 0 }}>{icons[type]}</div>
            <div style={{ flex: 1, fontSize: '14px', fontWeight: '500' }}>{message}</div>
            <button
                onClick={() => onClose(id)}
                style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
            >
                <IoClose size={18} />
            </button>
            <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
