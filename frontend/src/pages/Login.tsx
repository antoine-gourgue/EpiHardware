import React, { useState } from 'react';
import Button from "../compenents/common/Button";
import Input from '../compenents/common/Input';
import {useNavigate} from "react-router-dom";
import LoadingSpinner from "../compenents/common/LoadingSpinner";

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Email and password are required.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'An unexpected error occurred.');
                setLoading(false);
                return;
            }

            console.log('Login successful:', data);
            localStorage.setItem('token', data.token);

            navigate('/home');
        } catch (error) {
            console.error('Login request failed:', error);
            setError('Failed to connect to the server.');
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md px-6 py-8 text-left bg-white shadow-lg rounded-xl">
                <h3 className="text-2xl font-semibold text-center text-gray-700">Login</h3>
                <form className="mt-6" onSubmit={e => e.preventDefault()}>
                    <div className="mb-5">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-600">Email</label>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-600">Password</label>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-md"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <Button type="submit" className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600" onClick={handleLogin}>Login</Button>
                        </div>
                        <p className="text-sm text-gray-600">New to the site? <a href="/register" className="text-blue-500 hover:underline">Sign up</a></p>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default Login;
