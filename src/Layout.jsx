import { useState } from "react";
import { useNavigate, NavLink } from 'react-router-dom';

export default function Layout() {
    const [activeCategory, setActiveCategory] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    const categories = [
        { name: "Fertilizers", description: "Improve soil fertility naturally." },
        { name: "Seeds", description: "High-quality seeds for all types of crops." },
        { name: "Grains", description: "Organic grains for consumption and sowing." },
        { name: "Compost", description: "Compost for enhancing soil nutrients." },
    ];

    const handleCategoryClick = (categoryName) => {
        setActiveCategory(categoryName === activeCategory ? null : categoryName);
    };

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        //navigate to the specified path
        navigate(path);
    };

    return (
        <div className="bg-cream min-h-screen text-soil">
            {/* Header */}
            <header className="bg-primary text-white p-2 flex justify-between items-center">
                <h1 onClick={()=>handleNavigation('/')} className="text-2xl font-bold flex items-center cursor-pointer">
                    <img src="/project.svg" alt="AgriMarket Logo" className="h-16 bg-white rounded-full w-16 mr-2" />
                    AgriMarket
                </h1>
                <nav className="space-x-4 flex items-center">
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? "text-accent font-bold" : "hover:text-accent"}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/products"
                        className={({ isActive }) => isActive ? "text-accent font-bold" : "hover:text-accent"}
                    >
                        Products
                    </NavLink>
                    <NavLink
                        to="/register"
                        className={({ isActive }) => isActive ? "text-accent font-bold" : "hover:text-accent"}
                    >
                        Register
                    </NavLink>
                    <NavLink
                        to="/about-us"
                        className={({ isActive }) => isActive ? "text-accent font-bold" : "hover:text-accent"}
                    >
                        About Us
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) => isActive ? "text-accent font-bold" : "hover:text-accent"}
                    >
                        Contact
                    </NavLink>
                    <NavLink
                        to="/seller-login"
                        className={({ isActive }) => isActive ? "text-accent font-bold" : "hover:text-accent"}
                    >
                        Seller Login
                    </NavLink>
                    {/* Cart with Icon and Badge */}
                    <div className="relative">
                        <NavLink to="/cart" className="hover:text-accent flex items-center space-x-2">
                            <i className="fas fa-shopping-cart"></i> {/* Font Awesome Cart Icon */}
                            <span>Cart</span>
                        </NavLink>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-accent text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </nav>
            </header>

            {/* Banner Section */}
            <section className="bg-accent text-white p-10 text-center">
                <h2 className="text-3xl font-bold mb-4">Fresh From the Farm</h2>
                <p className="mb-6">High-quality organic products for a sustainable future.</p>
                <button className="bg-primary hover:bg-darkGreen text-white px-6 py-2 rounded">Shop Now</button>
            </section>

            {/* Categories Section */}
            <section className="p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Categories</h2>
                <div className="flex justify-around flex-wrap gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            className="relative bg-white p-4 rounded shadow-lg w-40 text-center cursor-pointer"
                            onMouseEnter={() => handleCategoryClick(category.name)}
                            onMouseLeave={() => handleCategoryClick(null)}
                        >
                            <h3 className="text-lg font-semibold">{category.name}</h3>

                            {/* Popover */}
                            {activeCategory === category.name && (
                                <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-300 rounded shadow-lg p-4">
                                    <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-gray-300"></div>
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white"></div>

                                    <p>{category.description}</p>
                                    <button
                                        className="mt-2 text-sm text-primary hover:underline"
                                        onClick={() => alert(`Navigate to ${category.name} page`)}
                                    >
                                        View More
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Product Listing Section */}
            <section className="p-6 bg-sand">
                <h2 className="text-2xl font-bold text-center mb-6">Featured Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Sample Product Card */}
                    <div className="bg-white p-4 rounded shadow-lg">
                        <img src="sample-product.jpg" alt="Product" className="w-full h-32 object-cover mb-4 rounded" />
                        <h3 className="text-lg font-semibold">Organic Fertilizer</h3>
                        <p className="text-sm text-gray-700 mb-2">$12.99</p>
                        <button className="bg-accent text-white px-4 py-2 rounded hover:bg-primary">Add to Cart</button>
                    </div>
                    {/* Repeat Product Cards as Needed */}
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-primary text-white p-10">
                <h2 className="text-2xl font-bold text-center mb-6">Why Choose Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold">Eco-Friendly</h3>
                        <p>Sustainable and organic products for a healthy planet.</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-semibold">High Quality</h3>
                        <p>We prioritize quality in all our products for better yields.</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-semibold">Affordable Prices</h3>
                        <p>Competitive pricing for farmers and home gardeners alike.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-soil text-white p-4 text-center">
                <p>&copy; 2024 AgriMarket. All rights reserved.</p>
                <div className="space-x-4 mt-2">
                    <a href="#" className="hover:text-accent">Privacy Policy</a>
                    <a href="#" className="hover:text-accent">Terms of Service</a>
                </div>
            </footer>
        </div>
    );
}
