import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>Employee App</h1>

            <p>
                <Link to="/add">Add Employee</Link>
            </p>

            <p>
                <Link to="/search">Search Employee</Link>
            </p>

            <p>
                <Link to="/update">Update Employee</Link>
            </p>

            <p>
                <Link to="/delete">Delete Employee</Link>
            </p>

            {/*
            <button onClick={() => navigate('/add')}>
                Add Employee
            </button>
            <br />

            <button onClick={() => navigate('/search')}>
                Search Employee
            </button>
            <br />

            <button onClick={() => navigate('/update')}>
                Update Employee
            </button>
            */}
        </div>
    );
}

export default Home;