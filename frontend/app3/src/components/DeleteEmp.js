import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import api, { errorMessage } from '../api';
import './DeleteEmp.css';

function DeleteEmp() {

    const { register, handleSubmit, reset } = useForm();
    const [result, setResult] = useState(null);

    const onSubmit = async (data) => {

        if (!window.confirm(`Delete employee ${data.empId}? This cannot be undone.`)) {
            return;
        }

        try {

            const res = await api.delete(
                `/emp/${data.empId}`
            );

            setResult(res.data);

            alert("Employee deleted successfully!");

            reset();

        } catch (err) {

            setResult(null);

            alert(errorMessage(err, "Employee not found"));
        }
    };

    return (
        <div className="delete-container">

            <div className="delete-card">

                <h1>Delete Employee</h1>

                <p className="warning">
                    Warning: This action cannot be undone.
                </p>

                <form onSubmit={handleSubmit(onSubmit)}>

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
                        Delete Employee
                    </button>

                </form>

                {result && (

                    <div className="result-card">

                        <h3>Deleted Employee</h3>

                        <p><strong>ID:</strong> {result.empId}</p>

                        <p><strong>Name:</strong> {result.empName}</p>

                        <p><strong>Designation:</strong> {result.des}</p>

                        <p><strong>Department:</strong> {result.dept}</p>

                        <p><strong>Joining Date:</strong> {result.join}</p>

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