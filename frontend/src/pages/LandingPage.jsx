import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem } from '../components/ui/Motion';
import Logo from '../components/ui/Logo';
import {
  FiShield, FiActivity, FiSmartphone, FiLock, FiCpu,
  FiArrowRight, FiCheck, FiZap, FiHeart, FiUsers,
  FiGlobe, FiTrendingUp, FiStar
} from 'react-icons/fi';

const features = [
  { icon: FiShield, color: 'text-brand-600', bg: 'bg-brand-50', gradient: 'from-brand-500 to-indigo-500', title: 'Unique Health ID', desc: 'Auto-generated MV-XXXX-XXXX identifier with downloadable QR code for every patient.' },
  { icon: FiSmartphone, color: 'text-teal-600', bg: 'bg-teal-50', gradient: 'from-teal-500 to-emerald-500', title: 'Instant QR Access', desc: 'Any doctor scans the QR code, verifies via PIN, and instantly sees the full medical profile.' },
  { icon: FiActivity, color: 'text-rose-500', bg: 'bg-rose-50', gradient: 'from-rose-500 to-red-500', title: 'Allergy Alerts', desc: 'Drug allergies highlighted with severity badges. Life-threatening allergies impossible to miss.' },
  { icon: FiCpu, color: 'text-amber-600', bg: 'bg-amber-50', gradient: 'from-amber-500 to-orange-500', title: 'AI Health Predictions', desc: 'AI analyzes conditions, family history, and lifestyle to predict risks and suggest screenings.' },
  { icon: FiLock, color: 'text-violet-600', bg: 'bg-violet-50', gradient: 'from-violet-500 to-purple-500', title: 'Privacy First', desc: '4-digit PIN protection, encrypted storage. Every access is logged and fully auditable.' },
  { icon: FiZap, color: 'text-sky-600', bg: 'bg-sky-50', gradient: 'from-sky-500 to-blue-500', title: 'Emergency Bypass', desc: 'When patients are unconscious, verified doctors access critical allergies, blood group, medications.' },
];

const stats = [
  { value: '10,000+', label: 'Health IDs Created', icon: FiUsers },
  { value: '500+', label: 'Verified Doctors', icon: FiHeart },
  { value: '99.9%', label: 'Uptime', icon: FiGlobe },
  { value: '< 2s', label: 'QR Scan Time', icon: FiZap },
];

const steps = [
  { step: '01', title: 'Register', desc: 'Sign up with basic info. Get your unique Health ID and QR code instantly.', icon: FiUsers },
  { step: '02', title: 'Build Profile', desc: 'Add allergies, medications, conditions, surgeries, and family history.', icon: FiHeart },
  { step: '03', title: 'Doctor Scans', desc: 'Doctor scans QR, enters your PIN, views your complete medical record.', icon: FiSmartphone },
  { step: '04', title: 'AI Predicts', desc: 'AI analyzes your data to predict health risks and suggest screenings.', icon: FiTrendingUp },
];

