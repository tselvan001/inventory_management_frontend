import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoChevronForward } from 'react-icons/io5';

export function Breadcrumb({ items }) {
    return (
        <nav aria-label="Breadcrumb">
            <ol style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                listStyle: 'none',
                padding: 0,
                margin: '0 0 16px 0',
                fontSize: '0.875rem'
            }}>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {index > 0 && <IoChevronForward color="var(--color-text-muted, #6b7280)" />}

                            {isLast ? (
                                <span style={{
                                    color: 'var(--color-text-main, #f3f4f6)',
                                    fontWeight: '600'
                                }}>
                                    {item.label}
                                </span>
                            ) : (
                                <NavLink
                                    to={item.to}
                                    style={{
                                        color: 'var(--color-text-secondary, #9ca3af)',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.target.style.color = 'var(--color-primary, #6366f1)'}
                                    onMouseOut={(e) => e.target.style.color = 'var(--color-text-secondary, #9ca3af)'}
                                >
                                    {item.label}
                                </NavLink>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
