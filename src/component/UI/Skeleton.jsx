import React from 'react';

export function Skeleton({ width, height, className = '', style = {} }) {
    const skeletonStyle = {
        width: width || '100%',
        height: height || '20px',
        backgroundColor: 'var(--color-border, #374151)',
        borderRadius: '4px',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        ...style
    };

    return (
        <div className={`skeleton ${className}`} style={skeletonStyle}>
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
            `}</style>
        </div>
    );
}
