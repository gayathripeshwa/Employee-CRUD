import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api';
import { useAuth } from '../AuthContext';
import { formatDate, formatSalary } from '../constants';
import { useFlashMessage } from '../useFlashMessage';
import Message from './Message';
import StatusBadge from './StatusBadge';
import './EmployeeProfile.css';

function EmployeeProfile() {
    const { id } = useParams();           // from the URL: /employees/:id
    const { user } = useAuth();
    const isAdmin = user.role === 'admin';
    const navigate = useNavigate();

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useFlashMessage(); // e.g. "Ravi was added."
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        setLoading(true);
        api.get(`/emp/${id}`)
            .then((res) => setEmployee(res.data))
            .catch((err) => {
                setEmployee(null);
                setMessage({ type: 'error', text: errorMessage(err, 'Employee not found') });
            })
            .finally(() => setLoading(false));
    }, [id, setMessage]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await api.delete(`/emp/${id}`);
            // Back to the directory, with a message waiting there.
            navigate('/employees', {
                state: {
                    message: { type: 'success', text: `${res.data.empName} (ID ${res.data.empId}) was deleted.` }
                }
            });
        } catch (err) {
            setMessage({ type: 'error', text: errorMessage(err, 'Could not delete employee') });
            setDeleting(false);
            setConfirming(false);
        }
    };

    // One "label: value" line; shows a dash when the value is missing.
    const detail = (label, value) => (
        <div className="detail">
            <dt>{label}</dt>
            <dd>{value || value === 0 ? value : '—'}</dd>
        </div>
    );

    return (
        <div className="page page-narrow">
            <Link to="/employees" className="back-link">← Back to directory</Link>

            <Message message={message} onClose={() => setMessage(null)} />

            {loading && <p className="muted">Loading…</p>}

            {!loading && employee && (
                <div className="page-card">
                    {/* ----- Header ----- */}
                    <div className="profile-header">
                        <div className="avatar" aria-hidden="true">
                            {employee.empName.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-title">
                            <h1>{employee.empName}</h1>
                            <p className="muted">{employee.des} · {employee.dept}</p>
                        </div>
                        <StatusBadge status={employee.status} />
                    </div>

                    {/* ----- Details ----- */}
                    <h3 className="profile-section">Job</h3>
                    <dl className="details">
                        {detail('Employee ID', employee.empId)}
                        {detail('Designation', employee.des)}
                        {detail('Department', employee.dept)}
                        {detail('Joining date', formatDate(employee.join))}
                        {detail('Status', employee.status || 'Active')}
                        {isAdmin && detail('Salary (per year)', formatSalary(employee.salary))}
                    </dl>

                    <h3 className="profile-section">Contact</h3>
                    <dl className="details">
                        {detail('Email', employee.email && <a href={`mailto:${employee.email}`}>{employee.email}</a>)}
                        {detail('Phone', employee.phone)}
                    </dl>

                    {employee.updatedAt && (
                        <p className="muted small">Last updated {formatDate(employee.updatedAt)}</p>
                    )}

                    {/* ----- Admin actions ----- */}
                    {isAdmin && !confirming && (
                        <div className="profile-actions">
                            <Link to={`/employees/${employee.empId}/edit`} className="btn btn-primary">
                                Edit
                            </Link>
                            <button type="button" className="btn btn-danger" onClick={() => setConfirming(true)}>
                                Delete
                            </button>
                        </div>
                    )}

                    {/* Delete is two steps, inside the page — no pop-up */}
                    {isAdmin && confirming && (
                        <div className="confirm-box">
                            <p>
                                <strong>Delete {employee.empName}?</strong> This cannot be undone.
                            </p>
                            <div className="profile-actions">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    {deleting ? 'Deleting…' : 'Yes, delete'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setConfirming(false)}
                                    disabled={deleting}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default EmployeeProfile;
