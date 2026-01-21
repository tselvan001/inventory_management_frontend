import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';

export function Navbar() {
    const location = useLocation();
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="logo">TASA STOCKS</Link>
                <div className="nav-links">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
                    {user && user.permissions?.includes('ROLES_MANAGE') && (
                        <Link to="/roles" className={`nav-link ${location.pathname === '/roles' ? 'active' : ''}`}>Manage Roles (DEBUG: OK)</Link>
                    )}
                    {user && !user.permissions?.includes('ROLES_MANAGE') && (
                        <span className="nav-link" style={{ color: 'red' }}>Manage Roles (NO PERM)</span>
                    )}
                    {user && (
                        <button
                            onClick={logout}
                            className="logout-btn"
                            title="Logout"
                            aria-label="Logout"
                        >
                            <FiLogOut />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
