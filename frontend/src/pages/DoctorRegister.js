import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerDoctor } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FadeInUp } from '../components/ui/Motion';
import { FiArrowRight } from 'react-icons/fi';

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

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-surface-50 to-teal-50/20">
      <FadeInUp>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-surface-900 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold text-surface-950">Doctor Registration</h1>
            <p className="text-sm text-surface-500 mt-1">Register with your medical credentials</p>
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
                <label className="label">Full Name</label>
                <input className="input" name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Dr. Full Name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="doctor@hospital.com" />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input" name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 800 010 0200" />
                </div>
              </div>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} placeholder="Min 6 characters" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Hospital Name</label>
                  <input className="input" name="hospitalName" value={form.hospitalName} onChange={handleChange} required placeholder="Apollo Hospital" />
                </div>
                <div>
                  <label className="label">Registration No.</label>
                  <input className="input" name="registrationNumber" value={form.registrationNumber} onChange={handleChange} required placeholder="NMC-2015-48291" />
                </div>
              </div>
              <div>
                <label className="label">Specialization</label>
                <input className="input" name="specialization" value={form.specialization} onChange={handleChange} placeholder="e.g., Cardiologist, General Physician" />
              </div>
              <button type="submit" className="btn-secondary btn-lg w-full" disabled={loading}>
                {loading ? 'Registering...' : <span className="flex items-center gap-2">Register <FiArrowRight /></span>}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-surface-500 mt-6">
            Already registered? <Link to="/doctor/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</Link>
          </p>
        </div>
      </FadeInUp>
    </div>
  );
};

export default DoctorRegister;
