import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addItem, removeItem, clearCart } from '../dispatchers';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const cartItems = useSelector((state) => state.cart.items);
    const itemCount = useSelector((state) => state.cart.itemCount);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleIncrease = (item) => {
        dispatch(addItem(item));
    };

    const handleDecrease = (item) => {
        dispatch(removeItem(item));
    };

    const handleClearCart = () => {
        if (confirm("Clear all items from cart?")) {
            dispatch(clearCart());
        }
    };

    const handleCheckout = () => {
        if (!currentUser) {
            alert("Please login to proceed to checkout.");
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto p-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
                <div className="bg-white rounded-lg shadow-md p-10 text-center">
                    <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                    <h2 className="text-xl text-gray-500 mb-4">Your cart is empty</h2>
                    <button onClick={() => navigate('/products')} className="btn btn-primary">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart ({itemCount} items)</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4">
                            <img
                                src={item.images?.[0] || item.image || "product-jpeg-500x500.webp"}
                                alt={item.name}
                                className="w-full sm:w-24 h-24 object-cover rounded cursor-pointer"
                                onClick={() => navigate(`/product/${item.id}`)}
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg cursor-pointer hover:text-primary" onClick={() => navigate(`/product/${item.id}`)}>
                                    {item.name}
                                </h3>
                                <p className="text-primary font-bold">&#8377; {item.price}</p>

                                <div className="flex items-center gap-3 mt-2">
                                    <button
                                        onClick={() => handleDecrease(item)}
                                        className="btn btn-xs btn-outline"
                                    >-</button>
                                    <span className="font-semibold">{item.quantity}</span>
                                    <button
                                        onClick={() => handleIncrease(item)}
                                        className="btn btn-xs btn-outline"
                                    >+</button>

                                    <span className="ml-auto font-bold">
                                        &#8377; {(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button onClick={handleClearCart} className="btn btn-error btn-sm text-white">
                        <i className="fas fa-trash mr-2"></i> Clear Cart
                    </button>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                            <span>Subtotal ({itemCount} items)</span>
                            <span>&#8377; {totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="divider my-2"></div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-primary">&#8377; {totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    <button onClick={handleCheckout} className="btn btn-primary w-full">
                        Proceed to Checkout
                    </button>

                    <button onClick={() => navigate('/products')} className="btn btn-ghost w-full mt-2">
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
