import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <p className="text-xl font-semibold text-gray-600 mt-2">Page not found</p>
                <p className="mt-4 text-gray-500">We're sorry, the page you requested could not be found. Please go back to the homepage or contact us if the problem persists.</p>
                <div className="mt-6">
                    <Link to="/home" className="text-blue-500 hover:underline">Go to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
