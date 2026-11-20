import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api, { errorMessage } from '../api';
import './AddEmp.css';

function AddEmp() {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            await api.post("/emp", {
                empId: Number(data.empId),
                empName: data.empName,
                des: data.des,
                dept: data.dept,
                join: data.join
            });

            alert("Employee added successfully!");
            reset();
        }
        catch (err) {
            alert(errorMessage(err, "Error adding employee"));
        }
    };

    return (
        <div className="add-container">
            <div className="add-card">

                <h1>Add Employee</h1>

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

                    {Object.keys(errors).length > 0 && (
                        <p className="form-error">Please fill in all fields.</p>
                    )}

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