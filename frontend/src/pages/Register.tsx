import React, { useState } from 'react';
import Button from "../compenents/common/Button";
import Input from '../compenents/common/Input';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Register: React.FC = () => {
    const navigate = useNavigate();

    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleRegister = async () => {
        setEmailError('');

        if (password !== confirmPassword) {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Passwords do not match.",
                confirmButtonColor: '#3b82f6',
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login,
                    email,
                    firstname: firstName,
                    lastname: lastName,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to register');
            }

            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                navigate('/login');
            });

        } catch (error) {
            console.error('Registration failed:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: (error as Error).message  || 'Please try again.',
                confirmButtonColor: '#3b82f6',
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md px-6 py-8 text-left bg-white shadow-lg rounded-xl">
                <h3 className="text-2xl font-semibold text-center text-gray-700">Register</h3>
                <form className="mt-6" onSubmit={e => { e.preventDefault(); handleRegister(); }}>
                    <div className="mb-5">
                        <label htmlFor="login" className="block text-sm font-semibold text-gray-600">Login</label>
                        <Input
                            type="text"
                            placeholder="Choose a login"
                            value={login}
                            onChange={e => setLogin(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-600">Email</label>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-md"
                        />
                        {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="firstname" className="block text-sm font-semibold text-gray-600">First Name</label>
                        <Input
                            type="text"
                            placeholder="Enter your first name"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="lastname" className="block text-sm font-semibold text-gray-600">Last Name</label>
                        <Input
                            type="text"
                            placeholder="Enter your last name"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-600">Password</label>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-600">Confirm Password</label>
                        <Input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-md"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <Button type="submit" className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">Register</Button>
                        </div>
                        <p className="text-sm text-gray-600">Already have an account? <a href="/login" className="text-blue-500 hover:underline">Log in</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
