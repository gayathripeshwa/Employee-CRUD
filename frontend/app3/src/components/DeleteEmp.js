import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import api, { errorMessage } from '../api';
import Message from './Message';
import './DeleteEmp.css';

// Deleting is a two-step process, all inside the page (no pop-ups):
//   1. Enter an ID → we look the employee up and show their details.
//   2. Click "Yes, delete" to confirm, or "Cancel" to back out.
function DeleteEmp() {

    const { register, handleSubmit, reset } = useForm();
    const [toDelete, setToDelete] = useState(null);   // employee waiting for confirmation
    const [message, setMessage] = useState(null);

    // Step 1: find the employee so the user can see who they're deleting.
    const onSubmit = async (data) => {
        setMessage(null);
        setToDelete(null);
        try {
            const res = await api.get(`/emp/${data.empId}`);
            setToDelete(res.data);
        } catch (err) {
            setMessage({ type: 'error', text: errorMessage(err, "Employee not found") });
        }
    };

    const onInvalid = () => {
        setToDelete(null);
        setMessage({ type: 'error', text: 'Please enter a valid Employee ID.' });
    };

    // Step 2: the user clicked "Yes, delete".
    const confirmDelete = async () => {
        try {
            const res = await api.delete(`/emp/${toDelete.empId}`);
            setMessage({
                type: 'success',
                text: `Employee ${res.data.empName} (ID ${res.data.empId}) was deleted.`
            });
            setToDelete(null);
            reset();
        } catch (err) {
            setMessage({ type: 'error', text: errorMessage(err, "Could not delete employee") });
        }
    };

    const cancelDelete = () => {
        setToDelete(null);
        setMessage(null);
    };

    return (
        <div className="delete-container">

            <div className="delete-card">

                <h1>Delete Employee</h1>

                <p className="warning">
                    Warning: This action cannot be undone.
                </p>

                <form onSubmit={handleSubmit(onSubmit, onInvalid)}>

                    <div className="form-group">
                        <input
                            {...register("empId", { required: true, min: 1 })}
                            type="number"
                            placeholder="Enter Employee ID"
                        />
                    </div>

                    <button
                        className="delete-btn"
                        type="submit"
                    >
                        Find Employee
                    </button>

                </form>

                <Message message={message} onClose={() => setMessage(null)} />

                {toDelete && (

                    <div className="result-card">

                        <h3>Delete this employee?</h3>

                        <p><strong>ID:</strong> {toDelete.empId}</p>

                        <p><strong>Name:</strong> {toDelete.empName}</p>

                        <p><strong>Designation:</strong> {toDelete.des}</p>

                        <p><strong>Department:</strong> {toDelete.dept}</p>

                        <p><strong>Joining Date:</strong> {toDelete.join}</p>

                        <div className="confirm-actions">
                            <button type="button" className="confirm-yes" onClick={confirmDelete}>
                                Yes, delete
                            </button>
                            <button type="button" className="confirm-cancel" onClick={cancelDelete}>
                                Cancel
                            </button>
                        </div>

                    </div>

                )}

                <div className="home-link">
                    <Link to="/">← Back to Home</Link>
                </div>

            </div>

        </div>
    );
}

export default DeleteEmp;
