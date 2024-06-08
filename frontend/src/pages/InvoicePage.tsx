import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import LoadingSpinner from "../compenents/common/LoadingSpinner";
import Layout from "../compenents/Layout";
import {Simulate} from "react-dom/test-utils";
import contextMenu = Simulate.contextMenu;
import Button from "../compenents/common/Button";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";
import Swal from "sweetalert2";

interface ProductDetails {
    id: number;
    name: string;
    description: string;
    price: number;
    photo: string;
    quantity: number;
}

interface OrderDetails {
    id: number;
    totalPrice: number;
    creationDate: string;
    products: ProductDetails[];
}

interface UserDetails {
    login: string;
    email: string;
    firstname: string;
    lastname: string;
}


const InvoicePage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const invoiceRef = useRef(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const { data } = await axios.get<OrderDetails>(`http://localhost:8000/api/orders/${orderId}`, { headers });
                const userResponse = await axios.get<UserDetails>('http://localhost:8000/api/users', { headers });
                setOrderDetails(data);
                setUserDetails(userResponse.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const downloadPdfDocument = () => {
        const input = invoiceRef.current;
        if (input) {
            // Augmenter le scale pour améliorer la résolution de la capture
            html2canvas(input, { scale: 2}).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new JsPDF({
                    orientation: 'portrait',
                    unit: 'pt',
                    format: 'a4'
                });

                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`invoice-${orderId}.pdf`);
            }).catch(err => {
                console.error('Could not generate PDF:', err);
                Swal.fire('Error!', 'Could not generate PDF. Please try again later.', 'error');
            });
        } else {
            Swal.fire('Error!', 'No invoice data available to download.', 'error');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Layout>
            <div className=" mx-auto p-4 bg-white rounded-lg">
                <Link to="/profile">
                    <Button className="mb-4">Return </Button>
                </Link>
            </div>

            <div ref={invoiceRef} className="container mx-auto p-8 bg-white rounded-lg shadow-lg mt-8">

                <h1 className="text-3xl font-bold text-center mb-6">Invoice</h1>
                <div className="space-y-6">
                    {userDetails ? (
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold">Customer Details</h2>
                            <p><strong>Name:</strong> {userDetails.firstname} {userDetails.lastname}</p>
                            <p><strong>Email:</strong> {userDetails.email}</p>
                            <p><strong>Login:</strong> {userDetails.login}</p>
                        </div>
                    ) : (
                        <p>No user details available.</p>
                    )}
                    {orderDetails ? (
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold">Invoice Details</h2>
                            <p><strong>Invoice ID:</strong> {orderDetails.id}</p>
                            <p><strong>Invoice Date:</strong> {new Date(orderDetails.creationDate).toLocaleDateString()}</p>
                            <p><strong>Total Amount:</strong> ${orderDetails.totalPrice.toFixed(2)}</p>
                            <table className="min-w-full mt-4 divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Photo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {orderDetails.products.map(product => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <span>{product.name}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <img src={product.photo} alt={product.name}  className="h-10 w-10" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            1
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${product.price.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No invoice details available.</p>
                    )}
                </div>
            </div>
            <div className="flex justify-center mt-8">
                <button onClick={downloadPdfDocument} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-700 rounded shadow-lg transition duration-300 ease-in-out hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    Download PDF Invoice
                </button>
            </div>
        </Layout>
    );
};

export default InvoicePage;
