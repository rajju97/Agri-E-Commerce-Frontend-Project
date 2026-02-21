import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProductById, getReviewsByProduct, addReview } from '../services/db';
import { addItem } from '../dispatchers';
import { useAuth } from '../context/AuthContext';

/* eslint-disable react/prop-types */
const StarRating = ({ rating, onRate, interactive = false }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => interactive && onRate(star)}
                    className={`text-xl ${interactive ? 'cursor-pointer' : ''} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                    <i className="fas fa-star"></i>
                </span>
            ))}
        </div>
    );
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useAuth();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [prod, revs] = await Promise.all([
                    getProductById(id),
                    getReviewsByProduct(id),
                ]);
                setProduct(prod);
                setReviews(revs);
            } catch (error) {
                console.error("Error loading product:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        for (let i = 0; i < quantity; i++) {
            dispatch(addItem({ ...product, quantity: 0 }));
        }
        alert(`Added ${quantity} x ${product.name} to cart!`);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!currentUser) return alert("Please login to leave a review.");
        setSubmitting(true);
        try {
            await addReview({
                productId: id,
                userId: currentUser.uid,
                userEmail: currentUser.email,
                rating: reviewRating,
                text: reviewText,
            });
            const updatedReviews = await getReviewsByProduct(id);
            setReviews(updatedReviews);
            setReviewText('');
            setReviewRating(5);
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review.");
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
    if (!product) return <div className="text-center py-20"><h2 className="text-2xl">Product not found</h2><button onClick={() => navigate('/products')} className="btn btn-primary mt-4">Back to Products</button></div>;

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <button onClick={() => navigate(-1)} className="btn btn-ghost mb-4">
                <i className="fas fa-arrow-left mr-2"></i> Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img
                        src={product.image || "product-jpeg-500x500.webp"}
                        alt={product.name}
                        className="w-full h-96 object-cover"
                    />
                </div>

                {/* Product Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

                    <div className="flex items-center gap-2 mb-4">
                        <StarRating rating={Math.round(averageRating)} />
                        <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
                    </div>

                    <p className="text-3xl font-bold text-primary mb-4">&#8377; {product.price}</p>

                    <p className="text-gray-600 mb-4">{product.description}</p>

                    <div className="mb-4">
                        <span className={`badge ${product.quantity > 0 ? 'badge-success' : 'badge-error'} text-white`}>
                            {product.quantity > 0 ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
                        </span>
                    </div>

                    {product.sellerEmail && (
                        <p className="text-sm text-gray-500 mb-4">Sold by: {product.sellerEmail}</p>
                    )}

                    {product.quantity > 0 && (
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center border rounded">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-2 hover:bg-gray-100"
                                >-</button>
                                <span className="px-4 py-2 border-x">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                                    className="px-3 py-2 hover:bg-gray-100"
                                >+</button>
                            </div>
                            <button onClick={handleAddToCart} className="btn btn-primary flex-1">
                                <i className="fas fa-cart-plus mr-2"></i> Add to Cart
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

                {/* Write Review Form */}
                {currentUser && (
                    <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Write a Review</h3>
                        <div className="mb-3">
                            <label className="block text-sm mb-1">Rating</label>
                            <StarRating rating={reviewRating} onRate={setReviewRating} interactive />
                        </div>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your experience..."
                            className="textarea textarea-bordered w-full mb-3"
                            rows="3"
                            required
                        />
                        <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                )}

                {/* Reviews List */}
                {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <StarRating rating={review.rating} />
                                    <span className="text-sm text-gray-500">{review.userEmail}</span>
                                </div>
                                <p className="text-gray-700">{review.text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
