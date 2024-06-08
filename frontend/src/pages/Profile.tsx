import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../compenents/Layout";
import LoadingSpinner from "../compenents/common/LoadingSpinner";
import {Link} from "react-router-dom";


interface UserDetails {
    login: string;
    email: string;
    firstname: string;
    lastname: string;
}

interface ProductDetails {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

interface OrderDetails {
    id: number;
    totalPrice: number;
    creationDate: string;
    products: ProductDetails[];
}

const ProfilePage: React.FC = () => {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [orders, setOrders] = useState<OrderDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserDetails>({
        login: '',
        email: '',
        firstname: '',
        lastname: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const headers = { Authorization: `Bearer ${token}` };
            Promise.all([
                axios.get<UserDetails>('http://localhost:8000/api/users', { headers }),
                axios.get<OrderDetails[]>('http://localhost:8000/api/orders', { headers })
            ]).then(([userResponse, ordersResponse]) => {
                setUserDetails(userResponse.data);
                setOrders(ordersResponse.data);
                setFormData(userResponse.data);
                setLoading(false);
            }).catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        axios.patch('http://localhost:8000/api/users', formData, { headers })
            .then(response => {
                setUserDetails(formData);
                setEditMode(false);
                console.log('Update successful:', response.data);
            })
            .catch(error => {
                console.error('Failed to update user:', error);
            });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Layout>
            <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-4xl font-bold text-center mb-10">User Profile</h2>
                {!editMode ? (
                    <div className="text-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <p className="text-xl"><strong>Login:</strong> {userDetails?.login}</p>
                            <p className="text-xl"><strong>Email:</strong> {userDetails?.email}</p>
                            <p className="text-xl"><strong>First Name:</strong> {userDetails?.firstname}</p>
                            <p className="text-xl"><strong>Last Name:</strong> {userDetails?.lastname}</p>
                        </div>
                        <button onClick={handleEditToggle} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col items-center">
                            <div className="w-full max-w-md">
                                <label className="block text-xl font-semibold text-gray-700 mb-2">
                                    Login:
                                    <input type="text" name="login" value={formData.login} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </label>
                                <label className="block text-xl font-semibold text-gray-700 mb-2">
                                    Email:
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </label>
                                <label className="block text-xl font-semibold text-gray-700 mb-2">
                                    First Name:
                                    <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </label>
                                <label className="block text-xl font-semibold text-gray-700">
                                    Last Name:
                                    <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-center mt-6 gap-4">
                            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                                Save Changes
                            </button>
                            <button onClick={handleEditToggle} className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center mb-6">Your Orders</h2>
                {orders.length > 0 ? (
                    <ul>
                        {orders.map(order => (
                            <li key={order.id} className="mb-2 p-2 shadow rounded bg-gray-100">
                                <Link to={`/invoice/${order.id}`} className="block text-lg">
                                    Order Date: {new Date(order.creationDate).toLocaleDateString()} - Total: ${order.totalPrice.toFixed(2)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : <p>No orders found.</p>}
            </div>

        </Layout>
    );
};

export default ProfilePage;
