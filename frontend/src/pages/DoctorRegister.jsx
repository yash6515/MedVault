import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerDoctor } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FadeInUp } from '../components/ui/Motion';
import {
  FiArrowRight, FiShield, FiUser, FiMail, FiPhone,
  FiLock, FiHome, FiHash, FiActivity, FiLoader
} from 'react-icons/fi';

const easeOut = [0.25, 0.46, 0.45, 0.94];

const DoctorRegister = () => {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '',
    hospitalName: '', registrationNumber: '', specialization: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await registerDoctor(form);
      login(data.doctor, 'doctor', data.token);
      navigate('/doctor/lookup');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const InputWithIcon = ({ icon: Icon, label, ...props }) => (
    <div>
      <label className="text-[13px] font-semibold text-surface-600 mb-2 block">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input className="input pl-10" onChange={handleChange} {...props} />
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl" />
      </div>

      <FadeInUp>
        <div className="w-full max-w-md relative">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: easeOut }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-surface-800 to-surface-900 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-surface-900/20"
            >
              <FiShield className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-surface-950 tracking-tight">Doctor Registration</h1>
            <p className="text-sm text-surface-500 mt-2">Register with your medical credentials</p>
          </div>

          {/* Card */}
          <div className="bg-surface-0/80 backdrop-blur-xl rounded-3xl border border-surface-200/60 dark:border-surface-200/40 shadow-card p-6 sm:p-7 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-surface-700 via-surface-800 to-surface-900" />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mb-5 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-danger-50 to-rose-50 border border-danger-200/60 text-sm font-semibold text-danger-600"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputWithIcon icon={FiUser} label="Full Name" name="fullName" value={form.fullName} required placeholder="Dr. Full Name" />

              <div className="grid grid-cols-2 gap-3">
                <InputWithIcon icon={FiMail} label="Email" type="email" name="email" value={form.email} required placeholder="doctor@hospital.com" />
                <InputWithIcon icon={FiPhone} label="Phone" name="phone" value={form.phone} required placeholder="9800010020" />
              </div>

              <InputWithIcon icon={FiLock} label="Password" type="password" name="password" value={form.password} required minLength={6} placeholder="Min 6 characters" />

              <div className="grid grid-cols-2 gap-3">
                <InputWithIcon icon={FiHome} label="Hospital Name" name="hospitalName" value={form.hospitalName} required placeholder="Apollo Hospital" />
                <InputWithIcon icon={FiHash} label="Registration No." name="registrationNumber" value={form.registrationNumber} required placeholder="NMC-2015-48291" />
              </div>

              <InputWithIcon icon={FiActivity} label="Specialization" name="specialization" value={form.specialization} placeholder="e.g., Cardiologist" />

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-surface-800 to-surface-900 text-white text-sm font-bold shadow-lg shadow-surface-900/15 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? <><FiLoader className="w-4 h-4 animate-spin" /> Registering...</> : <>Register <FiArrowRight className="w-4 h-4" /></>}
              </motion.button>
            </form>
          </div>

          <p className="text-center text-sm text-surface-500 mt-6">
            Already registered?{' '}
            <Link to="/doctor/login" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </FadeInUp>
    </div>
  );
};

export default DoctorRegister;
