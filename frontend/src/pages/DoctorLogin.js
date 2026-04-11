import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginDoctor } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FadeInUp } from '../components/ui/Motion';
import { FiArrowRight } from 'react-icons/fi';

const DoctorLogin = () => {
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
      const { data } = await loginDoctor(form);
      login(data.doctor, 'doctor', data.token);
      navigate('/doctor/lookup');
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
            <div className="w-12 h-12 rounded-2xl bg-surface-900 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold text-surface-950">Doctor Login</h1>
            <p className="text-sm text-surface-500 mt-1">Access patient records securely</p>
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
                  onChange={e => setForm({...form, email: e.target.value})} required placeholder="doctor@hospital.com" />
              </div>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})} required placeholder="Enter password" />
              </div>
              <button type="submit" className="btn-secondary btn-lg w-full" disabled={loading}>
                {loading ? 'Signing in...' : <span className="flex items-center gap-2">Sign In <FiArrowRight /></span>}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-surface-500 mt-6">
            New doctor? <Link to="/doctor/register" className="font-semibold text-brand-600 hover:text-brand-700">Register here</Link>
          </p>
        </div>
      </FadeInUp>
    </div>
  );
};

export default DoctorLogin;
