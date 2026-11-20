import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import api, { errorMessage } from '../api';
import Message from './Message';
import './SearchEmp.css';

function SearchEmp() {

    const { register, handleSubmit } = useForm();
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState(null);

    const onSubmit = async (data) => {
        setMessage(null);
        try {
            const res = await api.get(
                `/emp/${data.empId}`
            );

            setResult(res.data);
        }
        catch (err) {
            setResult(null);
            setMessage({ type: 'error', text: errorMessage(err, "Employee not found") });
        }
    };

    const onInvalid = () => {
        setResult(null);
        setMessage({ type: 'error', text: 'Please enter a valid Employee ID.' });
    };

    return (
        <div className="search-container">

            <div className="search-card">

                <h1>Search Employee</h1>

                <form
                    className="search-form"
                    onSubmit={handleSubmit(onSubmit, onInvalid)}
                >
                    <input
                        {...register("empId", { required: true, min: 1 })}
                        type="number"
                        placeholder="Enter Employee ID"
                    />

                    <button type="submit">
                        Search
                    </button>
                </form>

                <Message message={message} onClose={() => setMessage(null)} />

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