import React, { useState, useEffect } from 'react';
import { roleService } from '../services/api';
import './RolesPage.css';

export const RolesPage = () => {
    const [roles, setRoles] = useState([]);
    const [allPermissions, setAllPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [rolePermissions, setRolePermissions] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    const handleSave = async () => {
        setSaving(true);
        try {
            await roleService.updateRolePermissions(selectedRole.id, Array.from(rolePermissions));
            // Update local roles state
            setRoles(roles.map(r => r.id === selectedRole.id ? {
                ...r,
                permissions: Array.from(rolePermissions).map(name => ({ name }))
            } : r));
            alert('Permissions updated successfully');
        } catch (error) {
            console.error('Error updating permissions', error);
            alert('Failed to update permissions');
        } finally {
            setSaving(false);
        }
    };

    const groupPermissions = () => {
        const groups = {};
        allPermissions.forEach(p => {
            const category = p.groupName || 'OTHER';
            if (!groups[category]) groups[category] = [];
            groups[category].push(p);
        });
        return groups;
    };

    if (loading) return <div className="loading-state">Loading roles...</div>;

    return (
        <div className="roles-page container">
            <header className="page-header">
                <h1>Role Settings</h1>
                <p>Define and manage specific access levels for each department and position.</p>
            </header>

            <div className="roles-layout">
                <aside className="roles-navigation">
                    <div className="sidebar-header">
                        <h3>Identified Roles</h3>
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
                                    {role.name.includes('ADMIN') ? '🛡️' : '👤'}
                                </span>
                                <span className="role-label">{role.name.replace('ROLE_', '')}</span>
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
                                    <h2>{selectedRole.name.replace('ROLE_', '')} Permissions</h2>
                                    <span className="subtitle">Configure access for this role</span>
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
                                        'Update Permissions'
                                    )}
                                </button>
                            </div>

                            <div className="permissions-sections">
                                {Object.entries(groupPermissions()).map(([category, perms]) => (
                                    <div key={category} className="category-section">
                                        <div className="category-header">
                                            <div className="category-marker" data-category={category}></div>
                                            <h4>{category}</h4>
                                        </div>
                                        <div className="permissions-list-grid">
                                            {perms.map(p => (
                                                <label key={p.name} className="modern-checkbox-label">
                                                    <div className="checkbox-wrapper">
                                                        <input
                                                            type="checkbox"
                                                            checked={rolePermissions.has(p.name)}
                                                            onChange={() => handleTogglePermission(p.name)}
                                                        />
                                                        <div className="checkbox-custom"></div>
                                                    </div>
                                                    <div className="permission-info">
                                                        <span className="permission-name">{p.formattedName}</span>
                                                        <span className="permission-desc">Full access to {p.formattedName.toLowerCase()}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="empty-selection-state">
                            <div className="empty-icon">📂</div>
                            <h3>No Role Selected</h3>
                            <p>Pick a role from the left to manage its permissions and system access.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
