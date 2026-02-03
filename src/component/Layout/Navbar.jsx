import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiLogOut, FiSun, FiMoon } from 'react-icons/fi';

export function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleLogout = () => {
        navigate('/login');
        // Delay logout slightly to allow navigation to /login to complete
        // forcing ProtectedRoute to see /login (or unmount) instead of the previous page
        setTimeout(() => {
            logout();
        }, 100);
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="logo">TASA STOCKS</Link>
                <div className="nav-links">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
                    {user && user.permissions?.includes('ROLES_MANAGE') && (
                        <Link to="/roles" className={`nav-link ${location.pathname === '/roles' ? 'active' : ''}`}>Manage Roles</Link>
                    )}
                    {user && user.permissions?.includes('USERS_MANAGE') && (
                        <Link to="/users" className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`}>Manage Users</Link>
                    )}
                    {user && user.permissions?.includes('MANAGE_LOCATION') && (
                        <Link to="/locations" className={`nav-link ${location.pathname === '/locations' ? 'active' : ''}`}>Manage Locations</Link>
                    )}
                    {user && (
                        <Link to="/activity-logs" className={`nav-link ${location.pathname === '/activity-logs' ? 'active' : ''}`}>Activity Logs</Link>
                    )}

                    {/* Theme Toggle Switch */}
                    <div className="theme-toggle" onClick={toggleTheme} title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                        <div className={`theme-toggle-track ${isDarkMode ? 'dark' : 'light'}`}>
                            <div className="theme-toggle-thumb">
                                {isDarkMode ? <FiMoon /> : <FiSun />}
                            </div>
                        </div>
                    </div>

                    {user && (
                        <button
                            onClick={handleLogout}
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
