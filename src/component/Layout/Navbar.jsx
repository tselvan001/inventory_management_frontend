import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="logo">TASA STOCKS</Link>
                <div className="nav-links">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>

                </div>
            </div>
        </nav>
    );
}
