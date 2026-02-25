import './App.css'
import Layout from './Layout'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import RegistrationPage from './components/Register'
import Login from './pages/Login'
import SellerDashboard from './pages/SellerDashboard'
import SellerOrders from './pages/SellerOrders'
import AdminDashboard from './pages/AdminDashboard'
import ProductsPage from './pages/ProductsPage'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderHistory from './pages/OrderHistory'
import Profile from './pages/Profile'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import NotFound from './components/NotFound'
import { useAuth } from './context/AuthContext'

/* eslint-disable react/prop-types */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="bg-cream min-h-screen text-soil">
        <NavBar />
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />

            {/* Buyer Routes (any logged-in user can buy) */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={
              <ProtectedRoute allowedRoles={['customer', 'seller', 'vendor', 'admin']}>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute allowedRoles={['customer', 'seller', 'vendor', 'admin']}>
                <OrderHistory />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['customer', 'seller', 'vendor', 'admin']}>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Seller Routes */}
            <Route path="/seller-dashboard" element={
              <ProtectedRoute allowedRoles={['seller', 'vendor', 'admin']}>
                <SellerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/seller-orders" element={
              <ProtectedRoute allowedRoles={['seller', 'vendor', 'admin']}>
                <SellerOrders />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
