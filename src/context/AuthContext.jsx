import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'token') {
                setToken(e.newValue);
            }
            if (e.key === 'user') {
                setUser(e.newValue ? JSON.parse(e.newValue) : null);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    const storedUser = JSON.parse(localStorage.getItem('user'));
                    setUser(storedUser);
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(userData.token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const hasPermission = (permission) => {
        if (!user || !user.permissions) return false;
        return user.permissions.includes(permission);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
