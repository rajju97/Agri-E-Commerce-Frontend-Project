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
    where
} from "firebase/firestore";

const productsCollection = collection(db, "products");
const usersCollection = collection(db, "users");

export const addProduct = async (productData) => {
    return await addDoc(productsCollection, productData);
};

export const getProducts = async (sellerId = null) => {
    let q = productsCollection;
    if (sellerId) {
        q = query(productsCollection, where("sellerId", "==", sellerId));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const getUserRole = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
        return userDoc.data().role;
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

export const getAllUsers = async () => {
    const querySnapshot = await getDocs(usersCollection);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

export const deleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
}
