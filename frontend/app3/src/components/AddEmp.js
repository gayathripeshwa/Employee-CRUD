import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
function AddEmp(){
    const { register, handleSubmit, reset }=useForm();
    const onSubmit= async(data) =>{
        try{
            await axios.post("http://localhost:3000/emp", {
                empId: Number(data.empId),
                empName: data.empName,
                des: data.des,
                dept: data.dept,
                join: data.join
            });
            alert("Employee added Successfully!");
            reset();
        }
        catch(err){
            alert("Error adding Employee");
        }
    }
    return(
        <div>
            <h1> Add Employee</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("empId")}placeholder='Employee ID'/><br></br>
                <input {...register("empName")} placeholder='Employee Name' /><br></br>
                <input {...register("des")} placeholder='Designation' /><br></br>
                <input {...register("dept")} placeholder='Department' /><br></br>
                <input {...register("join")} placeholder="Joining Date" /><br></br>
                <button type="submit">Add</button>
            </form>
            <br />
            <p><Link to="/">Home Page</Link></p>
        </div>
    )
}
export default AddEmp;