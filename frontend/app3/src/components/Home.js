import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Employee Management System</h1>

                <p>
                    Manage employee records efficiently and securely
                </p>

                <div className="card-container">
                    <Link to="/add" className="card">
                        <h2>➕ Add Employee</h2>
                        <p>Create a new employee record</p>
                    </Link>

                    <Link to="/search" className="card">
                        <h2>🔍 Search Employee</h2>
                        <p>Find employee information</p>
                    </Link>

                    <Link to="/update" className="card">
                        <h2>✏️ Update Employee</h2>
                        <p>Modify employee details</p>
                    </Link>

                    <Link to="/delete" className="card">
                        <h2>🗑️ Delete Employee</h2>
                        <p>Remove employee records</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;