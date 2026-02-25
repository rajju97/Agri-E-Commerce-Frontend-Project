import { useForm } from 'react-hook-form';
import { NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import Notification from './Notification';

const RegistrationPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { signup, currentUser, userRole, setUserRole } = useAuth();
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect already logged-in users away from registration page
  if (currentUser && !success && !submitting) {
    if (userRole === 'seller' || userRole === 'vendor') return <Navigate to="/seller-dashboard" />;
    if (userRole === 'admin') return <Navigate to="/admin-dashboard" />;
    return <Navigate to="/" />;
  }

  const onSubmit = async (data) => {
    setNotification({ message: '', type: '' });
    setSubmitting(true);
    try {
      const userCredential = await signup(data.email, data.password);
      const user = userCredential.user;

      setUserRole(data.role);

      await setDoc(doc(db, "users", user.uid), {
        email: data.email,
        mobile: data.mobile,
        role: data.role,
        uid: user.uid
      });

      setSuccess(true);
      setNotification({ message: 'Registration Successful! Redirecting...', type: 'success' });
      setTimeout(() => {
        if (data.role === 'seller' || data.role === 'vendor') {
          navigate('/seller-dashboard');
        } else {
          navigate('/');
        }
      }, 1500);

    } catch (err) {
      console.error(err);
      setNotification({ message: 'Failed to create account. ' + err.message, type: 'error' });
      setSubmitting(false);
    }
  };


  return (
    <div className="hero min-h-screen bg-base-200">
        <Notification message={notification.message} type={notification.type} />
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Register Now!</h1>
          <p className="py-6">Join our platform to start buying or selling agricultural products.</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input
                type="email"
                placeholder="Your email"
                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                {...register('email', { required: 'Email is required', pattern:/^\S+@\S+$/i })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Mobile No.</span></label>
              <input
                type="tel"
                placeholder="Your mobile number"
                className={`input input-bordered ${errors.mobile ? 'input-error' : ''}`}
                {...register('mobile', { required: 'Mobile No. is required', minLength: 10, maxLength: 10 })}
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <input
                type="password"
                placeholder="Create a password"
                className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Confirm Password</span></label>
              <input
                type="password"
                placeholder="Rewrite your password"
                className={`input input-bordered ${errors.rewritePassword ? 'input-error' : ''}`}
                {...register('rewritePassword', {
                  required: 'Please rewrite your password',
                  validate: value => value === watch('password') || 'Passwords do not match'
                })}
              />
              {errors.rewritePassword && <p className="text-red-500 text-sm mt-1">{errors.rewritePassword.message}</p>}
            </div>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Role</span></label>
              <select
                defaultValue=""
                className={`select select-bordered ${errors.role ? 'select-error' : ''}`}
                {...register('role', { required: 'Role is required' })}
              >
                <option value="" disabled>Select your role</option>
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
                <option value="vendor">Vendor</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                 {submitting ? <><span className="loading loading-spinner loading-sm mr-2"></span>Registering...</> : 'Register'}
              </button>
            </div>
            <div className="text-center mt-4">
              <small>Already have an account? <NavLink to={'/login'} className="link link-primary">Login here</NavLink></small>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
