import React from 'react';
import { Navbar } from './Navbar';
import './Layout.css';

export function Layout({ children }) {
    return (
        <div className="layout">
            <Navbar />
            <main className="main-content container">
                {children}
            </main>
        </div>
    );
}
