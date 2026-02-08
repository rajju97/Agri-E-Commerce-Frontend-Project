import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setError('');
    try {
      const userCredential = await login(data.email, data.password);
      const user = userCredential.user;

      // Determine role and redirect
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'seller') {
          navigate('/seller-dashboard');
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to log in. Please check your credentials.');
    }
  };

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
            <button type="submit" className="btn btn-primary w-full">Login</button>
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
