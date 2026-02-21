import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { getProducts, addProduct, deleteProduct, updateProduct, getOrdersBySeller } from '../services/db';
import { generateProductDescription, generateProductImage } from '../services/ai';

const SellerDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genType, setGenType] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    quantity: 0,
    category: 'Other',
  });

  const categories = ['Fertilizers', 'Seeds', 'Grains', 'Compost', 'Tools', 'Other'];

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, ordersData] = await Promise.all([
        getProducts(currentUser.uid),
        getOrdersBySeller(currentUser.uid),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, WebP, or GIF).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB.');
      return;
    }

    setUploading(true);
    try {
      const fileName = `products/${currentUser.uid}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, image: downloadURL }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You must be logged in to add products. Please log in again.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateProduct(editingId, {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
          image: formData.image,
          category: formData.category,
        });
        alert("Product updated!");
        setEditingId(null);
      } else {
        await addProduct({
          ...formData,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
          sellerId: currentUser.uid,
          sellerEmail: currentUser.email,
        });
        alert("Product added!");
      }
      setFormData({ name: '', description: '', price: '', image: '', quantity: 0, category: 'Other' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadData();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product. " + (error.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      image: product.image || '',
      quantity: product.quantity || 0,
      category: product.category || 'Other',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', image: '', quantity: 0, category: 'Other' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        loadData();
      } catch (error) {
        console.error(error);
        alert("Failed to delete product.");
      }
    }
  };

  // Stats
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <button onClick={() => navigate('/seller-orders')} className="btn btn-primary btn-sm">
          <i className="fas fa-box mr-2"></i> Manage Orders
          {pendingOrders > 0 && <span className="badge badge-warning ml-2">{pendingOrders}</span>}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-primary">{products.length}</p>
          <p className="text-sm text-gray-500">Products</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
          <p className="text-sm text-gray-500">Total Orders</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-green-600">&#8377;{totalRevenue.toFixed(0)}</p>
          <p className="text-sm text-gray-500">Revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add/Edit Product Form */}
        <div className="bg-white p-6 rounded shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Product Name</label>
              <input type="text" name="name" value={formData.name}
                onChange={handleInputChange} className="input input-bordered w-full" required />
            </div>

            <div>
              <label className="block text-sm font-medium">Category</label>
              <select name="category" value={formData.category}
                onChange={handleInputChange} className="select select-bordered w-full">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleGenerateDesc} disabled={generating}
                className="btn btn-sm btn-accent text-white">
                {generating && genType === 'desc' ? 'Generating...' : 'AI Description'}
              </button>
              <button type="button" onClick={handleGenerateImage} disabled={generating}
                className="btn btn-sm btn-secondary text-white">
                {generating && genType === 'image' ? 'Generating...' : 'AI Image'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea name="description" value={formData.description}
                onChange={handleInputChange} className="textarea textarea-bordered w-full"
                required rows="3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Price (&#8377;)</label>
                <input type="number" name="price" value={formData.price}
                  onChange={handleInputChange} className="input input-bordered w-full" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Quantity</label>
                <input type="number" name="quantity" value={formData.quantity}
                  onChange={handleInputChange} className="input input-bordered w-full" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Product Image</label>
              <div className="flex flex-wrap gap-2 mb-2">
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="btn btn-sm btn-outline btn-primary">
                  <i className="fas fa-upload mr-1"></i>
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <input type="text" name="image" value={formData.image}
                onChange={handleInputChange} className="input input-bordered w-full"
                placeholder="Or paste image URL here..." />
              {formData.image && (
                <img src={formData.image} alt="Preview"
                  className="mt-2 h-32 w-32 object-cover rounded border" />
              )}
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary flex-1" disabled={saving || uploading}>
                {saving ? <><span className="loading loading-spinner loading-sm mr-2"></span>Saving...</> :
                  editingId ? 'Update Product' : 'Add Product'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="btn btn-ghost">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product List */}
        <div className="bg-white p-6 rounded shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">Your Products ({products.length})</h2>
          {loading ? <p>Loading...</p> : (
            products.length === 0 ? <p className="text-gray-500">No products added yet.</p> : (
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {products.map(product => (
                  <div key={product.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded shadow-sm hover:bg-gray-50 gap-4">
                    <div className="flex items-center gap-4 w-full">
                      <img src={product.image || 'product-jpeg-500x500.webp'} alt={product.name}
                        className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                        <p className="text-sm font-bold mt-1">&#8377;{product.price} | Qty: {product.quantity}</p>
                        {product.category && (
                          <span className="badge badge-sm badge-ghost">{product.category}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)}
                        className="btn btn-sm btn-primary whitespace-nowrap">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(product.id)}
                        className="btn btn-sm btn-error text-white whitespace-nowrap">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
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
