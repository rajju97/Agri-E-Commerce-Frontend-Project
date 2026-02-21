import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/db';
import { clearCart } from '../dispatchers';

const Checkout = () => {
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'cod',
    });
    const [placing, setPlacing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        setPlacing(true);

        try {
            // Group items by seller
            const sellerGroups = {};
            cartItems.forEach(item => {
                const sellerId = item.sellerId || 'unknown';
                if (!sellerGroups[sellerId]) {
                    sellerGroups[sellerId] = [];
                }
                sellerGroups[sellerId].push({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image || '',
                });
            });

            // Create separate orders per seller
            let lastOrderId = '';
            for (const [sellerId, items] of Object.entries(sellerGroups)) {
                const orderTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const orderRef = await createOrder({
                    buyerId: currentUser.uid,
                    buyerEmail: currentUser.email,
                    sellerId,
                    items,
                    total: orderTotal,
                    shippingAddress: {
                        fullName: formData.fullName,
                        phone: formData.phone,
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                    },
                    paymentMethod: formData.paymentMethod,
                });
                lastOrderId = orderRef.id;
            }

            setOrderId(lastOrderId);
            setOrderPlaced(true);
            dispatch(clearCart());
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setPlacing(false);
        }
    };

    if (cartItems.length === 0 && !orderPlaced) {
        navigate('/cart');
        return null;
    }

    if (orderPlaced) {
        return (
            <div className="container mx-auto p-4 max-w-2xl">
                <div className="bg-white rounded-lg shadow-md p-10 text-center">
                    <div className="text-green-500 text-6xl mb-4">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
                    <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
                    <p className="text-sm text-gray-400 mb-6">Order ID: {orderId}</p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={() => navigate('/orders')} className="btn btn-primary">
                            View My Orders
                        </button>
                        <button onClick={() => navigate('/products')} className="btn btn-ghost">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            <form onSubmit={handlePlaceOrder}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Shipping Form */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input
                                    type="text" name="fullName" value={formData.fullName}
                                    onChange={handleChange} required
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Phone Number</label>
                                <input
                                    type="tel" name="phone" value={formData.phone}
                                    onChange={handleChange} required
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <textarea
                                    name="address" value={formData.address}
                                    onChange={handleChange} required
                                    className="textarea textarea-bordered w-full" rows="2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">City</label>
                                <input
                                    type="text" name="city" value={formData.city}
                                    onChange={handleChange} required
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">State</label>
                                <input
                                    type="text" name="state" value={formData.state}
                                    onChange={handleChange} required
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Pincode</label>
                                <input
                                    type="text" name="pincode" value={formData.pincode}
                                    onChange={handleChange} required
                                    className="input input-bordered w-full"
                                />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold mt-6 mb-4">Payment Method</h2>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="paymentMethod" value="cod"
                                    checked={formData.paymentMethod === 'cod'}
                                    onChange={handleChange}
                                    className="radio radio-primary" />
                                <span><i className="fas fa-money-bill-wave mr-2"></i> Cash on Delivery</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="paymentMethod" value="upi"
                                    checked={formData.paymentMethod === 'upi'}
                                    onChange={handleChange}
                                    className="radio radio-primary" />
                                <span><i className="fas fa-mobile-alt mr-2"></i> UPI Payment</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="paymentMethod" value="card"
                                    checked={formData.paymentMethod === 'card'}
                                    onChange={handleChange}
                                    className="radio radio-primary" />
                                <span><i className="fas fa-credit-card mr-2"></i> Credit / Debit Card</span>
                            </label>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="truncate flex-1">{item.name} x{item.quantity}</span>
                                    <span className="ml-2 font-semibold">&#8377;{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="divider my-2"></div>

                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>&#8377; {totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Shipping</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="divider my-2"></div>
                        <div className="flex justify-between font-bold text-lg mb-4">
                            <span>Total</span>
                            <span className="text-primary">&#8377; {totalPrice.toFixed(2)}</span>
                        </div>

                        <button type="submit" disabled={placing} className="btn btn-primary w-full">
                            {placing ? (
                                <><span className="loading loading-spinner loading-sm"></span> Placing Order...</>
                            ) : (
                                'Place Order'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
