import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import api, { errorMessage } from '../api';
import './UpdateEmp.css';

function UpdateEmp() {

    const { register, handleSubmit, reset } = useForm();
    const [result, setResult] = useState(null);

    const onSubmit = async (data) => {

        try {

            const res = await api.put(
                `/emp/${data.empId}`,
                {
                    des: data.des
                }
            );

            setResult(res.data);

            alert("Employee updated successfully!");

            reset();

        } catch (err) {

            setResult(null);

            alert(errorMessage(err, "Employee not found"));
        }
    };

    return (
        <div className="update-container">

            <div className="update-card">

                <h1>Update Employee</h1>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="form-group">
                        <input
                            {...register("empId", { required: true, min: 1 })}
                            type="number"
                            placeholder="Employee ID"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            {...register("des", { required: true })}
                            placeholder="New Designation"
                        />
                    </div>

                    <button
                        className="update-btn"
                        type="submit"
                    >
                        Update Employee
                    </button>

                </form>

                {result && (
                    <div className="result-card">

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

export default UpdateEmp;