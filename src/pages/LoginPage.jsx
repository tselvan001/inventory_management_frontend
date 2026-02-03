import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import './LoginPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                username,
                password
            });

            if (response.data.token) {
                login(response.data);
                navigate(from, { replace: true });
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.error || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-background-glow"></div>
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-icon">TS</div>
                    <h1>TASA STOCKS</h1>
                    <p>Inventory Management System</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="login-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-wrapper">
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter username"
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter password"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? (
                            <span className="loader-container">
                                <span className="loader"></span>
                                Logging in...
                            </span>
                        ) : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
