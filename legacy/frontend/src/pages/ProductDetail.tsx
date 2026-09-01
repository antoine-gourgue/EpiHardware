import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from "../compenents/Layout";
import LoadingSpinner from "../compenents/common/LoadingSpinner";
import Swal from "sweetalert2";

interface Product {
    id: number;
    name: string;
    description: string;
    photo: string;
    price: number;
    quantity: number;
}

const ProductDetail: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const [imageLoading, setImageLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/products/${productId}`, { headers })
            .then(response => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('An error occurred while fetching product details.');

            })
            .finally(() => {
                setLoading(false);

        });
    }, [productId]);

    const addToCart = () => {
        axios.post(`http://localhost:8000/api/carts/${productId}`, { quantity }, { headers })
            .then(response => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Product added to cart!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3b82f6',
                });
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to add product to cart.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#F44336',
                });
            });
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div>Error: {error}</div>;
    if (!product) return <div>Product not found.</div>;
    return (
        <Layout>
            <div className="container mx-auto my-8 p-4 bg-white rounded-lg shadow-md">
                <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/3">
                        <img
                            className="rounded-md"
                            src={product.photo}
                            alt={product.name}
                        />
                    </div>
                    <div className="lg:w-2/3 lg:pl-8">
                        <h1 className="text-3xl font-bold text-gray-800 mt-4 lg:mt-0">{product.name}</h1>
                        <p className="text-md text-gray-600 mt-2">{product.description}</p>
                        <div className="mt-3">
                            <span className="text-lg font-semibold text-blue-600">${product.price.toFixed(2)}</span>
                        </div>
                        <div className="mt-6">
                            <div className="flex flex-row items-center space-x-4">
                                <div>
                                    <label htmlFor="quantity" className="text-sm text-gray-700">Quantity:</label>
                                    <select
                                        id="quantity"
                                        name="quantity"
                                        className="border rounded p-2 ml-2"
                                        value={quantity}
                                        onChange={e => setQuantity(Number(e.target.value))}
                                    >
                                        {Array.from({ length: product?.quantity || 1 }, (_, index) => index + 1).map((num) => (
                                            <option key={num} value={num}>
                                                {num}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button onClick={addToCart}
                                        className="text-white bg-yellow-500 hover:bg-yellow-600 rounded px-5 py-2 transition ease-in-out duration-300">
                                    Add to Cart
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-4">
                            <span className="text-sm text-green-600 font-semibold">Special Promotion</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProductDetail;
