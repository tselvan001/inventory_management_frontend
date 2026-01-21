import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, roles, permissions }) => {
    const { user, loading, hasPermission } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        console.log('ProtectedRoute: No user, redirecting to login from', location.pathname);
        // Redirect to login but keep the location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Priority 1: Permission-based check
    if (permissions) {
        if (!permissions.every(p => hasPermission(p))) {
            console.log('ProtectedRoute: Permission mismatch. Required:', permissions, 'User has:', user.permissions);
            return <Navigate to="/" replace />;
        }
        // If permissions match, they take precedence over roles
        return children;
    }

    // Priority 2: Role-based check (only if no permissions required)
    if (roles && !roles.includes(user.role)) {
        console.log('ProtectedRoute: Role mismatch. Required:', roles, 'Actual:', user.role);
        return <Navigate to="/" replace />;
    }

    return children;
};
