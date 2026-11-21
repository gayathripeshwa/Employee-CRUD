import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api, { errorMessage } from '../api';
import { useAuth } from '../AuthContext';
import Message from './Message';
import './Auth.css';

function Register() {
    const { register, handleSubmit } = useForm();
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    if (user) {
        return <Navigate to="/" replace />;
    }

    const onSubmit = async (data) => {
        setError('');
        try {
            const res = await api.post('/auth/register', data);
            login(res.data.token, res.data.user); // log in right after registering
            navigate('/');
        } catch (err) {
            setError(errorMessage(err, 'Registration failed'));
        }
    };

    return (
        <div className="add-container">
            <div className="add-card">
                <h1>Register</h1>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <input
                            placeholder="Name"
                            {...register('name', { required: true })}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            {...register('email', { required: true })}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password (min 6 characters)"
                            {...register('password', { required: true, minLength: 6 })}
                        />
                    </div>

                    <Message
                        message={error ? { type: 'error', text: error } : null}
                        onClose={() => setError('')}
                    />

                    <button className="add-btn" type="submit">
                        Register
                    </button>
                </form>

                <div className="home-link">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
