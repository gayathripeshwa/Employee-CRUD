import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api, { errorMessage } from '../api';
import { useAuth } from '../AuthContext';
import Message from './Message';
import './Auth.css';

function Login() {
    const { register, handleSubmit } = useForm();
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    // Already logged in? Go straight to the home page.
    if (user) {
        return <Navigate to="/" replace />;
    }

    const onSubmit = async (data) => {
        setError('');
        try {
            const res = await api.post('/auth/login', data);
            login(res.data.token, res.data.user); // save token + user
            navigate('/');
        } catch (err) {
            setError(errorMessage(err, 'Login failed'));
        }
    };

    return (
        <div className="add-container">
            <div className="add-card">
                <h1>Login</h1>

                <form onSubmit={handleSubmit(onSubmit)}>
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
                            placeholder="Password"
                            {...register('password', { required: true })}
                        />
                    </div>

                    <Message
                        message={error ? { type: 'error', text: error } : null}
                        onClose={() => setError('')}
                    />

                    <button className="add-btn" type="submit">
                        Login
                    </button>
                </form>

                <div className="home-link">
                    No account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
