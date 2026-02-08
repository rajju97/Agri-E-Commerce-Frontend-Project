import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import Layout from './Layout'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import RegistrationPage from './components/Register'
import Login from './pages/Login'
import SellerDashboard from './pages/SellerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Loader from './components/Loader'
import { useEffect } from 'react'
import { stopLoader } from './dispatchers'
import NotFound from './components/NotFound'
import { useAuth } from './context/AuthContext'

/* eslint-disable react/prop-types */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth(); // AuthContext loading

  if (loading) return <div className="flex justify-center items-center h-screen">Loading Auth...</div>;

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {

  const showLoader = useSelector((state) => state.showLoader)
  const dispatch = useDispatch()
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(stopLoader())
    }, 2000)

    return () => clearTimeout(timer)
  }, [dispatch])

  return (
    <BrowserRouter>
      {showLoader ? <Loader /> :
        <div className="bg-cream min-h-screen text-soil">
          <NavBar></NavBar>
          <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="/products" element={<Layout />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<Login />} />

            <Route path="/seller-dashboard" element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <SellerDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/about-us" element={<Layout />} />
            <Route path="/contact" element={<Layout />} />
            <Route path="/cart" element={<Layout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      }
    </BrowserRouter>
  )
}

export default App
