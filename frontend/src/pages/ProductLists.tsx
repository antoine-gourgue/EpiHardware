import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import Layout from "../compenents/Layout";
import {Link} from "react-router-dom";
import LoadingSpinner from "../compenents/common/LoadingSpinner";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    photo: string;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [sortKey, setSortKey] = useState<string>('');
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(9);


    useEffect(() => {
        // Fetch all products from your API
        axios.get('http://localhost:8000/api/products', { headers } )
            .then(response => {
                const startIndex = (page - 1) * perPage;
                const endIndex = startIndex + perPage;
                const paginatedProducts = response.data.slice(startIndex, endIndex);
                setProducts(paginatedProducts);
                console.log('Products:', paginatedProducts)
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, [page, perPage]);

    const nextPage = () => {
        setPage(page + 1);
        setLoading(true);
    };

    const prevPage = () => {
        setPage(page - 1);
        setLoading(true);
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let sortedProducts = [...products];
        switch (event.target.value) {
            case 'Du - cher au + cher':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'Du + cher au - cher':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'Nouveauté':
                sortedProducts.sort((a, b) => b.id - a.id);
                break;
            default:
                break;
        }
        setProducts(sortedProducts);
    };


    if (loading) return <LoadingSpinner />;

    return (
        <Layout>
        <div className="container mx-auto my-8 p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Discover Our Hardware</h2>
                <div className="relative inline-block text-left">
                    <label htmlFor="sort" className="text-sm font-medium text-gray-700">Trier les produits</label>
                    <div>
                        <select
                            id="sort"
                            name="sort"
                            className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            onChange={handleSortChange}
                            defaultValue="Trier"
                        >
                            <option disabled>Trier</option>
                            <option value="Du - cher au + cher">Du - cher au + cher</option>
                            <option value="Du + cher au - cher">Du + cher au - cher</option>
                            <option value="Nouveauté">Nouveauté</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
                {products.map(product => (
                    <div key={product.id} className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
                        <Link to={`/products/${product.id}`} className="no-underline">
                        <img src={product.photo} alt={product.name} className="w-full h-64 object-cover rounded-md mb-4" />

                        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>

                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <p className="text-lg font-bold">${product.price}</p>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center mb-6 mt-6">
                <button onClick={prevPage} disabled={page === 1} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300">
                    Previous
                </button>
                <div>
                    <span className="text-sm font-medium text-gray-700">{`Page ${page}`}</span>
                </div>
                <button onClick={nextPage} disabled={products.length < perPage} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300">
                    Next
                </button>
            </div>
        </div>
        </Layout>
    );
};

export default ProductList;
