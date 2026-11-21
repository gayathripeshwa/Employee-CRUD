import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import EmployeeForm from './EmployeeForm';

function AddEmp() {
    const navigate = useNavigate();

    // If this throws (e.g. duplicate ID), EmployeeForm shows the error.
    const handleAdd = async (data) => {
        const res = await api.post('/emp', data);
        // Go to the new employee's profile and show a success message there.
        navigate(`/employees/${res.data.empId}`, {
            state: { message: { type: 'success', text: `${res.data.empName} was added.` } }
        });
    };

    return (
        <div className="page page-narrow">
            <Link to="/employees" className="back-link">← Back to directory</Link>

            <div className="page-card">
                <div className="page-header">
                    <h1>Add Employee</h1>
                </div>

                <EmployeeForm
                    onSubmit={handleAdd}
                    submitLabel="Add Employee"
                    cancelTo="/employees"
                />
            </div>
        </div>
    );
}

export default AddEmp;
