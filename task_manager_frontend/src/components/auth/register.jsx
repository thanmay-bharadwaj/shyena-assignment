import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateInputs = () => {
        let errors = {};

        if (!email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Enter a valid email address";
        }

        if (!password) {
            errors.password = "Password is required";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        try {
            await axios.post('http://localhost:8000/api/auth/register/', {
                username: email,
                email: email,
                password: password
            });
            alert('Registration successful!');
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                </div>
                <button type="submit" className="btn">
                    Register
                </button>
                <div className="register">
                    <p>Do you want to login?</p>
                    <button onClick={() => navigate('/')}>Login</button>
                </div>
            </form>
        </div>
    );
};

export default Register;
