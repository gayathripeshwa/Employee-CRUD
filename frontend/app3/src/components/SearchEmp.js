import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
function SearchEmp(){
    const { register, handleSubmit } = useForm();
    const [result, setResult]= useState(null);
    const onSubmit= async(data)=>{
        try{
            const res=await axios.get(`http://localhost:3000/emp/${data.empId}`);
            setResult(res.data);
        }
        catch(err){
            alert("Employee not found");
        }
    }
    return(
        <div>
            <h1> Search Employee</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("empId")} placeholder='ID to search for'/><br />
                <button type="submit">Search</button>
            </form>
            <br />
            {result && (
                <div>
                    <p>ID: {result.empId}</p>
                    <p>Name: {result.empName}</p>
                    <p>Designation: {result.des}</p>
                    <p>Department: {result.dept}</p>
                    <p>Joining date: {result.join}</p>
                </div>
            )}
            <p><Link to="/">Home Page</Link></p>
        </div>
    );
}
export default SearchEmp;
