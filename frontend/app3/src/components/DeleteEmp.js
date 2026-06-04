import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
function DeleteEmp(){
    const { register, handleSubmit, reset}= useForm();
    const[result, setResult]=useState(null);
    const onSubmit= async(data) =>{
        try{
            const res=await axios.delete(`http://localhost:3000/emp/${data.empId}`)
            alert("Employee Deleted");
            setResult(res.data);
            reset();
        }
        catch(err){
            alert("Employee not found");
        }
    };
    return(
        <div>
            <h1>Delete Employee</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("empId")} placeholder='Enter ID' />
                <button type="submit">Delete</button>
            </form>
            <div>
                {result &&(
                    <div>
                        <p>ID: {result.empId} </p>
                        <p>Name: {result.empName}</p>
                        <p>Designation: {result.des}</p>
                        <p>Department: {result.dept}</p>
                        <p>Joining date: {result.join}</p>
                    </div>
                )}
            </div>
            <p> <Link to="/">Home Page</Link></p>
        </div>
    );
}
export default DeleteEmp;