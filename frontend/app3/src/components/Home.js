import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Home.css';

function Home() {
    const { user, logout } = useAuth();
    const isAdmin = user.role === 'admin';

    return (
        <div className="home-container">
            <div className="home-content">
                <div className="user-bar">
                    <span>
                        Logged in as <strong>{user.name}</strong> ({user.role})
                    </span>
                    <button className="logout-btn" onClick={logout}>
                        Logout
                    </button>
                </div>

                <h1>Employee Management System</h1>

                <p>
                    Manage employee records efficiently and securely
                </p>

                <div className="card-container">
                    {isAdmin && (
                        <Link to="/add" className="card">
                            <h2>➕ Add Employee</h2>
                            <p>Create a new employee record</p>
                        </Link>
                    )}

                    <Link to="/search" className="card">
                        <h2>🔍 Search Employee</h2>
                        <p>Find employee information</p>
                    </Link>

                    {isAdmin && (
                        <Link to="/update" className="card">
                            <h2>✏️ Update Employee</h2>
                            <p>Modify employee details</p>
                        </Link>
                    )}

                    {isAdmin && (
                        <Link to="/delete" className="card">
                            <h2>🗑️ Delete Employee</h2>
                            <p>Remove employee records</p>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
