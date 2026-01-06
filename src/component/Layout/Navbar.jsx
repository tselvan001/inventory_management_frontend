import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../UI/ThemeToggle';
import './Layout.css';

export function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">📦</span>
                    <span className="brand-text">Inventory Pro</span>
                </Link>

                <div className="navbar-actions">
                    <div className="navbar-links">
                        <Link to="/stocks" className="nav-link">Stocks</Link>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}
