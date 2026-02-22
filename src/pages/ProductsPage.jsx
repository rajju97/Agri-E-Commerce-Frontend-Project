import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProducts } from '../services/db';
import { addItem } from '../dispatchers';

const ProductsPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name');

    const categories = ['all', 'Fertilizers', 'Seeds', 'Grains', 'Compost', 'Tools', 'Other'];

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleAddToCart = (product) => {
        dispatch(addItem({ ...product, quantity: 0 }));
        alert(`${product.name} added to cart!`);
    };

    const filteredProducts = products
        .filter(p => {
            const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' ||
                p.category?.toLowerCase() === selectedCategory.toLowerCase();
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low': return (a.price || 0) - (b.price || 0);
                case 'price-high': return (b.price || 0) - (a.price || 0);
                case 'name': return (a.name || '').localeCompare(b.name || '');
                default: return 0;
            }
        });

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">All Products</h1>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input input-bordered w-full pl-10"
                            />
                            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>

                    {/* Category */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="select select-bordered w-full"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat === 'all' ? 'All Categories' : cat}
                            </option>
                        ))}
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="select select-bordered w-full"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-500 mb-4">{filteredProducts.length} products found</p>

            {/* Products Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-md">
                    <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
                    <h2 className="text-xl text-gray-500">No products found</h2>
                    <p className="text-gray-400">Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg flex flex-col"
                        >
                            <img
                                src={product.images?.[0] || product.image || "product-jpeg-500x500.webp"}
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
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xl font-bold text-primary">&#8377;{product.price}</span>
                                        <span className={`text-xs ${product.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={!product.quantity || product.quantity <= 0}
                                        className="btn btn-primary btn-sm w-full"
                                    >
                                        <i className="fas fa-cart-plus mr-1"></i> Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
