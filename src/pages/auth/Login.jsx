import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useFavoriteStore } from '../../store/useFavoriteStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Login() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from || '/';

  const { login, isLoading }   = useAuthStore();
  const { loadGuestCart }      = useCartStore();
  const { fetchFavorites }     = useFavoriteStore();

  const [form, setForm]               = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [focused, setFocused]         = useState('');

  // Guest cart badge dikhane ke liye localStorage se load karo
  useEffect(() => {
    loadGuestCart();
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    return errs;
  };

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((p) => ({ ...p, [field]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setServerError('');

    // login() ke andar:
    //   1. cookie set hoti hai
    //   2. isAuthenticated = true
    //   3. mergeGuestCart() call hoti hai (localStorage → backend)
    const result = await login({ email: form.email, password: form.password });

    if (result.success) {
      await fetchFavorites();
      navigate(from, { replace: true });
    } else {
      setServerError(result.message || 'Invalid email or password. Please try again.');
    }
  };

  const getInputStyle = (field) => ({
    outline: 'none', width: '100%',
    padding: '10px 14px 10px 40px', fontSize: 14, borderRadius: 12,
    background:    fieldErrors[field] ? '#fff8f8' : focused === field ? '#fafafe' : '#f8f8fc',
    border: `1.5px solid ${fieldErrors[field] ? '#fca5a5' : focused === field ? '#a5b4fc' : '#ebebf5'}`,
    color: '#1e1b4b', transition: 'all 0.18s ease',
  });

  const getIconColor = (field) =>
    fieldErrors[field] ? '#f87171' : focused === field ? '#6366f1' : '#c4c4d4';

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg,#f0f0ff 0%,#fafaff 50%,#f5f0ff 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: '#fff', borderRadius: 24, padding: '36px 32px', width: '100%', maxWidth: 420, boxShadow: '0 8px 48px rgba(99,102,241,0.1)' }}
      >
        {/* Logo */}
        <div className="text-center mb-7">
          <h1 className="font-black text-gray-900 mb-1 text-2xl">
            Nexa<span style={{ color: '#6366f1', fontFamily: "'Pacifico', cursive" }}>Mart</span>
          </h1>
          <p className="text-sm text-gray-400">Welcome back! Sign in to continue</p>
        </div>

        {/* Server Error */}
        <AnimatePresence>
          {serverError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-4 text-red-500 text-sm flex gap-2 items-center">
              <FiAlertCircle size={14} /> {serverError}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <div style={{ position: 'relative' }}>
              <FiMail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: getIconColor('email') }} />
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                style={getInputStyle('email')} />
            </div>
            <AnimatePresence>
              {fieldErrors.email && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ fontSize: 12, color: '#f87171', margin: '4px 0 0 2px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FiAlertCircle size={11} /> {fieldErrors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password */}
          <div>
            <div style={{ position: 'relative' }}>
              <FiLock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: getIconColor('password') }} />
              <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                style={{ ...getInputStyle('password'), paddingRight: 40 }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
            <AnimatePresence>
              {fieldErrors.password && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ fontSize: 12, color: '#f87171', margin: '4px 0 0 2px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FiAlertCircle size={11} /> {fieldErrors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Submit */}
          <button type="submit" disabled={isLoading}
            style={{ height: 44, borderRadius: 12, border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)', color: '#fff', fontSize: 14, fontWeight: 700, opacity: isLoading ? 0.75 : 1, width: '100%' }}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* OAuth */}
        <div className="flex gap-3">
          <a href={`${API_URL}/auth/google`} className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold"
            style={{ height: 42, borderRadius: 12, border: '1.5px solid #ebebf5', background: '#fafafe', color: '#4b5563', textDecoration: 'none' }}>
            <FcGoogle size={17} /> Google
          </a>
          <a href={`${API_URL}/auth/facebook`} className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold"
            style={{ height: 42, borderRadius: 12, border: '1.5px solid #ebebf5', background: '#fafafe', color: '#4b5563', textDecoration: 'none' }}>
            <FaFacebook size={17} color="#1877f2" /> Facebook
          </a>
        </div>

        <p className="text-center text-sm mt-6 text-gray-400">
          Don't have an account?{' '}
          <NavLink to="/register" className="font-bold text-indigo-500">Create one</NavLink>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;