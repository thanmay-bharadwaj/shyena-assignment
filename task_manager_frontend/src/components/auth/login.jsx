import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const validateInputs = () => {
        let errors = {};

        // Email validation
        if (!email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Enter a valid email address";
        }

        // Password validation
        if (!password) {
            errors.password = "Password is required";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setGeneralError(''); // Clear general error message before attempting login

        if (!validateInputs()) {
            setGeneralError('Please fix the validation errors before submitting.');
            return;
        }

        try {
            const res = await axios.post('http://localhost:8000/api/auth/login/', {
                username: email,
                password: password,
            });

            const { access, refresh } = res.data;

            sessionStorage.setItem('accessToken', access);
            sessionStorage.setItem('refreshToken', refresh);

            const user = { email };
            if (user) {
                login(user);
                navigate('/tasks');
            } else {
                setGeneralError('Invalid credentials. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setGeneralError('Wrong credentials or no user found.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </div>
                    {generalError && <p className="error-message">{generalError}</p>}
                    <button type="submit" className="submit-btn">Login</button>
                </form>
                <div className="register">
                    <p>Don't have an account?</p>
                    <button onClick={() => navigate('/register')} className="register-btn">Register</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
