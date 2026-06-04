import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
function UpdateEmp(){
    const { register, handleSubmit, reset }= useForm();
    const [result, setResult]=useState(null);
    const onSubmit= async(data)=>{
        try{
            const res=await axios.put(`http://localhost:3000/emp/${data.empId}`,
                {des: data.des}
            );
            alert("Employee updated Successfully!");
            setResult(res.data);
            reset();
        }
        catch(err){
            alert("Employee Not found");
        }
    }
    return(
        <div>
            <h1> Update Employee</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("empId")}placeholder="ID to Update"/> <br />
                <input {...register("des")} placeholder='New Designation' /> <br />
                <button type="submit"> Update</button>
            </form>
            <div>
                {result &&(
                    <div>
                        <p>ID: {result.empId}</p>
                        <p>Name: {result.empName}</p>
                        <p>Designation: {result.des}</p>
                        <p>Department: {result.dept}</p>
                        <p>Joining date: {result.join}</p>
                    </div>
                )}
            </div>
            <p><Link to="/">Home Page</Link></p>
        </div>
    );
}
export default UpdateEmp;