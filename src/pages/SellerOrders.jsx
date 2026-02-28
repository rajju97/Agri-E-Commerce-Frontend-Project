import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrdersBySeller, updateOrderStatus } from '../services/db';
import Notification from '../components/Notification';

const statusColors = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    shipped: 'badge-primary',
    delivered: 'badge-success',
    cancelled: 'badge-error',
};

const statusFlow = ['pending', 'confirmed', 'shipped', 'delivered'];

const SellerOrders = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        loadOrders();
    }, [currentUser]);

    const loadOrders = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await getOrdersBySeller(currentUser.uid);
            data.sort((a, b) => {
                const aTime = a.createdAt?.seconds || 0;
                const bTime = b.createdAt?.seconds || 0;
                return bTime - aTime;
            });
            setOrders(data);
        } catch (error) {
            console.error("Error loading seller orders:", error);
            setNotification({ message: 'Failed to load orders.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus, currentUser.uid);
            setNotification({ message: `Order status updated to ${newStatus}.`, type: 'success' });
            await loadOrders();
        } catch (error) {
            console.error("Error updating order status:", error);
            setNotification({ message: 'Failed to update order status.', type: 'error' });
        }
    };

    const getNextStatus = (currentStatus) => {
        const currentIndex = statusFlow.indexOf(currentStatus);
        if (currentIndex < statusFlow.length - 1) {
            return statusFlow[currentIndex + 1];
        }
        return null;
    };

    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    if (loading) return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <Notification message={notification.message} type={notification.type} />
            <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-ghost'}`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        {status !== 'all' && (
                            <span className="ml-1 badge badge-sm">{orders.filter(o => o.status === status).length}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
                    <p className="text-sm text-base-content/60">Pending</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'confirmed').length}</p>
                    <p className="text-sm text-base-content/60">Confirmed</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">{orders.filter(o => o.status === 'shipped').length}</p>
                    <p className="text-sm text-base-content/60">Shipped</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
                    <p className="text-sm text-base-content/60">Delivered</p>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="bg-base-100 rounded-lg shadow-md p-10 text-center">
                    <p className="text-base-content/60">No orders found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => {
                        const nextStatus = getNextStatus(order.status);
                        return (
                            <div key={order.id} className="bg-base-100 rounded-lg shadow-md p-6">
                                <div className="flex flex-wrap justify-between items-start mb-4">
                                    <div>
                                        <p className="font-semibold">Order #{order.id.slice(-8).toUpperCase()}</p>
                                        <p className="text-sm text-base-content/60">Buyer: {order.buyerEmail}</p>
                                        <p className="text-xs text-base-content/40">
                                            {order.createdAt?.seconds
                                                ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })
                                                : 'Processing...'}
                                        </p>
                                    </div>
                                    <span className={`badge ${statusColors[order.status] || 'badge-ghost'} text-white`}>
                                        {order.status?.toUpperCase()}
                                    </span>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-2 mb-4">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-sm">
                                            <img src={item.images?.[0] || item.image || 'product-jpeg-500x500.webp'} alt={item.name} className="w-10 h-10 object-cover rounded" />
                                            <span className="flex-1">{item.name} x{item.quantity}</span>
                                            <span className="font-semibold">&#8377;{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Shipping Info */}
                                {order.shippingAddress && (
                                    <div className="text-sm text-base-content/60 mb-4 p-3 bg-base-200 rounded">
                                        <p className="font-medium text-base-content">Ship to:</p>
                                        <p>{order.shippingAddress.fullName}, {order.shippingAddress.phone}</p>
                                        <p>{order.shippingAddress.address}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                    </div>
                                )}

                                <div className="text-sm text-base-content/60 mb-4 p-3 bg-base-200 rounded">
                                    <p className="font-medium text-base-content flex items-center gap-2">
                                        Payment: {order.paymentMethod === 'online' ? 'Online' : 'Cash on Delivery'}
                                        {order.paymentStatus === 'paid' && (
                                            <span className="badge badge-success badge-sm text-white">Paid</span>
                                        )}
                                    </p>
                                    {order.paymentId && (
                                        <p className="text-xs text-base-content/40 mt-1">Txn: {order.paymentId}</p>
                                    )}
                                </div>

                                <div className="flex flex-wrap justify-between items-center">
                                    <p className="text-lg font-bold text-primary">Total: &#8377;{order.total?.toFixed(2)}</p>
                                    <div className="flex gap-2">
                                        {nextStatus && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, nextStatus)}
                                                className="btn btn-sm btn-primary"
                                            >
                                                Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                                            </button>
                                        )}
                                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                                className="btn btn-sm btn-error text-white"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SellerOrders;
