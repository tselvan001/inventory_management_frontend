import React, { useState, useEffect, useMemo } from 'react';
import { roleService } from '../services/api';
import './RolesPage.css';

export const RolesPage = () => {
    const [roles, setRoles] = useState([]);
    const [allPermissions, setAllPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [rolePermissions, setRolePermissions] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [rolesRes, permsRes] = await Promise.all([
                roleService.getAllRoles(),
                roleService.getAllPermissions()
            ]);
            setRoles(rolesRes.data);
            setAllPermissions(permsRes.data);
            if (rolesRes.data.length > 0) {
                const firstRole = rolesRes.data[0];
                setSelectedRole(firstRole);
                setRolePermissions(new Set(firstRole.permissions.map(p => p.name)));
            }
        } catch (error) {
            console.error('Error fetching roles/permissions', error);
            // Interceptor handles 401/403
            if (!error.response || ![401, 403].includes(error.response.status)) {
                showToast('Failed to load roles and permissions', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSelectRole = (role) => {
        setSelectedRole(role);
        setRolePermissions(new Set(role.permissions.map(p => p.name)));
    };

    const handleTogglePermission = (permissionName) => {
        const newSet = new Set(rolePermissions);
        if (newSet.has(permissionName)) {
            newSet.delete(permissionName);
        } else {
            newSet.add(permissionName);
        }
        setRolePermissions(newSet);
    };

    const handleToggleCategory = (categoryPerms) => {
        const allChecked = categoryPerms.every(p => rolePermissions.has(p.name));
        const newSet = new Set(rolePermissions);

        categoryPerms.forEach(p => {
            if (allChecked) {
                newSet.delete(p.name);
            } else {
                newSet.add(p.name);
            }
        });

        setRolePermissions(newSet);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await roleService.updateRolePermissions(selectedRole.id, Array.from(rolePermissions));
            setRoles(roles.map(r => r.id === selectedRole.id ? {
                ...r,
                permissions: Array.from(rolePermissions).map(name => ({ name }))
            } : r));
            showToast('Permissions updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating permissions', error);
            // Interceptor handles 401/403
            if (!error.response || ![401, 403].includes(error.response.status)) {
                showToast('Failed to update permissions', 'error');
            }
        } finally {
            setSaving(false);
        }
    };

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const groupedPermissions = useMemo(() => {
        const groups = {};
        allPermissions.forEach(p => {
            const category = p.groupName || 'OTHER';
            if (!groups[category]) groups[category] = [];
            groups[category].push(p);
        });
        return groups;
    }, [allPermissions]);

    const getCategoryIcon = (category) => {
        const icons = {
            'INVENTORY': '📦',
            'USERS': '👥',
            'REPORTS': '📊',
            'SETTINGS': '⚙️',
            'LOCATIONS': '📍',
            'PRODUCTS': '🏷️',
            'ORDERS': '📋',
            'OTHER': '📂'
        };
        return icons[category.toUpperCase()] || '📂';
    };

    const getRoleIcon = (roleName) => {
        if (roleName.includes('ADMIN')) return '🛡️';
        if (roleName.includes('MANAGER')) return '👔';
        if (roleName.includes('USER')) return '👤';
        return '👤';
    };

    if (loading) {
        return (
            <div className="roles-page container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading roles and permissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="roles-page container">
            <header className="page-header">
                <div className="header-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Access Control
                </div>
                <h1>Role Management</h1>
                <p>Configure permissions and access levels for each role in your organization.</p>
            </header>

            <div className="roles-layout">
                <aside className="roles-navigation">
                    <div className="sidebar-header">
                        <h3>Available Roles</h3>
                        <span className="count-badge">{roles.length}</span>
                    </div>
                    <nav className="role-nav">
                        {roles.map(role => (
                            <button
                                key={role.id}
                                className={`role-nav-item ${selectedRole?.id === role.id ? 'active' : ''}`}
                                onClick={() => handleSelectRole(role)}
                            >
                                <span className="role-icon">
                                    {getRoleIcon(role.name)}
                                </span>
                                <span className="role-label">{role.name}</span>
                                <span className="role-permission-count">
                                    {role.permissions?.length || 0}
                                </span>
                                {selectedRole?.id === role.id && <span className="active-indicator" />}
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className="permissions-dashboard">
                    {selectedRole ? (
                        <div className="permissions-card">
                            <div className="permissions-card-header">
                                <div className="title-group">
                                    <div className="role-title-wrapper">
                                        <div className="role-avatar">
                                            {getRoleIcon(selectedRole.name)}
                                        </div>
                                        <div>
                                            <h2>{selectedRole.name}</h2>
                                            <span className="subtitle">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                Manage access permissions for this role
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="header-actions">
                                    <div className="permission-stats">
                                        <div className="stat-item">
                                            <div className="stat-value">{rolePermissions.size}</div>
                                            <div className="stat-label">Active</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-value">{allPermissions.length - rolePermissions.size}</div>
                                            <div className="stat-label">Inactive</div>
                                        </div>
                                    </div>
                                    <button
                                        className="save-changes-btn"
                                        onClick={handleSave}
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <span className="spinner"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M5 13l4 4L19 7" />
                                                </svg>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="permissions-sections">
                                {Object.entries(groupedPermissions).map(([category, perms]) => {
                                    const allChecked = perms.every(p => rolePermissions.has(p.name));
                                    const someChecked = perms.some(p => rolePermissions.has(p.name));

                                    return (
                                        <div key={category} className="category-section">
                                            <div className="category-header">
                                                <div className="category-title-group">
                                                    <div className="permission-category-icon">
                                                        {getCategoryIcon(category)}
                                                    </div>
                                                    <h4>{category}</h4>
                                                    <span className="category-count">
                                                        {perms.filter(p => rolePermissions.has(p.name)).length}/{perms.length}
                                                    </span>
                                                </div>
                                                <button
                                                    className="toggle-all-btn"
                                                    onClick={() => handleToggleCategory(perms)}
                                                >
                                                    {allChecked ? (
                                                        <>
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                            Revoke All
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Grant All
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <div className="permissions-list-grid">
                                                {perms.map(p => (
                                                    <div
                                                        key={p.name}
                                                        className={`permission-card ${rolePermissions.has(p.name) ? 'checked' : ''}`}
                                                        onClick={() => handleTogglePermission(p.name)}
                                                    >
                                                        <label className="toggle-switch" onClick={e => e.stopPropagation()}>
                                                            <input
                                                                type="checkbox"
                                                                checked={rolePermissions.has(p.name)}
                                                                onChange={() => handleTogglePermission(p.name)}
                                                            />
                                                            <span className="toggle-slider"></span>
                                                        </label>
                                                        <div className="permission-info">
                                                            <span className="permission-name">{p.formattedName}</span>
                                                            <span className="permission-desc">
                                                                {rolePermissions.has(p.name) ? 'Access granted' : 'Access denied'}
                                                            </span>
                                                        </div>
                                                        <div className="permission-status"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="empty-selection-state">
                            <div className="empty-icon">🔐</div>
                            <h3>Select a Role</h3>
                            <p>Choose a role from the sidebar to view and manage its permissions and access levels.</p>
                        </div>
                    )}
                </main>
            </div>

            {toast && (
                <div className="toast-container">
                    <div className={`toast ${toast.type}`}>
                        {toast.type === 'success' ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        {toast.message}
                    </div>
                </div>
            )}
        </div>
    );
};
