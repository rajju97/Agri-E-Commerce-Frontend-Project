import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { addItem, removeItem } from "./dispatchers";
import { getProducts } from "./services/db";

export default function Layout() {
    const [activeCategory, setActiveCategory] = useState(null);
    const dispatch = useDispatch();
    const [productList, setProductList] = useState([]);

    const categories = [
        { name: "Fertilizers", description: "Improve soil fertility naturally." },
        { name: "Seeds", description: "High-quality seeds for all types of crops." },
        { name: "Grains", description: "Organic grains for consumption and sowing." },
        { name: "Compost", description: "Compost for enhancing soil nutrients." },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getProducts();
                // Initialize local UI state for cart interaction.
                // map DB 'quantity' to 'stock' and initialize 'quantity' (cart) to 0.
                const mappedProducts = products.map(p => ({
                    ...p,
                    stock: p.quantity,
                    quantity: 0
                }));
                setProductList(mappedProducts);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };
        fetchProducts();
    }, []);


    const handleCategoryClick = (categoryName) => {
        setActiveCategory(categoryName === activeCategory ? null : categoryName);
    };

    const addItemToCart = (product) => {
        setProductList((old) => old.map((item) => {
            if (item.id === product.id) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        }));
        dispatch(addItem(product));
    };

    const handleRemoveCart = (product) => {
        setProductList((old) => old.map((item) => {
            if (item.id === product.id) {
                const newQty = item.quantity - 1;
                return { ...item, quantity: newQty < 0 ? 0 : newQty };
            }
            return item;
        }));
        dispatch(removeItem(product));
    };


    return (
        <>
            {/* Banner Section */}
            <section className="bg-accent text-white p-10 flex flex-col md:flex-row items-center justify-center text-center md:text-left space-y-6 md:space-y-0">

                {/* Founder Image and Caption */}
                <div className="flex flex-col items-center md:items-start">
                    <div className="w-32 h-32 md:w-48 md:h-48 overflow-hidden rounded-full border-4 border-white mb-2">
                        <img src='founder.jpg' alt="Founder" className="w-full h-full object-cover" />
                    </div>
                    <i>Dr. Satyapal Singh</i>
                    <p className="text-sm md:text-base font-semibold">Founder and President of GAIF</p>
                </div>

                {/* Banner Text */}
                <div className="md:ml-6">
                    <h2 className="text-3xl font-bold mb-2">Fresh From the Farm</h2>
                    <p className="mb-4">High-quality organic products for a sustainable future.</p>
                    <button className="bg-primary hover:bg-darkGreen text-white px-6 py-2 rounded">Shop Now</button>
                </div>

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
                                <div className="absolute top-full z-10 mt-2 left-0 right-0 bg-white border border-gray-300 rounded shadow-lg p-4">
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
                    {productList && productList.length > 0 ? productList.map((product) => {
                        return (
                            <div key={product.id} className="bg-white p-4 rounded shadow-lg transform transition-transform duration-300 hover:scale-105 flex flex-col justify-between">
                                <div>
                                <img src={product.image || "product-jpeg-500x500.webp"} alt={product.name} className="w-full h-48 object-cover mb-4" />
                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                <p className="text-sm text-gray-700 mb-2"> &#8377; {product.price}</p>
                                </div>
                                <div className="relative">
                                <button onClick={() => addItemToCart(product)} className="bg-accent text-white px-4 py-2 rounded hover:bg-primary w-full">Add to Cart</button>
                                {/* Quantity Badge (Visible only if quantity > 0) */}
                                {product.quantity > 0 && (
                                    <div className="absolute -top-12 right-0 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                        {product.quantity}
                                    </div>
                                )}
                                {product.quantity > 0 && (
                                    <div onClick={() => handleRemoveCart(product)} className="absolute -top-12 right-8 bg-error text-white rounded-full w-6 h-6 flex items-center justify-center text-xs cursor-pointer">
                                        <span><i className="fas fa-trash" aria-hidden="true"></i></span>
                                    </div>
                                )}
                                </div>
                            </div>
                        )
                    }) : <p className="col-span-full text-center py-10">No products available. Log in as a Seller to add some!</p>}
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
                <p>&copy; 2024 Ganga Agri Innovation Foundation. All rights reserved.</p>
                <div className="space-x-4 mt-2">
                    <a href="#" className="hover:text-accent">Privacy Policy</a>
                    <a href="#" className="hover:text-accent">Terms of Service</a>
                </div>
            </footer>
        </>
    );
}
