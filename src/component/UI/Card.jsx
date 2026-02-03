export function Card({ children, className = '', style = {}, ...props }) {
    const cardStyle = {
        background: 'var(--color-surface, #1f2937)',
        border: '1px solid var(--color-border, #374151)',
        borderRadius: 'var(--radius-lg, 12px)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '24px',
        ...style
    };

    return (
        <div className={`card ${className}`} style={cardStyle} {...props}>
            {children}
        </div>
    );
}
