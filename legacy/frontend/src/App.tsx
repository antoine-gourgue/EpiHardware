import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './styles/tailwind.css';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import ProductList from "./pages/ProductLists";
import ProfilePage from "./pages/Profile";
import NotFoundPage from "./pages/NotFoundPage";
import InvoicePage from "./pages/InvoicePage";

// Composant PrivateRoute
const PrivateRoute: React.FC = () => {
    const isAuth = localStorage.getItem('token');
    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <main>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/home" element={<Home />} />
                            <Route path="/products/:productId" element={<ProductDetail />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/products" element={<ProductList />} />
                            <Route path="/invoice/:orderId" element={<InvoicePage />} />
                            <Route path="*" element={<Navigate to="/home" replace />} />
                        </Route>
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
