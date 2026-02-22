import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrdersBySeller, updateOrderStatus } from '../services/db';

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
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            await loadOrders();
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("Failed to update order status.");
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
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
                    <p className="text-sm text-gray-600">Pending</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'confirmed').length}</p>
                    <p className="text-sm text-gray-600">Confirmed</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">{orders.filter(o => o.status === 'shipped').length}</p>
                    <p className="text-sm text-gray-600">Shipped</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
                    <p className="text-sm text-gray-600">Delivered</p>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-10 text-center">
                    <p className="text-gray-500">No orders found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => {
                        const nextStatus = getNextStatus(order.status);
                        return (
                            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex flex-wrap justify-between items-start mb-4">
                                    <div>
                                        <p className="font-semibold">Order #{order.id.slice(-8).toUpperCase()}</p>
                                        <p className="text-sm text-gray-500">Buyer: {order.buyerEmail}</p>
                                        <p className="text-xs text-gray-400">
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
                                    <div className="text-sm text-gray-500 mb-4 p-3 bg-gray-50 rounded">
                                        <p className="font-medium text-gray-700">Ship to:</p>
                                        <p>{order.shippingAddress.fullName}, {order.shippingAddress.phone}</p>
                                        <p>{order.shippingAddress.address}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                    </div>
                                )}

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
