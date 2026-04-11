import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginPatient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FadeInUp } from '../components/ui/Motion';
import { FiArrowRight } from 'react-icons/fi';

const PatientLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginPatient(form);
      login(data.patient, 'patient', data.token);
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <FadeInUp>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-600/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold text-surface-950 tracking-tight">Welcome back</h1>
            <p className="text-sm text-surface-500 mt-1">Sign in to access your health profile</p>
          </div>

          <div className="card p-6">
            {error && (
              <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
                className="mb-4 px-4 py-3 rounded-xl bg-danger-50 border border-danger-200 text-sm font-medium text-danger-600">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})} required placeholder="your@email.com" />
              </div>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})} required placeholder="Enter password" />
              </div>
              <button type="submit" className="btn-primary btn-lg w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</span>
                ) : (
                  <span className="flex items-center gap-2">Sign In <FiArrowRight /></span>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-surface-500 mt-6">
            Don't have an account? <Link to="/patient/register" className="font-semibold text-brand-600 hover:text-brand-700">Create Health ID</Link>
          </p>
        </div>
      </FadeInUp>
    </div>
  );
};

export default PatientLogin;
