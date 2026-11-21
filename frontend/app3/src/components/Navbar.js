import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Navbar.css';

// Shown at the top of every page once you're logged in.
function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/employees" className="navbar-brand">
                    Employee Management
                </Link>

                {/* "end" = only highlight on exactly /employees, not /employees/5 */}
                <NavLink to="/employees" end className="navbar-link">
                    Directory
                </NavLink>

                {user.role === 'admin' && (
                    <NavLink to="/employees/new" className="navbar-link">
                        Add Employee
                    </NavLink>
                )}
            </div>

            <div className="navbar-right">
                <span className="navbar-user">
                    {user.name} <span className="navbar-role">({user.role})</span>
                </span>
                <button type="button" className="navbar-logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
