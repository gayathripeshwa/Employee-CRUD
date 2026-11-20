import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api, { errorMessage } from '../api';
import Message from './Message';
import './AddEmp.css';

function AddEmp() {

    const { register, handleSubmit, reset } = useForm();
    const [message, setMessage] = useState(null);

    const onSubmit = async (data) => {
        setMessage(null);
        try {
            await api.post("/emp", {
                empId: Number(data.empId),
                empName: data.empName,
                des: data.des,
                dept: data.dept,
                join: data.join
            });

            setMessage({ type: 'success', text: `Employee ${data.empName} added successfully!` });
            reset();
        }
        catch (err) {
            setMessage({ type: 'error', text: errorMessage(err, "Error adding employee") });
        }
    };

    // Runs instead of onSubmit when a required field is empty.
    const onInvalid = () => {
        setMessage({ type: 'error', text: 'Please fill in all fields.' });
    };

    return (
        <div className="add-container">
            <div className="add-card">

                <h1>Add Employee</h1>

                <form onSubmit={handleSubmit(onSubmit, onInvalid)}>

                    <div className="form-group">
                        <input
                            {...register("empId", { required: true, min: 1 })}
                            type="number"
                            placeholder="Employee ID"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            {...register("empName", { required: true })}
                            placeholder="Employee Name"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            {...register("des", { required: true })}
                            placeholder="Designation"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            {...register("dept", { required: true })}
                            placeholder="Department"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="date"
                            {...register("join", { required: true })}
                        />
                    </div>

                    <Message message={message} onClose={() => setMessage(null)} />

                    <button className="add-btn" type="submit">
                        Add Employee
                    </button>

                </form>

                <div className="home-link">
                    <Link to="/">← Back to Home</Link>
                </div>

            </div>
        </div>
    );
}

export default AddEmp;