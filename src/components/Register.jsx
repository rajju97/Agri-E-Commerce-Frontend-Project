// src/components/RegistrationPage.js
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';

const RegistrationPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);

  return (
    <div className="bg-blue-900 flex items-center justify-center min-h-screen">
      <div className="bg-blue-800 bg-opacity-75 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Sign up free in seconds</h2>
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
            <label className="block text-white mb-2" htmlFor="username">Mobile No.</label>
            <input
              type="tel"
              id="mobile"
              className={`input input-bordered w-full ${errors.mobile ? 'border-red-500' : ''}`}
              placeholder="Enter your mobile no"
              {...register('mobile', { required: 'Mobile No. is required', min:10, max:10 })}
            />
            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
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
            {/* <button type="button" className="btn btn-secondary">Login</button> */}
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
