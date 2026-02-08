import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProducts, addProduct, deleteProduct } from '../services/db';
import { generateProductDescription, generateProductImage } from '../services/ai';

const SellerDashboard = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genType, setGenType] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    quantity: 0
  });

  // Load Products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(currentUser.uid);
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadProducts();
    }
  }, [currentUser]);

  // Helper for manual reload (e.g. after add/delete)
  const reloadProducts = async () => {
    if (currentUser) {
        setLoading(true);
        try {
          const data = await getProducts(currentUser.uid);
          setProducts(data);
        } catch (error) {
          console.error("Error reloading products:", error);
        } finally {
          setLoading(false);
        }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerateDesc = async () => {
    if (!formData.name) return alert("Please enter a product name first.");
    setGenerating(true); setGenType('desc');
    try {
        const desc = await generateProductDescription(`Write a short, engaging product description for: ${formData.name}. Keep it under 100 words.`);
        setFormData(prev => ({ ...prev, description: desc }));
    } catch (error) {
        console.error(error);
        alert("Failed to generate description.");
    } finally {
        setGenerating(false); setGenType(null);
    }
  };

  const handleGenerateImage = async () => {
    if (!formData.name) return alert("Please enter a product name first.");
    setGenerating(true); setGenType('image');
    try {
        const imageUrl = await generateProductImage(`High quality, organic, fresh ${formData.name}`);
        setFormData(prev => ({ ...prev, image: imageUrl }));
    } catch (error) {
        console.error(error);
        alert("Failed to generate image.");
    } finally {
        setGenerating(false); setGenType(null);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
        await addProduct({
            ...formData,
            price: Number(formData.price),
            quantity: Number(formData.quantity),
            sellerId: currentUser.uid,
            sellerEmail: currentUser.email
        });
        alert("Product added successfully!");
        setFormData({ name: '', description: '', price: '', image: '', quantity: 0 });
        reloadProducts();
    } catch (error) {
        console.error(error);
        alert("Failed to add product.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
        try {
            await deleteProduct(id);
            reloadProducts();
        } catch (error) {
            console.error(error);
            alert("Failed to delete product.");
        }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Add Product Form */}
        <div className="bg-white p-6 rounded shadow-md h-fit">
           <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
           <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                {/* AI Buttons Row */}
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={handleGenerateDesc}
                        disabled={generating}
                        className="btn btn-sm btn-accent text-white"
                    >
                        {generating && genType==='desc' ? 'Generating...' : 'Generate Description (Gemini)'}
                    </button>
                    <button
                        type="button"
                        onClick={handleGenerateImage}
                        disabled={generating}
                        className="btn btn-sm btn-secondary text-white"
                    >
                        {generating && genType==='image' ? 'Generating...' : 'Generate Image (AI)'}
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="textarea textarea-bordered w-full"
                        required
                        rows="3"
                    ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">Image URL</label>
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        placeholder="https://..."
                    />
                    {formData.image && (
                        <img
                            src={formData.image}
                            alt="Preview"
                            className="mt-2 h-32 w-32 object-cover rounded border"
                        />
                    )}
                </div>

                <button type="submit" className="btn btn-primary w-full">Add Product</button>
            </form>
        </div>

        {/* Product List */}
        <div className="bg-white p-6 rounded shadow-md h-fit">
           <h2 className="text-xl font-semibold mb-4">Your Products</h2>
           {loading ? <p>Loading...</p> : (
               products.length === 0 ? <p className="text-gray-500">No products added yet.</p> : (
                   <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                       {products.map(product => (
                           <div key={product.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded shadow-sm hover:bg-gray-50 gap-4">
                               <div className="flex items-center gap-4 w-full">
                                   <img
                                       src={product.image || 'https://placehold.co/100'}
                                       alt={product.name}
                                       className="w-16 h-16 object-cover rounded"
                                   />
                                   <div className="flex-1">
                                       <h3 className="font-semibold">{product.name}</h3>
                                       <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                                       <p className="text-sm font-bold mt-1">₹{product.price} | Qty: {product.quantity}</p>
                                   </div>
                               </div>
                               <button
                                   onClick={() => handleDelete(product.id)}
                                   className="btn btn-sm btn-error text-white whitespace-nowrap"
                               >
                                   Delete
                               </button>
                           </div>
                       ))}
                   </div>
               )
           )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
