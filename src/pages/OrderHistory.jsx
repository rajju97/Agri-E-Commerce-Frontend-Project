import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrdersByBuyer } from '../services/db';

const statusColors = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    shipped: 'badge-primary',
    delivered: 'badge-success',
    cancelled: 'badge-error',
};

const OrderHistory = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            if (!currentUser) return;
            setLoading(true);
            try {
                const data = await getOrdersByBuyer(currentUser.uid);
                // Sort by createdAt descending
                data.sort((a, b) => {
                    const aTime = a.createdAt?.seconds || 0;
                    const bTime = b.createdAt?.seconds || 0;
                    return bTime - aTime;
                });
                setOrders(data);
            } catch (error) {
                console.error("Error loading orders:", error);
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, [currentUser]);

    if (loading) return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-10 text-center">
                    <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
                    <h2 className="text-xl text-gray-500 mb-4">No orders yet</h2>
                    <button onClick={() => navigate('/products')} className="btn btn-primary">
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex flex-wrap justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order #{order.id.slice(-8).toUpperCase()}</p>
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

                            <div className="space-y-2">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <img
                                            src={item.image || 'product-jpeg-500x500.webp'}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity} x &#8377;{item.price}</p>
                                        </div>
                                        <p className="font-semibold">&#8377;{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="divider my-3"></div>

                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    <p className="flex items-center gap-2">
                                        Payment: {order.paymentMethod === 'online' ? 'Online' : 'Cash on Delivery'}
                                        {order.paymentStatus === 'paid' && (
                                            <span className="badge badge-success badge-sm text-white">Paid</span>
                                        )}
                                    </p>
                                    {order.paymentId && (
                                        <p className="text-xs text-gray-400">Txn: {order.paymentId}</p>
                                    )}
                                    {order.shippingAddress && (
                                        <p>Ship to: {order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                    )}
                                </div>
                                <p className="text-xl font-bold text-primary">&#8377; {order.total?.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
