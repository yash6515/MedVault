import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerPatient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FadeIn, FadeInUp } from '../components/ui/Motion';
import { FiArrowRight, FiShield } from 'react-icons/fi';

const PatientRegister = () => {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    pin: '', dateOfBirth: '', gender: '', address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Phone: only allow digits, max 10
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      setForm({ ...form, phone: digits });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (!/^\d{4}$/.test(form.pin)) { setError('PIN must be exactly 4 digits'); return; }
    if (!/^\d{10}$/.test(form.phone)) { setError('Phone number must be exactly 10 digits'); return; }

    setLoading(true);
    try {
      const { data } = await registerPatient(form);
      login(data.patient, 'patient', data.token);
      navigate('/patient/medical-profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <FadeInUp>
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-surface-950 tracking-tight">Create your Health ID</h1>
              <p className="text-sm text-surface-500 mt-1">Get your unique MedVault ID and QR code in seconds</p>
            </div>

            {error && (
              <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
                className="mb-4 px-4 py-3 rounded-xl bg-danger-50 border border-danger-200 text-sm font-medium text-danger-600">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input className="input" name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Priya Sharma" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="priya@email.com" />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input" name="phone" value={form.phone} onChange={handleChange} required placeholder="9876543210"
                    maxLength={10} inputMode="numeric" pattern="\d{10}" />
                  {form.phone && form.phone.length < 10 && (
                    <p className="text-[11px] text-danger-500 mt-1">{10 - form.phone.length} more digits needed</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Date of Birth</label>
                  <input className="input" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required />
                </div>
                <div>
                  <label className="label">Gender</label>
                  <select className="input" name="gender" value={form.gender} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Address</label>
                <input className="input" name="address" value={form.address} onChange={handleChange} placeholder="Your address (optional)" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Password</label>
                  <input className="input" type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} placeholder="Min 6 chars" />
                </div>
                <div>
                  <label className="label">Confirm Password</label>
                  <input className="input" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="Confirm" />
                </div>
              </div>

              <div>
                <label className="label">4-Digit Security PIN</label>
                <input className="input max-w-[140px]" name="pin" value={form.pin} onChange={handleChange}
                  required maxLength={4} placeholder="1234" />
                <p className="text-[11px] text-surface-400 mt-1">Required when doctors access your profile</p>
              </div>

              <button type="submit" className="btn-primary btn-lg w-full mt-2" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</span>
                ) : (
                  <span className="flex items-center gap-2">Create Health ID <FiArrowRight /></span>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-surface-500 mt-6">
              Already have an account? <Link to="/patient/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</Link>
            </p>
          </div>
        </FadeInUp>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-brand-600 to-brand-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        <FadeIn>
          <div className="relative text-center text-white px-12">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-8">
              <FiShield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Your Medical Identity, Secured</h2>
            <p className="text-brand-200 text-sm max-w-sm mx-auto leading-relaxed">
              One Health ID. Complete medical history. Accessible by any authorized doctor, anywhere, in seconds.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-xs mx-auto">
              {['PIN Protected', 'QR Access', 'AI Powered'].map((t, i) => (
                <div key={i} className="py-2 px-3 rounded-lg bg-white/10 backdrop-blur text-[11px] font-semibold">{t}</div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default PatientRegister;
