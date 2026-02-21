import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addItem } from "./dispatchers";
import { getProducts } from "./services/db";

export default function Layout() {
    const [activeCategory, setActiveCategory] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        { name: "Fertilizers", icon: "fa-flask", description: "Improve soil fertility naturally." },
        { name: "Seeds", icon: "fa-seedling", description: "High-quality seeds for all types of crops." },
        { name: "Grains", icon: "fa-wheat-awn", description: "Organic grains for consumption and sowing." },
        { name: "Compost", icon: "fa-recycle", description: "Compost for enhancing soil nutrients." },
        { name: "Tools", icon: "fa-tools", description: "Essential farming tools and equipment." },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const products = await getProducts();
                setProductList(products);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        dispatch(addItem({ ...product, quantity: 0 }));
        alert(`${product.name} added to cart!`);
    };

    return (
        <>
            {/* Hero Banner */}
            <section
                className="relative bg-cover bg-center bg-no-repeat text-white py-24 px-6"
                style={{ backgroundImage: "url('https://media.istockphoto.com/id/2194044791/photo/young-green-sprouts-emerging-from-freshly-tilled-soil-at-sunrise-symbolizing-growth-new.jpg?s=612x612&w=0&k=20&c=9HrC8bQ38OPIVrBiqTNbu5j9zfY6k9rgyUKN1EabGVw=')" }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative container mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full border-4 border-white shadow-lg mb-3">
                            <img src="founder.jpg" alt="Founder" className="w-full h-full object-cover" />
                        </div>
                        <p className="italic text-sm">Dr. Satyapal Singh</p>
                        <p className="text-xs font-semibold opacity-80">Founder & President, GAIF</p>
                    </div>

                    <div className="text-center md:text-left max-w-lg">
                        <h2 className="text-4xl font-bold mb-3 drop-shadow-lg">Fresh From the Farm</h2>
                        <p className="text-lg mb-2 opacity-90 drop-shadow">
                            High-quality organic products for a sustainable future.
                            Direct from farmers to your doorstep.
                        </p>
                        <p className="text-sm mb-6 opacity-75 drop-shadow">
                            Join thousands of happy customers and farmers on our platform.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <button onClick={() => navigate('/products')} className="bg-primary hover:bg-darkGreen text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                <i className="fas fa-shopping-bag mr-2"></i>Shop Now
                            </button>
                            <button onClick={() => navigate('/register')} className="bg-white text-accent px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                <i className="fas fa-store mr-2"></i>Become a Seller
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-10 px-6">
                <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>
                <div className="flex justify-center flex-wrap gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            className="relative bg-white p-6 rounded-lg shadow-md w-44 text-center cursor-pointer hover:shadow-xl transition-shadow"
                            onMouseEnter={() => setActiveCategory(category.name)}
                            onMouseLeave={() => setActiveCategory(null)}
                            onClick={() => navigate('/products')}
                        >
                            <div className="text-primary text-3xl mb-3">
                                <i className={`fas ${category.icon}`}></i>
                            </div>
                            <h3 className="text-lg font-semibold">{category.name}</h3>

                            {activeCategory === category.name && (
                                <div className="absolute top-full z-10 mt-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                                    <p className="text-sm text-gray-600">{category.description}</p>
                                    <button className="mt-2 text-sm text-primary hover:underline font-medium">
                                        View More
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-10 px-6 bg-sand">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Featured Products</h2>
                        <button onClick={() => navigate('/products')} className="btn btn-sm btn-primary">
                            View All <i className="fas fa-arrow-right ml-1"></i>
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {productList.length > 0 ? productList.slice(0, 8).map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col">
                                    <img
                                        src={product.image || "product-jpeg-500x500.webp"}
                                        alt={product.name}
                                        className="w-full h-48 object-cover cursor-pointer"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    />
                                    <div className="p-4 flex flex-col flex-1">
                                        <h3
                                            className="text-lg font-semibold cursor-pointer hover:text-primary"
                                            onClick={() => navigate(`/product/${product.id}`)}
                                        >
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{product.description}</p>
                                        <div className="mt-auto">
                                            <p className="text-xl font-bold text-primary mb-3">&#8377; {product.price}</p>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="bg-accent text-white px-4 py-2 rounded hover:bg-primary w-full transition-colors"
                                            >
                                                <i className="fas fa-cart-plus mr-2"></i>Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="col-span-full text-center py-10 text-gray-500">
                                    No products available yet. Be the first seller to add products!
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-12 px-6">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: 'fa-user-plus', title: 'Register', desc: 'Create an account as a buyer or seller in seconds.' },
                            { icon: 'fa-search', title: 'Browse & Order', desc: 'Explore products from verified farmers and place your order.' },
                            { icon: 'fa-truck', title: 'Get Delivered', desc: 'Receive fresh products directly at your doorstep.' },
                        ].map((step, idx) => (
                            <div key={idx} className="text-center">
                                <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                    <i className={`fas ${step.icon}`}></i>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                <p className="text-gray-600">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-primary text-white py-12 px-6">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { icon: 'fa-leaf', title: 'Eco-Friendly', desc: 'Sustainable and organic products for a healthy planet.' },
                            { icon: 'fa-award', title: 'High Quality', desc: 'We prioritize quality in all our products.' },
                            { icon: 'fa-tags', title: 'Best Prices', desc: 'Direct from farmers means no middleman markup.' },
                            { icon: 'fa-truck', title: 'Fast Delivery', desc: 'Quick and reliable delivery to your doorstep.' },
                        ].map((feature, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-4xl mb-3"><i className={`fas ${feature.icon}`}></i></div>
                                <h3 className="text-xl font-semibold mb-1">{feature.title}</h3>
                                <p className="opacity-90 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA for Sellers */}
            <section className="py-12 px-6 bg-gray-50">
                <div className="container mx-auto text-center max-w-2xl">
                    <h2 className="text-3xl font-bold mb-4">Are You a Farmer?</h2>
                    <p className="text-gray-600 mb-6">
                        Join our platform and sell your products directly to thousands of customers.
                        No middlemen, better prices, and complete control over your business.
                    </p>
                    <button onClick={() => navigate('/register')} className="btn btn-primary btn-lg">
                        <i className="fas fa-store mr-2"></i> Start Selling Today
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-soil text-white py-8 px-6">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
                        <div>
                            <h3 className="font-bold text-lg mb-3">GAIF</h3>
                            <p className="text-sm opacity-80">
                                Ganga Agri Innovation Foundation - Empowering farmers through technology.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-3">Quick Links</h3>
                            <ul className="space-y-1 text-sm opacity-80">
                                <li><a href="/products" className="hover:text-accent">Products</a></li>
                                <li><a href="/about-us" className="hover:text-accent">About Us</a></li>
                                <li><a href="/contact" className="hover:text-accent">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-3">For Sellers</h3>
                            <ul className="space-y-1 text-sm opacity-80">
                                <li><a href="/register" className="hover:text-accent">Register as Seller</a></li>
                                <li><a href="/seller-dashboard" className="hover:text-accent">Seller Dashboard</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-3">Connect</h3>
                            <div className="flex gap-3">
                                {['facebook', 'twitter', 'instagram', 'youtube'].map(s => (
                                    <a key={s} href="#" className="hover:text-accent text-lg"><i className={`fab fa-${s}`}></i></a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/20 pt-4 text-center text-sm opacity-80">
                        <p>&copy; 2024 Ganga Agri Innovation Foundation. All rights reserved.</p>
                        <div className="space-x-4 mt-1">
                            <a href="#" className="hover:text-accent">Privacy Policy</a>
                            <a href="#" className="hover:text-accent">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
