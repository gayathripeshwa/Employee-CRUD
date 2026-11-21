import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api';
import EmployeeForm from './EmployeeForm';
import Message from './Message';

function EditEmp() {
    const { id } = useParams();            // from the URL: /employees/:id/edit
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loadError, setLoadError] = useState(null);

    // Load the employee once, so the form can be pre-filled.
    useEffect(() => {
        api.get(`/emp/${id}`)
            .then((res) => setEmployee(res.data))
            .catch((err) => setLoadError(errorMessage(err, 'Employee not found')));
    }, [id]);

    const handleSave = async (data) => {
        const res = await api.put(`/emp/${id}`, data);
        navigate(`/employees/${id}`, {
            state: { message: { type: 'success', text: `${res.data.empName}'s details were updated.` } }
        });
    };

    return (
        <div className="page page-narrow">
            <Link to={`/employees/${id}`} className="back-link">← Back to profile</Link>

            <div className="page-card">
                <div className="page-header">
                    <h1>Edit Employee</h1>
                </div>

                {loadError && <Message message={{ type: 'error', text: loadError }} />}

                {!employee && !loadError && <p className="muted">Loading…</p>}

                {employee && (
                    <EmployeeForm
                        isEdit
                        defaultValues={{
                            ...employee,
                            // fields that may not exist on older employees
                            email: employee.email ?? '',
                            phone: employee.phone ?? '',
                            salary: employee.salary ?? '',
                            status: employee.status ?? 'Active'
                        }}
                        onSubmit={handleSave}
                        submitLabel="Save changes"
                        cancelTo={`/employees/${id}`}
                    />
                )}
            </div>
        </div>
    );
}

export default EditEmp;
