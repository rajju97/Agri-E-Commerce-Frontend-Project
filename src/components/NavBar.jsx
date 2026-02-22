import { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';

const NavBar = () => {
    const navigate = useNavigate();
    const itemCount = useSelector((state) => state.cart.itemCount);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { currentUser, userRole, logout } = useAuth();

    const closeMobile = () => setIsMobileMenuOpen(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            closeMobile();
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    const navLinkClass = ({ isActive }) =>
        isActive ? "text-accent font-bold" : "hover:text-accent transition-colors";

    return (
        <div>
            <header className="bg-primary text-white p-4 flex justify-between items-center shadow-lg">
                <h1 onClick={() => { navigate('/'); closeMobile(); }} className="text-2xl font-bold flex items-center cursor-pointer">
                    <img src="/gaif_logo.jpeg" alt="GAIF Logo" className="h-12 bg-white rounded-full w-12 mr-2" />
                    <span className="hidden md:inline">Ganga Agri Innovation Foundation</span>
                    <span className="md:hidden inline">GAIF</span>
                </h1>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex space-x-4 items-center">
                    <NavLink to="/" className={navLinkClass}>Home</NavLink>
                    <NavLink to="/products" className={navLinkClass}>Products</NavLink>

                    {currentUser && (userRole === 'seller' || userRole === 'admin') && (
                        <NavLink to="/seller-dashboard" className={navLinkClass}>
                            <i className="fas fa-store mr-1"></i>Seller
                        </NavLink>
                    )}
                    {currentUser && userRole === 'admin' && (
                        <NavLink to="/admin-dashboard" className={navLinkClass}>
                            <i className="fas fa-shield-alt mr-1"></i>Admin
                        </NavLink>
                    )}

                    <NavLink to="/about-us" className={navLinkClass}>About</NavLink>
                    <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>

                    <ThemeSwitcher />

                    {!currentUser ? (
                        <>
                            <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                            <NavLink to="/register" className="btn btn-sm btn-accent text-white">Register</NavLink>
                        </>
                    ) : (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="flex items-center gap-2 cursor-pointer hover:text-accent">
                                <div className="bg-white text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                    {(currentUser.email?.[0] || 'U').toUpperCase()}
                                </div>
                                <i className="fas fa-chevron-down text-xs"></i>
                            </label>
                            <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-box w-52 text-base-content mt-2">
                                <li className="menu-title"><span className="text-xs truncate">{currentUser.email}</span></li>
                                <li><a onClick={() => navigate('/profile')}><i className="fas fa-user mr-2"></i>My Profile</a></li>
                                <li><a onClick={() => navigate('/orders')}><i className="fas fa-box mr-2"></i>My Orders</a></li>
                                <li className="border-t mt-1 pt-1">
                                    <a onClick={handleLogout} className="text-red-500"><i className="fas fa-sign-out-alt mr-2"></i>Logout</a>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Cart */}
                    <div className="relative">
                        <NavLink to="/cart" className="hover:text-accent flex items-center space-x-1">
                            <i className="fas fa-shopping-cart text-lg"></i>
                        </NavLink>
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-accent text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </div>
                </nav>

                {/* Mobile: Cart + Hamburger */}
                <div className="lg:hidden flex items-center gap-3">
                    <ThemeSwitcher />
                    <div className="relative">
                        <NavLink to="/cart" className="text-white" onClick={closeMobile}>
                            <i className="fas fa-shopping-cart text-lg"></i>
                        </NavLink>
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-accent text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </div>
                    <button className="text-white focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <span className="text-2xl">
                            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                        </span>
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <nav className="flex flex-col items-center bg-primary text-white py-4 space-y-3 lg:hidden shadow-lg">
                    <NavLink to="/" onClick={closeMobile} className={navLinkClass}>Home</NavLink>
                    <NavLink to="/products" onClick={closeMobile} className={navLinkClass}>Products</NavLink>

                    {currentUser && (userRole === 'seller' || userRole === 'admin') && (
                        <NavLink to="/seller-dashboard" onClick={closeMobile} className={navLinkClass}>
                            Seller Dashboard
                        </NavLink>
                    )}
                    {currentUser && userRole === 'admin' && (
                        <NavLink to="/admin-dashboard" onClick={closeMobile} className={navLinkClass}>
                            Admin Dashboard
                        </NavLink>
                    )}

                    <NavLink to="/about-us" onClick={closeMobile} className={navLinkClass}>About Us</NavLink>
                    <NavLink to="/contact" onClick={closeMobile} className={navLinkClass}>Contact</NavLink>

                    {!currentUser ? (
                        <>
                            <NavLink to="/login" onClick={closeMobile} className={navLinkClass}>Login</NavLink>
                            <NavLink to="/register" onClick={closeMobile} className={navLinkClass}>Register</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/profile" onClick={closeMobile} className={navLinkClass}>
                                <i className="fas fa-user mr-2"></i>My Profile
                            </NavLink>
                            <NavLink to="/orders" onClick={closeMobile} className={navLinkClass}>
                                <i className="fas fa-box mr-2"></i>My Orders
                            </NavLink>
                            <button onClick={handleLogout} className="hover:text-accent text-red-200">
                                <i className="fas fa-sign-out-alt mr-2"></i>Logout
                            </button>
                        </>
                    )}
                </nav>
            )}
        </div>
    );
};

export default NavBar;
