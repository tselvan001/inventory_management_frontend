import React, { useState } from 'react';
import './UserModal.css';

const UserModal = ({ user, roles, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        UserName: user?.UserName || '',
        Password: '',
        RoleID: user?.RoleID || roles[0]?.id || ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleSelect = (roleId) => {
        setFormData(prev => ({ ...prev, RoleID: roleId }));
    };

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData(prev => ({ ...prev, Password: password }));
        setShowPassword(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const selectedRole = roles.find(r => r.id.toString() === formData.RoleID.toString());
    const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="user-modal redesigned">
                <div className="modal-sidebar">
                    <div className="preview-card">
                        <div className="preview-avatar">
                            {getInitials(formData.UserName)}
                        </div>
                        <div className="preview-info">
                            <h3>{formData.UserName || 'New User'}</h3>
                            <span className={`preview-role ${selectedRole?.name.toLowerCase().replace('role_', '')}`}>
                                {selectedRole?.name.replace('ROLE_', '') || 'Select Role'}
                            </span>
                        </div>
                    </div>
                    <div className="sidebar-tips">
                        <h4>Tips</h4>
                        <ul>
                            <li>Passwords should be at least 8 characters.</li>
                            <li>Usernames must be unique in the system.</li>
                            <li>Roles determine system permissions.</li>
                        </ul>
                    </div>
                </div>

                <div className="modal-content">
                    <header className="modal-header">
                        <h2>{user ? 'Update Profile' : 'Create New Account'}</h2>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </header>

                    <form onSubmit={handleSubmit} className="modal-form">
                        <div className="form-sections">
                            <div className="form-section">
                                <label>Identify User</label>
                                <div className="input-with-icon">
                                    <span className="input-icon">👤</span>
                                    <input
                                        name="UserName"
                                        value={formData.UserName}
                                        onChange={handleChange}
                                        disabled={!!user}
                                        placeholder="Enter username"
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <label>Security</label>
                                <div className="password-group">
                                    <div className="input-with-icon">
                                        <span className="input-icon">🔒</span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="Password"
                                            value={formData.Password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                            required={!user}
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? '👁️' : '🕶️'}
                                        </button>
                                    </div>
                                    <button type="button" className="generate-btn" onClick={generatePassword}>
                                        ⚡ Generate
                                    </button>
                                </div>
                                {user && (
                                    <p className="field-help-text">
                                        If you don't want to update password, leave it blank
                                    </p>
                                )}
                            </div>

                            <div className="form-section">
                                <label>Assign Responsibility</label>
                                <div className="role-cards">
                                    {roles.map(role => (
                                        <div
                                            key={role.id}
                                            className={`role-card ${formData.RoleID.toString() === role.id.toString() ? 'selected' : ''} ${role.name.toLowerCase().replace('role_', '')}`}
                                            onClick={() => handleRoleSelect(role.id)}
                                        >
                                            <div className="role-card-icon">
                                                {role.name.includes('ADMIN') ? '👑' : role.name.includes('MANAGER') ? '💼' : '👤'}
                                            </div>
                                            <div className="role-card-info">
                                                <span className="role-card-name">{role.name.replace('ROLE_', '')}</span>
                                            </div>
                                            <div className="role-card-check">✓</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <footer className="modal-footer">
                            <button type="button" className="cancel-link" onClick={onClose}>
                                Discard Changes
                            </button>
                            <button type="submit" className="save-btn-premium">
                                {user ? 'Save Updates' : 'Launch Account'}
                            </button>
                        </footer>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserModal;
