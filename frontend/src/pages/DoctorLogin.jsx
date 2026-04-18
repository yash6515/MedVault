import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginDoctor } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FadeInUp } from '../components/ui/Motion';
import { FiArrowRight, FiShield, FiMail, FiLock, FiLoader, FiUsers, FiActivity, FiDatabase } from 'react-icons/fi';

const perks = [
  { icon: FiShield, text: 'Verified doctor identity' },
  { icon: FiUsers, text: 'Instant patient record access' },
  { icon: FiActivity, text: 'Allergy & medication alerts' },
  { icon: FiDatabase, text: 'Full audit trail on every access' },
];

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
    <div className="min-h-[calc(100vh-64px)] flex">

      {/* Left — Brand panel (dark medical theme) */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] relative overflow-hidden bg-gradient-to-br from-surface-800 via-surface-900 to-surface-950 flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/[0.08] rounded-full blur-[80px]" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-teal-400/[0.06] rounded-full blur-[60px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />

        <div className="relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-white/[0.08] border border-white/[0.08] flex items-center justify-center mb-10">
            <FiShield className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Secure access<br />for clinicians.
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            View complete patient histories instantly. Every access is logged and auditable.
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
              <div className="w-8 h-8 rounded-xl bg-white/[0.07] flex items-center justify-center flex-shrink-0">
                <p.icon className="w-4 h-4 text-white/50" />
              </div>
              <span className="text-sm text-white/50 font-medium">{p.text}</span>
            </motion.div>
          ))}
        </div>

        <div className="relative z-10">
          <p className="text-xs text-white/20">500+ verified doctors on MedVault</p>
        </div>
      </div>

      {/* Right — Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface-50/30">
        <FadeInUp>
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-surface-800 to-surface-900 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-surface-900/20"
              >
                <FiShield className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-surface-950 tracking-tight">Doctor Login</h1>
              <p className="text-sm text-surface-500 mt-1.5">Access patient records securely</p>
            </div>

            <div className="bg-surface-0/80 backdrop-blur-xl rounded-2xl border border-surface-200/60 dark:border-surface-200/40 shadow-card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-surface-700 via-surface-800 to-surface-900" />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-4 px-4 py-3 rounded-xl bg-danger-50 border border-danger-200/60 text-sm font-semibold text-danger-600"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input className="input pl-10" type="email" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="doctor@hospital.com" />
                  </div>
                </div>
                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input className="input pl-10" type="password" value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="Enter password" />
                  </div>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-surface-800 to-surface-900 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading
                    ? <><FiLoader className="w-4 h-4 animate-spin" /> Signing in...</>
                    : <>Sign In <FiArrowRight className="w-4 h-4" /></>}
                </motion.button>
              </form>
            </div>

            <p className="text-center text-sm text-surface-500 mt-6">
              New doctor?{' '}
              <Link to="/doctor/register" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
};

export default DoctorLogin;
