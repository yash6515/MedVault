import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginPatient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FadeInUp } from '../components/ui/Motion';
import { FiArrowRight, FiCheck, FiShield, FiSmartphone, FiCpu, FiLock } from 'react-icons/fi';

const perks = [
  { icon: FiShield, text: 'Life-saving allergy alerts' },
  { icon: FiSmartphone, text: 'Instant QR-based access' },
  { icon: FiCpu, text: 'AI-powered health insights' },
  { icon: FiLock, text: 'PIN-protected privacy' },
];

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
    <div className="min-h-[calc(100vh-64px)] flex">

      {/* Left — Brand panel */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.06] rounded-full blur-[80px]" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-teal-400/[0.10] rounded-full blur-[60px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />

        <div className="relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-10">
            <FiShield className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Your health,<br />always with you.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Access your complete medical history with a single scan. Emergency-ready, doctor-trusted.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {perks.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <p.icon className="w-4 h-4 text-white/70" />
              </div>
              <span className="text-sm text-white/70 font-medium">{p.text}</span>
            </motion.div>
          ))}
        </div>

        <div className="relative z-10">
          <p className="text-xs text-white/25">Trusted by 10,000+ patients across India</p>
        </div>
      </div>

      {/* Right — Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface-50/30">
        <FadeInUp>
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-brand-600/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-surface-950 tracking-tight">Welcome back</h1>
              <p className="text-sm text-surface-500 mt-1.5">Sign in to access your health profile</p>
            </div>

            <div className="card p-6">
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-4 px-4 py-3 rounded-xl bg-danger-50 border border-danger-200 text-sm font-medium text-danger-600">
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="your@email.com" />
                </div>
                <div>
                  <label className="label">Password</label>
                  <input className="input" type="password" value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="Enter password" />
                </div>
                <button type="submit" className="btn-primary btn-lg w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">Sign In <FiArrowRight /></span>
                  )}
                </button>
              </form>
            </div>

            <p className="text-center text-sm text-surface-500 mt-6">
              Don't have an account?{' '}
              <Link to="/patient/register" className="font-semibold text-brand-600 hover:text-brand-700">
                Create Health ID
              </Link>
            </p>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
};

export default PatientLogin;
