import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

const LoginRegister = ({ mode, setMode, setUser }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'login') {
      try {
        const res = await axios.post('/users/login', {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        navigate('/dashboard'); 
      } catch {
        setError('Login failed. Please check your credentials.');
      }
    } else {
      try {
        await axios.post('/users/register', form);
        setSuccessMsg('Registration successful! Please login.');
        setMode('login'); 
      } catch {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl  text-orange-400 font-bold text-center">
        {mode === 'login' ? 'Login' : 'Register'}
      </h2>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {successMsg && <p className="text-green-600 text-sm text-center">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'register' && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />

        <button
          type="submit"
          className="w-full py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
        >
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>

      <p className="text-sm text-center text-white">
        {mode === 'login' ? (
          <>
            Don’t have an account?{' '}
            <button
              onClick={() => setMode('register')}
              className="text-orange-400 underline"
            >
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setMode('login')}
              className="text-orange-400 underline"
            >
              Login
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default LoginRegister;
