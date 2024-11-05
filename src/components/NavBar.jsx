import {useState} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';

const NavBar = () => {
    const navigate = useNavigate();
    const itemCount = useSelector((state) => state.cart.itemCount);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
    const handleNavigation = (path) => {
        //navigate to the specified path
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    return (
        <div>
            {/* Header */}
            <header className="bg-primary text-white p-4 flex justify-between items-center">
                <h1 onClick={() => handleNavigation('/')} className="text-2xl font-bold flex items-center cursor-pointer">
                    <img src="gaif_logo.jpeg" alt="AgriMarket Logo" className="h-16 bg-white rounded-full w-16 mr-2" />
                    <span className='hidden md:inline'>
                    Ganga Agri Innovation Foundation
                    </span>
                    <span className='md:hidden inline '>
                    GAIF
                    </span>
                </h1>

                {/* Desktop Nav Links */}
                <nav className="hidden md:flex space-x-4 items-center">
                    <NavLink to="/" className={({ isActive }) => isActive ? "text-accent font-bold" : "hover:text-accent"}>
                        Home
                    </NavLink>
                    <NavLink to="/products" className={({ isActive }) => isActive ? "text-accent font-bold" : "hover:text-accent"}>
                        Products
                    </NavLink>
                    <NavLink to="/register" className={({ isActive }) => isActive ? "text-accent font-bold" : "hover:text-accent"}>
                        Register
                    </NavLink>
                    <NavLink to="/about-us" className={({ isActive }) => isActive ? "text-accent font-bold" : "hover:text-accent"}>
                        About Us
                    </NavLink>
                    <NavLink to="/contact" className={({ isActive }) => isActive ? "text-accent font-bold" : "hover:text-accent"}>
                        Contact
                    </NavLink>
                    <NavLink to="/seller-login" className={({ isActive }) => isActive ? "text-accent font-bold" : "hover:text-accent"}>
                        Seller Login
                    </NavLink>
                    <div className="relative">
                        <NavLink to="/cart" className="hover:text-accent flex items-center space-x-2">
                            <i className="fas fa-shopping-cart"></i>
                            <span>Cart</span>
                        </NavLink>
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-accent text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <span className="text-2xl"> <i className="fas fa-times" aria-hidden="true"></i></span> : <span className="text-2xl"> <i className="fas fa-bars" aria-hidden="true"></i></span>}
                </button>
            </header>

            {/* Mobile Nav Links */}
            {isMobileMenuOpen && (
                <nav className="flex flex-col items-center bg-primary text-white py-4 space-y-2 md:hidden">
                    <NavLink to="/" onClick={() => handleNavigation('/')} className="hover:text-accent">
                        Home
                    </NavLink>
                    <NavLink to="/products" onClick={() => handleNavigation('/products')} className="hover:text-accent">
                        Products
                    </NavLink>
                    <NavLink to="/register" onClick={() => handleNavigation('/register')} className="hover:text-accent">
                        Register
                    </NavLink>
                    <NavLink to="/about-us" onClick={() => handleNavigation('/about-us')} className="hover:text-accent">
                        About Us
                    </NavLink>
                    <NavLink to="/contact" onClick={() => handleNavigation('/contact')} className="hover:text-accent">
                        Contact
                    </NavLink>
                    <NavLink to="/seller-login" onClick={() => handleNavigation('/seller-login')} className="hover:text-accent">
                        Seller Login
                    </NavLink>
                    <NavLink to="/cart" onClick={() => handleNavigation('/cart')} className="hover:text-accent flex items-center">
                        <i className="fas fa-shopping-cart mr-2"></i> Cart
                        {itemCount > 0 && (
                            <span className="ml-2 bg-accent text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </NavLink>
                </nav>
            )}
        </div>
    )
}

export default NavBar