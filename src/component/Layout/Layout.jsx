import React from 'react';
import { Navbar } from './Navbar';
import { useLocation } from 'react-router-dom';
import './Layout.css';

export function Layout({ children }) {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
        <div className="layout">
            {!isLoginPage && (
                <div>
                    <Navbar />
                </div>
            )}
            <main className={`main-content ${!isLoginPage ? 'container' : ''}`}>
                {children}
            </main>
        </div>
    );
}
