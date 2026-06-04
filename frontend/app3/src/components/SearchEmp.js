import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import './SearchEmp.css';

function SearchEmp() {

    const { register, handleSubmit } = useForm();
    const [result, setResult] = useState(null);

    const onSubmit = async (data) => {
        try {
            const res = await axios.get(
                `http://localhost:3000/emp/${data.empId}`
            );

            setResult(res.data);
        }
        catch (err) {
            setResult(null);
            alert("Employee not found");
        }
    };

    return (
        <div className="search-container">

            <div className="search-card">

                <h1>Search Employee</h1>

                <form
                    className="search-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <input
                        {...register("empId")}
                        placeholder="Enter Employee ID"
                    />

                    <button type="submit">
                        Search
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

export default SearchEmp;