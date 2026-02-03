import React, { useState, useEffect } from 'react';
import { userService, roleService } from '../services/api';
import './UsersPage.css';
import UserModal from './UserModal';

export const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, rolesRes] = await Promise.all([
                userService.getAllUsers(),
                roleService.getAllRoles()
            ]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
        } catch (error) {
            console.error('Error fetching users/roles', error);
            if (!error.response || ![401, 403].includes(error.response.status)) {
                showToast('Failed to load users and roles', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await userService.deleteUser(id);
                setUsers(users.filter(u => u.UserID !== id));
                showToast('User deleted successfully', 'success');
            } catch (error) {
                console.error('Error deleting user', error);
                showToast('Failed to delete user', 'error');
            }
        }
    };

    const handleSaveUser = async (userData) => {
        try {
            if (editingUser) {
                const res = await userService.updateUser(editingUser.UserID, userData);
                setUsers(users.map(u => u.UserID === editingUser.UserID ? res.data : u));
                showToast('User updated successfully', 'success');
            } else {
                const res = await userService.createUser(userData);
                setUsers([...users, res.data]);
                showToast('User created successfully', 'success');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving user', error);
            showToast(error.response?.data?.message || 'Failed to save user', 'error');
        }
    };

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const getRoleClass = (roleName) => {
        const role = roleName.toLowerCase().replace('role_', '');
        if (role.includes('admin')) return 'admin';
        if (role.includes('manager')) return 'manager';
        return 'user';
    };

    const getRoleIcon = (roleName) => {
        const role = roleName.toLowerCase().replace('role_', '');
        if (role.includes('admin')) return '👑';
        if (role.includes('manager')) return '💼';
        return '👤';
    };

    const getInitials = (username) => {
        return username.charAt(0).toUpperCase();
    };

    const uniqueRolesCount = [...new Set(users.map(u => u.RoleName))].length;

    if (loading) {
        return (
            <div className="users-page container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <span className="loading-text">Loading users...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="users-page container">
            <header className="page-header">
                <div className="header-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    User Management
                </div>
                <h1>System Users</h1>
                <p>Manage users and their assigned roles across the platform.</p>
                <div className="header-actions">
                    <button className="add-user-btn" onClick={handleAddUser}>
                        <span>+</span> Add New User
                    </button>
                </div>
            </header>

            {/* Stats Bar */}
            <div className="users-stats-bar">
                <div className="stat-card">
                    <div className="stat-icon total">👥</div>
                    <div className="stat-content">
                        <span className="stat-value">{users.length}</span>
                        <span className="stat-label">Total Users</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon active">✓</div>
                    <div className="stat-content">
                        <span className="stat-value">{users.length}</span>
                        <span className="stat-label">Active</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon roles">🎭</div>
                    <div className="stat-content">
                        <span className="stat-value">{uniqueRolesCount}</span>
                        <span className="stat-label">Unique Roles</span>
                    </div>
                </div>
            </div>

            {/* Users Grid */}
            {users.length > 0 ? (
                <div className="users-grid">
                    {users.map(user => (
                        <div key={user.UserID} className="user-card">
                            <div className="user-card-header">
                                <div className="user-profile">
                                    <div className="user-avatar-large">
                                        {getInitials(user.UserName)}
                                    </div>
                                    <div className="user-name-group">
                                        <span className="username-large">{user.UserName}</span>
                                        <span className="user-id">ID: #{user.UserID}</span>
                                    </div>
                                </div>
                                <div className="user-card-actions">
                                    <button className="action-btn" onClick={() => handleEditUser(user)} title="Edit User">
                                        ✏️
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDeleteUser(user.UserID)} title="Delete User">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <div className="user-card-body">
                                <div className="user-info-row">
                                    <div className="info-icon role">{getRoleIcon(user.RoleName)}</div>
                                    <div className="info-content">
                                        <span className="info-label">Assigned Role</span>
                                        <span className={`role-badge-large ${getRoleClass(user.RoleName)}`}>
                                            {user.RoleName.replace('ROLE_', '')}
                                        </span>
                                    </div>
                                </div>

                                <div className="user-info-row">
                                    <div className="info-icon status">⚡</div>
                                    <div className="info-content">
                                        <span className="info-label">Status</span>
                                        <span className="status-indicator active">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-users-state">
                    <div className="empty-icon">👥</div>
                    <h3>No Users Found</h3>
                    <p>Get started by adding your first user to the system.</p>
                </div>
            )}

            {isModalOpen && (
                <UserModal
                    user={editingUser}
                    roles={roles}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveUser}
                />
            )}

            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default UsersPage;
