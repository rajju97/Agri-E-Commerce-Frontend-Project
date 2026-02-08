import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';

const RegistrationPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setError('');
    try {
      const userCredential = await signup(data.email, data.password);
      const user = userCredential.user;

      // Save user role and details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: data.email,
        mobile: data.mobile,
        role: data.role,
        uid: user.uid
      });

      // Redirect based on role
      if (data.role === 'seller') {
        navigate('/seller-dashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error(err);
      setError('Failed to create account. ' + err.message);
    }
  };

  return (
    <div className="bg-blue-900 flex items-center justify-center min-h-screen">
      <div className="bg-blue-800 bg-opacity-75 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Sign up free in seconds</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="username">Email</label>
            <input
              type="email"
              id="username"
              className={`input input-bordered w-full ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your Email"
              {...register('email', { required: 'Email is required', pattern:/^\S+@\S+$/i })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="mobile">Mobile No.</label>
            <input
              type="tel"
              id="mobile"
              className={`input input-bordered w-full ${errors.mobile ? 'border-red-500' : ''}`}
              placeholder="Enter your mobile no"
              {...register('mobile', { required: 'Mobile No. is required', minLength: 10, maxLength: 10 })}
            />
            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="role">Role</label>
            <select
              id="role"
              className={`select select-bordered w-full ${errors.role ? 'border-red-500' : ''}`}
              {...register('role', { required: 'Role is required' })}
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={`input input-bordered w-full ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Enter your password"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="rewrite-password">Rewrite Password</label>
            <input
              type="password"
              id="rewrite-password"
              className={`input input-bordered w-full ${errors.rewritePassword ? 'border-red-500' : ''}`}
              placeholder="Rewrite your password"
              {...register('rewritePassword', {
                required: 'Please rewrite your password',
                validate: value => value === watch('password') || 'Passwords do not match'
              })}
            />
            {errors.rewritePassword && <p className="text-red-500 text-sm mt-1">{errors.rewritePassword.message}</p>}
          </div>
          <div className="flex justify-between mb-2">
            <button type="submit" className="btn btn-primary">Register</button>
            <button type="reset" className="btn btn-accent">Reset</button>
          </div>
          <div>
            <small className='text-white'>Already Registered, <NavLink to={'/login'} className="text-black hover:text-primary">please login</NavLink></small>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
