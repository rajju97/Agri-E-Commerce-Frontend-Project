import { db } from "../firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp
} from "firebase/firestore";

const productsCollection = collection(db, "products");
const usersCollection = collection(db, "users");
const ordersCollection = collection(db, "orders");
const reviewsCollection = collection(db, "reviews");

// ── Products ──

export const addProduct = async (productData) => {
    return await addDoc(productsCollection, {
        ...productData,
        createdAt: serverTimestamp(),
    });
};

export const getProducts = async (sellerId = null) => {
    let q = productsCollection;
    if (sellerId) {
        q = query(productsCollection, where("sellerId", "==", sellerId));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ ...d.data(), id: d.id }));
};

export const getProductById = async (id) => {
    const productDoc = await getDoc(doc(db, "products", id));
    if (productDoc.exists()) {
        return { ...productDoc.data(), id: productDoc.id };
    }
    return null;
};

export const updateProduct = async (id, data) => {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, data);
};

export const deleteProduct = async (id) => {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
};

// ── Users ──

export const getUserRole = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
        return userDoc.data().role;
    }
    return null;
};

export const getUserProfile = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
        return { ...userDoc.data(), id: userDoc.id };
    }
    return null;
};

export const updateUserProfile = async (uid, data) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
};

export const getAllUsers = async () => {
    const querySnapshot = await getDocs(usersCollection);
    return querySnapshot.docs.map(d => ({ ...d.data(), id: d.id }));
};

export const deleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
};

// ── Orders ──

export const createOrder = async (orderData) => {
    return await addDoc(ordersCollection, {
        ...orderData,
        createdAt: serverTimestamp(),
        status: 'pending',
    });
};

export const getOrdersByBuyer = async (buyerId) => {
    const q = query(ordersCollection, where("buyerId", "==", buyerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ ...d.data(), id: d.id }));
};

export const getOrdersBySeller = async (sellerId) => {
    const q = query(ordersCollection, where("sellerId", "==", sellerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ ...d.data(), id: d.id }));
};

export const getAllOrders = async () => {
    const querySnapshot = await getDocs(ordersCollection);
    return querySnapshot.docs.map(d => ({ ...d.data(), id: d.id }));
};

export const updateOrderStatus = async (orderId, status) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status, updatedAt: serverTimestamp() });
};

// ── Reviews ──

export const addReview = async (reviewData) => {
    return await addDoc(reviewsCollection, {
        ...reviewData,
        createdAt: serverTimestamp(),
    });
};

export const getReviewsByProduct = async (productId) => {
    const q = query(reviewsCollection, where("productId", "==", productId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ ...d.data(), id: d.id }));
};