const LandingPage = () => {
  return (
    <div className="overflow-hidden bg-surface-0">

      {/* ══ HERO ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-surface-0 to-surface-0 dark:from-brand-500/5 dark:via-surface-50 dark:to-surface-50" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-brand-100/25 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-teal-100/20 rounded-full blur-[120px]" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 mb-8">
                  <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-brand-500" />
                  <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider">Universal Health Identity</span>
                </div>
              </FadeIn>

              <FadeInUp delay={0.1}>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl leading-[1.1] sm:leading-[1.05] font-bold tracking-tight text-surface-900 mb-5 sm:mb-6">
                  Your complete
                  <br />
                  medical{' '}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-brand-600 to-teal-500 bg-clip-text text-transparent">history,</span>
                    <motion.span
                      initial={{ width: 0 }} animate={{ width: '100%' }}
                      transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute bottom-2 left-0 h-3 bg-brand-100/70 -z-10 rounded"
                    />
                  </span>
                  <br />
                  one scan away.
                </h1>
              </FadeInUp>

              <FadeInUp delay={0.2}>
                <p className="text-lg text-surface-500 leading-relaxed max-w-lg mb-10">
                  MedVault gives every patient a unique Health ID and QR code. Allergies, medications,
                  conditions — accessible instantly by any authorized doctor, anywhere.
                </p>
              </FadeInUp>

              <FadeInUp delay={0.3}>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
                  <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                    <Link to="/patient/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-600/25 hover:bg-brand-700 hover:shadow-xl transition-all duration-300">
                      Create Your Health ID
                      <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                    <Link to="/doctor/login" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border-2 border-surface-200 text-surface-700 dark:text-surface-700 font-bold text-sm hover:border-brand-200 hover:bg-brand-50/30 transition-all duration-300">
                      Doctor Access
                    </Link>
                  </motion.div>
                </div>
              </FadeInUp>

              <FadeInUp delay={0.4}>
                <div className="flex flex-wrap items-center gap-4 sm:gap-8 mt-10 sm:mt-12">
                  {['PIN Protected', 'AI Powered', 'Instant Access'].map((label, i) => (
                    <span key={i} className="flex items-center gap-2 text-sm text-surface-500 font-medium">
                      <span className="w-5 h-5 rounded-lg bg-teal-50 border border-teal-200/60 flex items-center justify-center flex-shrink-0">
                        <FiCheck className="w-3 h-3 text-teal-600" />
                      </span>
                      {label}
                    </span>
                  ))}
                </div>
              </FadeInUp>
            </div>

            {/* Hero Card */}
            <FadeInUp delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-100/40 to-teal-100/25 rounded-3xl blur-2xl scale-95" />

                <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.4 }}
                  className="relative bg-surface-0 rounded-3xl border border-surface-200/60 p-5 sm:p-7 shadow-elevated">

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-brand-500/25">
                      P
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-surface-900">Priya Sharma</p>
                      <p className="text-xs text-surface-400 font-mono mt-0.5">MV-4829-7156</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/60 text-[11px] font-semibold text-teal-600">Active</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/40">
                      <div className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center flex-shrink-0">
                        <FiShield className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-bold text-rose-700 uppercase tracking-wide flex-1">Allergic to Penicillin</span>
                      <span className="px-2 py-1 rounded-lg bg-rose-100 text-[10px] font-bold text-rose-600">SEVERE</span>
                    </motion.div>

                    <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-50 border border-surface-200/50">
                      <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                        <FiActivity className="w-4 h-4 text-brand-600" />
                      </div>
                      <span className="text-sm text-surface-700 font-medium flex-1">Metformin 500mg</span>
                      <span className="text-xs text-surface-400 font-medium">Twice daily</span>
                    </motion.div>

                    <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-50 border border-surface-200/50">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                        <FiHeart className="w-4 h-4 text-teal-600" />
                      </div>
                      <span className="text-sm text-surface-700 font-medium flex-1">Type 2 Diabetes</span>
                      <span className="px-2 py-1 rounded-lg bg-teal-50 border border-teal-200/60 text-[10px] font-semibold text-teal-600">Controlled</span>
                    </motion.div>
                  </div>

                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}
                    className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/40">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <FiCpu className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-bold text-amber-800">AI Risk Alert</span>
                    </div>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      68% cardiovascular risk detected. Annual cardiac screening recommended.
                    </p>
                    <div className="mt-2.5 w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '68%' }}
                        transition={{ delay: 1.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Floating badges — hidden on small screens to avoid overflow */}
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  className="hidden sm:flex absolute -left-5 top-16 bg-surface-0 rounded-2xl px-4 py-3 items-center gap-3 shadow-float border border-surface-200/60">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/40 flex items-center justify-center">
                    <FiSmartphone className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-surface-900">QR Scanned</p>
                    <p className="text-[10px] text-surface-400">Dr. Mehta verified</p>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  className="hidden sm:flex absolute -right-5 bottom-12 bg-surface-0 rounded-2xl px-4 py-3 items-center gap-3 shadow-float border border-surface-200/60">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200/40 flex items-center justify-center">
                    <FiLock className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-surface-900">Access Logged</p>
                    <p className="text-[10px] text-surface-400">Apollo Hospital</p>
                  </div>
                </motion.div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* ══ STATS ══════════════════════════════════════════════ */}
      <section className="border-y border-surface-100 bg-surface-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-surface-100">
            {stats.map((stat, i) => (
              <FadeInUp key={i} delay={i * 0.08}>
                <div className="flex flex-col items-center gap-2 py-10 px-6 text-center group">
                  <div className="w-11 h-11 rounded-2xl bg-brand-50 flex items-center justify-center mb-1 group-hover:bg-brand-100 transition-colors duration-200">
                    <stat.icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <p className="text-2xl font-bold text-surface-900 tracking-tight">{stat.value}</p>
                  <p className="text-xs text-surface-400 font-medium">{stat.label}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ═══════════════════════════════════════════ */}
      <section className="py-28 relative">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-4">
                Features
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-4">
                Everything you need for
                <br />universal health records
              </h2>
              <p className="text-base text-surface-400 max-w-xl mx-auto leading-relaxed">
                Built for patients, doctors, and emergency responders. Secure, instant, intelligent.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <StaggerItem key={i}>
                <motion.div whileHover={{ y: -6 }}
                  className="group relative p-7 rounded-3xl border border-surface-200/60 bg-surface-0 hover:shadow-float transition-all duration-300 overflow-hidden">
                  {/* Gradient top accent on hover */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="text-[15px] font-bold text-surface-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-surface-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═══════════════════════════════════════ */}
      <section className="py-28 bg-surface-900 dark:bg-surface-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-brand-500/[0.07] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-teal-500/[0.05] rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
                How It Works
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                From registration to AI insights
                <br />in under 2 minutes
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-4 gap-10">
            {steps.map((s, i) => (
              <FadeInUp key={i} delay={i * 0.12}>
                <motion.div whileHover={{ y: -8 }} className="relative group text-center md:text-left">
                  {/* Step circle */}
                  <div className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.06] flex items-center justify-center mx-auto md:mx-0 mb-5 font-mono text-sm font-bold text-white/40 group-hover:bg-brand-500 group-hover:border-brand-400 group-hover:text-white transition-all duration-300">
                    {s.step}
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/[0.07] flex items-center justify-center mx-auto md:mx-0 mb-4 group-hover:bg-brand-500/20 group-hover:border-brand-400/20 transition-all duration-300">
                    <s.icon className="w-5 h-5 text-white/40 group-hover:text-brand-300 transition-colors" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">{s.desc}</p>
                  {i < 3 && <div className="hidden md:block absolute top-6 left-[calc(100%_-_16px)] w-8 border-t border-dashed border-white/[0.10]" />}
                </motion.div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════════════════════ */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 p-12 sm:p-16 text-center">
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '28px 28px'
              }} />
              <motion.div animate={{ x: [0, 30, 0], y: [0, -15, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-0 right-0 w-60 h-60 bg-white/[0.06] rounded-full blur-3xl" />

              <div className="relative z-10">
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mx-auto mb-8">
                  <FiStar className="w-7 h-7 text-white" />
                </motion.div>

                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                  Ready to secure your
                  <br />health records?
                </h2>
                <p className="text-base text-white/50 mb-10 max-w-lg mx-auto leading-relaxed">
                  Create your Health ID in under 2 minutes. It's free, secure, and could save your life in an emergency.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                    <Link to="/patient/register" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-surface-0 text-brand-700 font-bold text-[15px] shadow-xl hover:shadow-2xl transition-all duration-300">
                      Get Started Free <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link to="/doctor/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-bold text-[15px] hover:bg-white/10 transition-all duration-300">
                      I'm a Doctor
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ══ FOOTER ═════════════════════════════════════════════ */}
      <footer className="border-t border-surface-100 pt-14 pb-8 bg-surface-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-10 mb-12">
            <div>
              <Logo size="sm" />
              <p className="text-sm text-surface-400 mt-4 leading-relaxed max-w-xs">
                Universal health identity for every patient — secure, instant, and AI-powered.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-4">Patients</p>
              <div className="space-y-3">
                <Link to="/patient/register" className="block text-sm text-surface-500 hover:text-brand-600 transition-colors">Create Health ID</Link>
                <Link to="/patient/login" className="block text-sm text-surface-500 hover:text-brand-600 transition-colors">Sign In</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-4">Doctors</p>
              <div className="space-y-3">
                <Link to="/doctor/register" className="block text-sm text-surface-500 hover:text-brand-600 transition-colors">Register as Doctor</Link>
                <Link to="/doctor/login" className="block text-sm text-surface-500 hover:text-brand-600 transition-colors">Doctor Access</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-surface-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-surface-400">© 2025 MedVault. Built for accessible, secure healthcare.</span>
            <span className="text-xs text-surface-300">v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
