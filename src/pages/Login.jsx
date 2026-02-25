import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Notification from '../components/Notification';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, currentUser, userRole, setUserRole } = useAuth();
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect already logged-in users away from login page
  // (but not while submitting or showing success message)
  if (currentUser && !success && !submitting) {
    if (userRole === 'seller' || userRole === 'vendor') return <Navigate to="/seller-dashboard" />;
    if (userRole === 'admin') return <Navigate to="/admin-dashboard" />;
    return <Navigate to="/" />;
  }

  const onSubmit = async (data) => {
    setNotification({ message: '', type: '' });
    setSubmitting(true);
    try {
      const userCredential = await login(data.email, data.password);
      const user = userCredential.user;

      // Read role from Firestore and set it immediately.
      // setUserRole increments a version counter that causes
      // onAuthStateChanged's in-flight Firestore read to be discarded.
      const userDoc = await getDoc(doc(db, "users", user.uid));
      let role = 'customer';
      if (userDoc.exists()) {
        role = userDoc.data().role;
      }
      setUserRole(role);

      // Show success message briefly then redirect
      setSuccess(true);
      setNotification({ message: 'Login Successful! Redirecting...', type: 'success' });
      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'seller' || role === 'vendor') {
          navigate('/seller-dashboard');
        } else {
          navigate('/');
        }
      }, 1500);

    } catch (err) {
      console.error(err);
      setNotification({ message: 'Failed to log in. Please check your credentials.', type: 'error' });
      setSubmitting(false);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
        <Notification message={notification.message} type={notification.type} />
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">Access your account to manage your products, track orders, and connect with the agricultural community. Your gateway to a thriving marketplace awaits.</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                {...register('password', { required: 'Password is required' })}
              />
               {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? <><span className="loading loading-spinner loading-sm mr-2"></span>Logging in...</> : 'Login'}
              </button>
            </div>
            <div className="text-center mt-4">
            <small>Don't have an account? <NavLink to={'/register'} className="link link-primary">Register here</NavLink></small>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
