import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, currentUser, userRole, setUserRole } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect already logged-in users away from login page
  // (but not while submitting or showing success message)
  if (currentUser && !success && !submitting) {
    if (userRole === 'seller') return <Navigate to="/seller-dashboard" />;
    if (userRole === 'admin') return <Navigate to="/admin-dashboard" />;
    return <Navigate to="/" />;
  }

  const onSubmit = async (data) => {
    setError('');
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
      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'seller') {
          navigate('/seller-dashboard');
        } else {
          navigate('/');
        }
      }, 500);

    } catch (err) {
      console.error(err);
      setError('Failed to log in. Please check your credentials.');
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-blue-900 flex items-center justify-center min-h-screen">
        <div className="bg-blue-800 bg-opacity-75 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="text-green-400 text-5xl mb-4"><i className="fas fa-check-circle"></i></div>
          <h2 className="text-2xl font-bold text-white mb-2">Login Successful!</h2>
          <p className="text-gray-300">Redirecting you now...</p>
          <span className="loading loading-spinner loading-md text-white mt-4"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-900 flex items-center justify-center min-h-screen">
      <div className="bg-blue-800 bg-opacity-75 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className={`input input-bordered w-full ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your Email"
              {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={`input input-bordered w-full ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Enter your password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div className="flex justify-between mb-2">
            <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
              {submitting ? <><span className="loading loading-spinner loading-sm mr-2"></span>Logging in...</> : 'Login'}
            </button>
          </div>
          <div className="text-center mt-4">
            <small className='text-white'>Don&apos;t have an account? <NavLink to={'/register'} className="text-black hover:text-primary">Register here</NavLink></small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
