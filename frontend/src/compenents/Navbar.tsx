import React, {ChangeEvent, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import { BsSearch } from "react-icons/bs";
// @ts-ignore
import { FaUser } from "react-icons/fa";
// @ts-ignore
import { AiOutlineShoppingCart } from "react-icons/ai";
import axios from 'axios';
// @ts-ignore
import debounce from 'lodash.debounce';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  photo: string;
}

interface UserDetails {
  login: string;
  email: string;
  firstname: string;
  lastname: string;
}

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({ login: '', email: '', firstname: '', lastname: '' });

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const debouncedSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsDropdownVisible(false);
      return;
    }

    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const response = await axios.get(`http://localhost:8000/api/products/search?name=${encodeURIComponent(query)}`, { headers });
      setSearchResults(response.data.slice(0, 7));
      setIsDropdownVisible(true);
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsDropdownVisible(false);
    }
  }, 300);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handleProductClick = () => {
    setIsDropdownVisible(false);
  };

  const fetchCartItems = (): void => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    axios.get('http://localhost:8000/api/carts', { headers })
        .then(response => setCartItemCount(response.data.length))
        .catch(error => console.error('Error fetching cart items:', error));
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserDetails({ login: '', email: '', firstname: '', lastname: '' });
    window.location.href = '/login';
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setIsDropdownVisible(false);
      fetchCartItems();
    }
  }, [searchTerm]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };
      axios.get<UserDetails>('http://localhost:8000/api/users', { headers })
          .then(response => {
            setUserDetails({ ...response.data, login: capitalizeFirstLetter(response.data.login) });
          })
          .catch(error => console.error('Error fetching user details:', error));
    }
  }, []);

  return (
      <div className="py-4 bg-white top-0 sticky z-10 shadow-lg font-karla">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/home" className="text-4xl font-bold" data-test="main-logo">
              EpiHardware
            </Link>
            <div className="relative w-full max-w-[500px] flex">
              <input
                  type="text"
                  placeholder="Search for a product..."
                  className=" w-full px-4 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                  value={searchTerm}
                  onChange={handleInputChange}
              />
              <div
                  className="bg-blue-500 text-white text-[26px] grid place-items-center px-4 cursor-pointer"
                  onClick={() => debouncedSearch(searchTerm)}
              >
                <BsSearch />
              </div>
              {
                  isDropdownVisible && searchResults.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border-2 border-blue-500 mt-10 ">
                        {searchResults.map((product) => (
                            <Link to={`/products/${product.id}`} key={product.id} className="flex items-center p-2 hover:bg-gray-100" onClick={handleProductClick}>
                              <img
                                src={product.photo}
                                alt={product.name}
                                className="w-10 h-10 object-cover mr-2"
                            />
                              <div className="flex flex-col flex-grow">
                                <span className="font-semibold">{product.name}</span>
                                <span className="text-gray-600 text-sm">{`${product.price}€`}</span>
                              </div>
                            </Link>
                        ))}
                      </div>
                  )
              }
            </div>
            <div className="flex gap-4 md:gap-8 items-center">
              <Link
                  to="/products"
                  className="text-xl font-bold"
                  data-test="main-products"
              >
                Products
              </Link>

              <div className="flex items-center gap-2">
                    <>
                        <FaUser className="text-gray-500 text-2xl" />
                      <div className="text-xl font-bold">
                        <Link to="/profile" className="cursor-pointer hover:opacity-85" data-test="profile-btn">
                          {capitalizeFirstLetter(userDetails.login)}
                        </Link>
                      </div>
                    </>

              </div>
                  <button
                      onClick={logout}
                      className="text-xl font-bold"
                      data-test="logout-btn"
                  >
                    Logout
                  </button>
              <div
                  className="text-gray-500 text-[32px] relative hover:cursor-pointer hover:opacity-80"
                  data-test="cart-btn"
              >
                <Link to="/cart">
                  <AiOutlineShoppingCart />
                </Link>
                {cartItemCount > 0 && (
                    <div
                        className="absolute top-[-10px] right-[-10px] bg-red-600 w-[25px] h-[25px] rounded-full text-white text-[14px] grid place-items-center"
                        data-test="cart-item-count"
                    >
                      {cartItemCount}
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Navbar;
