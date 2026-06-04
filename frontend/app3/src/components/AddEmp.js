import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './AddEmp.css';

function AddEmp() {

    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            await axios.post("http://localhost:3000/emp", {
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
            alert("Error adding employee");
        }
    };

    return (
        <div className="add-container">
            <div className="add-card">

                <h1>Add Employee</h1>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="form-group">
                        <input
                            {...register("empId")}
                            placeholder="Employee ID"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            {...register("empName")}
                            placeholder="Employee Name"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            {...register("des")}
                            placeholder="Designation"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            {...register("dept")}
                            placeholder="Department"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="date"
                            {...register("join")}
                        />
                    </div>

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