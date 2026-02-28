import { useState, useEffect } from 'react';
import { getProducts, getAllUsers, getAllOrders, deleteProduct, deleteUser, updateOrderStatus } from '../services/db';
import Notification from '../components/Notification';
import ConfirmationModal from '../components/ConfirmationModal';

const statusColors = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    shipped: 'badge-primary',
    delivered: 'badge-success',
    cancelled: 'badge-error',
};

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [modalData, setModalData] = useState({ title: '', message: '', onConfirm: null, id: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, usersData, ordersData] = await Promise.all([
        getProducts(),
        getAllUsers(),
        getAllOrders(),
      ]);
      setProducts(productsData);
      setUsers(usersData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading admin data:", error);
      setNotification({ message: 'Failed to load data.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleProductDelete = (id) => {
    setModalData({
        title: 'Delete Product',
        message: 'Are you sure you want to delete this product? This action cannot be undone.',
        onConfirm: () => confirmProductDelete(id),
        id: 'product-delete-modal'
    });
    document.getElementById('product-delete-modal').showModal();
  };

  const confirmProductDelete = async (id) => {
    try {
      await deleteProduct(id);
      setNotification({ message: 'Product deleted successfully.', type: 'success' });
      loadData();
    } catch (e) {
      console.error(e);
      setNotification({ message: 'Failed to delete product.', type: 'error' });
    }
  };

  const handleUserDelete = (id) => {
    setModalData({
        title: 'Delete User',
        message: 'Are you sure you want to delete this user? This action cannot be undone.',
        onConfirm: () => confirmUserDelete(id),
        id: 'user-delete-modal'
    });
    document.getElementById('user-delete-modal').showModal();
  };

  const confirmUserDelete = async (id) => {
    try {
      await deleteUser(id);
      setNotification({ message: 'User deleted successfully.', type: 'success' });
      loadData();
    } catch (e) {
      console.error(e);
      setNotification({ message: 'Failed to delete user.', type: 'error' });
    }
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setNotification({ message: `Order status updated to ${status}.`, type: 'success' });
      loadData();
    } catch (e) {
      console.error(e);
      setNotification({ message: 'Failed to update order.', type: 'error' });
    }
  };

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + (o.total || 0), 0);
  const sellers = users.filter(u => u.role === 'seller');

  if (loading) return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="container mx-auto p-4">
        <Notification message={notification.message} type={notification.type} />
        <ConfirmationModal {...modalData} />
        <ConfirmationModal id="user-delete-modal" title={modalData.title} message={modalData.message} onConfirm={modalData.onConfirm} />

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-base-100 p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-blue-600">{users.length}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>
        <div className="bg-base-100 p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-purple-600">{sellers.length}</p>
          <p className="text-sm text-gray-500">Sellers</p>
        </div>
        <div className="bg-base-100 p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-primary">{products.length}</p>
          <p className="text-sm text-gray-500">Products</p>
        </div>
        <div className="bg-base-100 p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-yellow-600">{orders.length}</p>
          <p className="text-sm text-gray-500">Orders</p>
        </div>
        <div className="bg-base-100 p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-green-600">&#8377;{totalRevenue.toFixed(0)}</p>
          <p className="text-sm text-gray-500">Revenue</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6">
        {['overview', 'users', 'products', 'orders'].map(tab => (
          <a
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab ${activeTab === tab ? 'tab-active' : ''}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </a>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-base-100 p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {orders.slice(0, 10).map(order => (
                <div key={order.id} className="flex justify-between items-center p-3 border-b border-base-200 hover:bg-base-200">
                  <div>
                    <p className="font-semibold text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-500">{order.buyerEmail}</p>
                  </div>
                  <div className="text-right">
                    <span className={`badge badge-sm ${statusColors[order.status] || 'badge-ghost'}`}>
                      {order.status}
                    </span>
                    <p className="text-sm font-bold">&#8377;{order.total?.toFixed(0)}</p>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-gray-500 text-center py-4">No orders yet</p>}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-base-100 p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Users Overview</h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {users.slice(0, 10).map(user => (
                <div key={user.id} className="flex justify-between items-center p-3 border-b border-base-200 hover:bg-base-200">
                  <div className="overflow-hidden">
                    <p className="font-semibold truncate">{user.email}</p>
                    <p className="text-xs text-gray-500">Role: <span className="uppercase font-bold text-primary">{user.role}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-base-100 p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">All Users ({users.length})</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="hover">
                    <td className="truncate max-w-xs">{user.email}</td>
                    <td><span className="badge badge-primary badge-sm">{user.role?.toUpperCase()}</span></td>
                    <td>{user.mobile || user.phone || '-'}</td>
                    <td>
                      <button onClick={() => handleUserDelete(user.id)} className="btn btn-xs btn-error text-white">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="bg-base-100 p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">All Products ({products.length})</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Seller</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="hover">
                    <td><img src={product.images?.[0] || product.image || 'product-jpeg-500x500.webp'} alt={product.name} className="w-10 h-10 object-cover rounded" /></td>
                    <td className="truncate max-w-xs">{product.name}</td>
                    <td>&#8377;{product.price}</td>
                    <td>{product.quantity}</td>
                    <td className="text-xs truncate max-w-xs">{product.sellerEmail || 'Unknown'}</td>
                    <td>
                      <button onClick={() => handleProductDelete(product.id)} className="btn btn-xs btn-error text-white">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-base-100 p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">All Orders ({orders.length})</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {orders.map(order => (
              <div key={order.id} className="p-4 border-b border-base-200 hover:bg-base-200">
                <div className="flex flex-wrap justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-gray-500">Buyer: {order.buyerEmail}</p>
                    <p className="text-xs text-gray-400">
                      {order.createdAt?.seconds
                        ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-IN')
                        : 'Processing...'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${statusColors[order.status] || 'badge-ghost'}`}>
                      {order.status?.toUpperCase()}
                    </span>
                    <p className="text-lg font-bold mt-1">&#8377;{order.total?.toFixed(0)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleOrderStatusUpdate(order.id, status)}
                      disabled={order.status === status}
                      className={`btn btn-xs ${order.status === status ? 'btn-disabled' : 'btn-outline'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-gray-500 text-center py-4">No orders yet</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
