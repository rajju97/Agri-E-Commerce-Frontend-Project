import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProducts, addProduct, deleteProduct, updateProduct, getOrdersBySeller } from '../services/db';
import { generateProductDescription, generateProductImage } from '../services/ai';
import Notification from '../components/Notification';
import ConfirmationModal from '../components/ConfirmationModal';

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
  const [imageUrlInput, setImageUrlInput] = useState('');
  const fileInputRef = useRef(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [modalData, setModalData] = useState({ title: '', message: '', onConfirm: null, id: '' });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    images: [],
    quantity: 0,
    category: 'Other',
  });

  const categories = ['Fertilizers', 'Seeds', 'Grains', 'Compost', 'Tools', 'RCQ', 'Other'];

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
      setNotification({ message: 'Failed to load data.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerateDesc = async () => {
    if (!formData.name) return setNotification({ message: 'Please enter a product name first.', type: 'warning' });
    setGenerating(true); setGenType('desc');
    try {
      const desc = await generateProductDescription(`Write a short, engaging product description for: ${formData.name}. Keep it under 100 words.`);
      setFormData(prev => ({ ...prev, description: desc }));
      setNotification({ message: 'AI description generated!', type: 'success' });
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Failed to generate description.', type: 'error' });
    } finally {
      setGenerating(false); setGenType(null);
    }
  };

  const handleGenerateImage = async () => {
    if (!formData.name) return setNotification({ message: 'Please enter a product name first.', type: 'warning' });
    setGenerating(true); setGenType('image');
    try {
      const imageUrl = await generateProductImage(`High quality, organic, fresh ${formData.name}`);
      setFormData(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
      setNotification({ message: 'AI image generated!', type: 'success' });
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Failed to generate image.', type: 'error' });
    } finally {
      setGenerating(false); setGenType(null);
    }
  };

  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;
    const maxImages = 5;

    const remaining = maxImages - formData.images.length;
    if (files.length > remaining) {
      setNotification({ message: `You can add up to ${maxImages} images. You have ${remaining} slot(s) remaining.`, type: 'warning' });
      return;
    }

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setNotification({ message: `"${file.name}" is not a valid image file.`, type: 'error' });
        return;
      }
      if (file.size > maxSize) {
        setNotification({ message: `"${file.name}" exceeds the 5MB size limit.`, type: 'error' });
        return;
      }
    }

    setUploading(true);
    try {
      const compressedImages = [];
      for (const file of files) {
        const dataUrl = await compressImage(file);
        compressedImages.push(dataUrl);
      }
      setFormData(prev => ({ ...prev, images: [...prev.images, ...compressedImages] }));
    } catch (error) {
      console.error('Image processing failed:', error);
      setNotification({ message: 'Failed to process image. Please try again.', type: 'error' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    if (formData.images.length >= 5) {
      setNotification({ message: 'Maximum 5 images allowed.', type: 'warning' });
      return;
    }
    try {
      new URL(url);
    } catch {
      setNotification({ message: 'Please enter a valid URL.', type: 'error' });
      return;
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
        setNotification({ message: 'You must be logged in to add products. Please log in again.', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        images: formData.images,
        image: formData.images[0] || '',
        category: formData.category,
      };

      if (editingId) {
        await updateProduct(editingId, productData);
        setNotification({ message: 'Product updated successfully!', type: 'success' });
        setEditingId(null);
      } else {
        await addProduct({
          ...productData,
          sellerId: currentUser.uid,
          sellerEmail: currentUser.email,
        });
        setNotification({ message: 'Product added successfully!', type: 'success' });
      }
      setFormData({ name: '', description: '', price: '', images: [], quantity: 0, category: 'Other' });
      setImageUrlInput('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadData();
    } catch (error) {
      console.error("Failed to save product:", error);
      setNotification({ message: `Failed to save product: ${error.message}` , type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    const images = product.images && product.images.length > 0
      ? product.images
      : product.image ? [product.image] : [];
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      images,
      quantity: product.quantity || 0,
      category: product.category || 'Other',
    });
    setImageUrlInput('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', images: [], quantity: 0, category: 'Other' });
    setImageUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (id) => {
    setModalData({
        title: 'Delete Product',
        message: 'Are you sure you want to delete this product? This action cannot be undone.',
        onConfirm: () => confirmDelete(id),
        id: 'product-delete-modal'
    });
    document.getElementById('product-delete-modal').showModal();
  };

  const confirmDelete = async (id) => {
    try {
      await deleteProduct(id);
      setNotification({ message: 'Product deleted.', type: 'success' });
      loadData();
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Failed to delete product.', type: 'error' });
    }
  }

  // Stats
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="container mx-auto p-4">
        <Notification message={notification.message} type={notification.type} />
        <ConfirmationModal {...modalData} />

      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <button onClick={() => navigate('/seller-orders')} className="btn btn-primary btn-sm">
          <i className="fas fa-box mr-2"></i> Manage Orders
          {pendingOrders > 0 && <span className="badge badge-warning ml-2">{pendingOrders}</span>}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-base-100 p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-primary">{products.length}</p>
          <p className="text-sm text-base-content/60">Products</p>
        </div>
        <div className="bg-base-100 p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
          <p className="text-sm text-base-content/60">Total Orders</p>
        </div>
        <div className="bg-base-100 p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
          <p className="text-sm text-base-content/60">Pending</p>
        </div>
        <div className="bg-base-100 p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-green-600">&#8377;{totalRevenue.toFixed(0)}</p>
          <p className="text-sm text-base-content/60">Revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add/Edit Product Form */}
        <div className="bg-base-100 p-6 rounded shadow-md h-fit">
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
              <label className="block text-sm font-medium mb-1">Product Images <span className="text-xs text-base-content/60 font-normal">({formData.images.length}/5)</span></label>
              <div className="flex flex-wrap gap-2 mb-2">
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || formData.images.length >= 5}
                  className="btn btn-sm btn-outline btn-primary">
                  <i className="fas fa-upload mr-1"></i>
                  {uploading ? 'Processing...' : 'Upload Images'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                  multiple
                />
              </div>
              <div className="flex gap-2 mb-2">
                <input type="text" value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                  className="input input-bordered input-sm flex-1"
                  placeholder="Or paste image URL here..." />
                <button type="button" onClick={handleAddImageUrl}
                  className="btn btn-sm btn-outline btn-primary">Add</button>
              </div>

              {/* Image Previews */}
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img src={url} alt={`Image ${index + 1}`}
                        className="h-24 w-24 object-cover rounded border" />
                      <button type="button" onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <i className="fas fa-times text-xs"></i>
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-primary text-white text-[10px] text-center py-0.5 rounded-b">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {formData.images.length === 0 && (
                <p className="text-xs text-base-content/60 mt-1">No images added. Upload files or paste URLs.</p>
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
        <div className="bg-base-100 p-6 rounded shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">Your Products ({products.length})</h2>
          {loading ? <div className="flex justify-center items-center"><span className="loading loading-spinner loading-lg"></span></div> : (
            products.length === 0 ? <p className="text-base-content/60">No products added yet.</p> : (
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {products.map(product => {
                  const displayImage = product.images?.[0] || product.image || 'product-jpeg-500x500.webp';
                  const imageCount = product.images?.length || (product.image ? 1 : 0);
                  return (
                    <div key={product.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border border-base-200 rounded shadow-sm hover:bg-base-200 gap-4">
                      <div className="flex items-center gap-4 w-full">
                        <div className="relative">
                          <img src={displayImage} alt={product.name}
                            className="w-16 h-16 object-cover rounded" />
                          {imageCount > 1 && (
                            <span className="absolute -top-1 -right-1 badge badge-xs badge-primary">{imageCount}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-base-content/60 line-clamp-1">{product.description}</p>
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
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
