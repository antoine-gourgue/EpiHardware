import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { Link } from 'react-router-dom';

import LoadingSpinner from './common/LoadingSpinner';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    photo: string;
}

const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 3000,
};

function truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

const CarouselComponent: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                const response = await axios.get('http://localhost:8000/api/products', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                const error = err as Error;
                setError(error.message || 'An error occurred while fetching the products.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const renderProductCard = (product: Product) => (
        <div key={product.id} className="p-4 border rounded-lg hover:shadow-lg transition-shadow h-64">
            <Link to={`/products/${product.id}`} className="no-underline">
                <img src={product.photo} alt={product.name} className="w-full h-56 object-cover rounded-md mb-4"/>
            </Link>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{truncateText(product.description, 50)}</p>
                <p className="text-lg font-bold">${product.price}</p>
        </div>
    );


    return (
        <div className="container mx-auto">
            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="text-center mb-16 mt-10">
                    <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
                    <Slider {...carouselSettings}>
                        {products.map(renderProductCard)}
                    </Slider>
                </div>
            )}
        </div>
    );
};

export default CarouselComponent;
