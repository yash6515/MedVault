import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem } from '../components/ui/Motion';
import {
  FiShield, FiActivity, FiSmartphone, FiLock, FiCpu,
  FiArrowRight, FiCheck, FiZap, FiHeart, FiUsers,
  FiGlobe, FiTrendingUp, FiStar
} from 'react-icons/fi';

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.3]);

  return (
    <div className="overflow-hidden">

      {/* ══ HERO ═══════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-50/60 via-surface-50 to-white" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-ocean-200/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-teal-200/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-coral-200/10 rounded-full blur-[100px]" />

        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.5) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              <div>
                <FadeIn>
                  <motion.div whileHover={{ scale: 1.02 }}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-ocean-50 border border-ocean-200/50 mb-8 cursor-default">
                    <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-ocean-500" />
                    <span className="text-xs font-bold text-ocean-700 uppercase tracking-widest">Universal Health Identity</span>
                  </motion.div>
                </FadeIn>

                <FadeInUp delay={0.1}>
                  <h1 className="text-[3.5rem] sm:text-[4rem] leading-[1.05] font-black tracking-tight text-surface-950 mb-7">
                    Your complete
                    <br />
                    medical
                    <span className="relative inline-block ml-3">
                      <span className="relative z-10 bg-gradient-to-r from-ocean-600 to-teal-500 bg-clip-text text-transparent">history,</span>
                      <motion.span
                        initial={{ width: 0 }} animate={{ width: '100%' }}
                        transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-2 left-0 h-3 bg-ocean-200/40 -z-0 rounded-sm"
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
                  <div className="flex flex-wrap gap-4">
                    <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                      <Link to="/patient/register" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-ocean-600 to-brand-600 text-white font-bold text-[15px] shadow-xl shadow-ocean-500/20 hover:shadow-2xl hover:shadow-ocean-500/30 transition-all duration-300">
                        Create Your Health ID
                        <FiArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Link to="/doctor/login" className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl border-2 border-surface-200 text-surface-700 font-bold text-[15px] hover:border-ocean-300 hover:bg-ocean-50/50 transition-all duration-300">
                        Doctor Access
                      </Link>
                    </motion.div>
                  </div>
                </FadeInUp>

                <FadeInUp delay={0.4}>
                  <div className="flex items-center gap-8 mt-12">
                    {['PIN Protected', 'AI Powered', 'Instant Access'].map((label, i) => (
                      <span key={i} className="flex items-center gap-2 text-sm text-surface-500">
                        <span className="w-5 h-5 rounded-md bg-teal-50 border border-teal-200/50 flex items-center justify-center">
                          <FiCheck className="w-3 h-3 text-teal-600" />
                        </span>
                        {label}
                      </span>
                    ))}
                  </div>
                </FadeInUp>
              </div>

              {/* ── Hero Card ── */}
              <FadeInUp delay={0.2}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-ocean-200/30 to-teal-200/20 rounded-3xl blur-2xl scale-95" />

                  <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.4 }}
                    className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-surface-200/60 p-7 shadow-elevated">

                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ocean-500 to-brand-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-ocean-500/20">
                        P
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-bold text-surface-900">Priya Sharma</p>
                        <p className="text-xs text-surface-400 font-mono mt-0.5">MV-4829-7156</p>
                      </div>
                      <span className="px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/60 text-[11px] font-bold text-teal-600">Active</span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-coral-50 border border-coral-200/40">
                        <div className="w-8 h-8 rounded-xl bg-coral-500 flex items-center justify-center">
                          <FiShield className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-bold text-coral-700 uppercase tracking-wide flex-1">Allergic to Penicillin</span>
                        <span className="px-2 py-1 rounded-lg bg-coral-100 text-[10px] font-extrabold text-coral-600">SEVERE</span>
                      </motion.div>

                      <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-50 border border-surface-200/50">
                        <div className="w-8 h-8 rounded-xl bg-ocean-100 flex items-center justify-center">
                          <FiActivity className="w-4 h-4 text-ocean-600" />
                        </div>
                        <span className="text-sm text-surface-700 font-medium flex-1">Metformin 500mg</span>
                        <span className="text-xs text-surface-400 font-medium">Twice daily</span>
                      </motion.div>

                      <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }}
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-50 border border-surface-200/50">
                        <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center">
                          <FiHeart className="w-4 h-4 text-teal-600" />
                        </div>
                        <span className="text-sm text-surface-700 font-medium flex-1">Type 2 Diabetes</span>
                        <span className="px-2 py-1 rounded-lg bg-teal-50 border border-teal-200/60 text-[10px] font-bold text-teal-600">Controlled</span>
                      </motion.div>
                    </div>

                    <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}
                      className="p-4 rounded-2xl bg-gradient-to-r from-coral-50 to-amber-50/50 border border-coral-200/40">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center">
                          <FiCpu className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-extrabold text-coral-800">AI Risk Alert</span>
                      </div>
                      <p className="text-xs text-coral-700 leading-relaxed">
                        68% cardiovascular risk detected. Annual cardiac screening recommended.
                      </p>
                      <div className="mt-2.5 w-full h-1.5 bg-coral-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '68%' }}
                          transition={{ delay: 1.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full bg-gradient-to-r from-coral-400 to-coral-600" />
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    className="absolute -left-6 top-16 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-3 shadow-float border border-surface-200/50">
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
                    className="absolute -right-4 bottom-12 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-3 shadow-float border border-surface-200/50">
                    <div className="w-9 h-9 rounded-xl bg-ocean-50 border border-ocean-200/40 flex items-center justify-center">
                      <FiLock className="w-4 h-4 text-ocean-600" />
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
        </motion.div>
      </section>

      {/* ══ STATS ══════════════════════════════ */}
      <section className="py-6 border-y border-surface-200/50 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {[
              { value: '10,000+', label: 'Health IDs Created', icon: FiUsers },
              { value: '500+', label: 'Verified Doctors', icon: FiHeart },
              { value: '99.9%', label: 'Uptime', icon: FiGlobe },
              { value: '< 2s', label: 'QR Scan Time', icon: FiZap },
            ].map((stat, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <div className="flex items-center gap-3">
                  <stat.icon className="w-5 h-5 text-ocean-400" />
                  <div>
                    <p className="text-xl font-black text-surface-900 tracking-tight">{stat.value}</p>
                    <p className="text-[11px] text-surface-400 font-medium">{stat.label}</p>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ═══════════════════════════ */}
      <section className="py-28 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(12,141,237,0.03),transparent_70%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-1.5 rounded-full bg-ocean-50 border border-ocean-200/40 text-xs font-bold text-ocean-600 uppercase tracking-widest mb-4">
                Features
              </span>
              <h2 className="text-4xl font-black text-surface-950 tracking-tight mb-4">
                Everything you need for
                <br />universal health records
              </h2>
              <p className="text-base text-surface-400 max-w-xl mx-auto">
                Built for patients, doctors, and emergency responders. Secure, instant, intelligent.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FiShield, gradient: 'from-ocean-500 to-brand-600', bg: 'bg-ocean-50', title: 'Unique Health ID', desc: 'Auto-generated MV-XXXX-XXXX identifier with downloadable QR code for every patient.' },
              { icon: FiSmartphone, gradient: 'from-teal-500 to-teal-700', bg: 'bg-teal-50', title: 'Instant QR Access', desc: 'Any doctor scans the QR code, verifies via PIN, and instantly sees the full medical profile.' },
              { icon: FiActivity, gradient: 'from-coral-500 to-coral-700', bg: 'bg-coral-50', title: 'Allergy Alerts', desc: 'Drug allergies highlighted with severity badges. Life-threatening allergies impossible to miss.' },
              { icon: FiCpu, gradient: 'from-amber-500 to-coral-500', bg: 'bg-amber-50', title: 'AI Health Predictions', desc: 'AI analyzes conditions, family history, and lifestyle to predict risks and suggest screenings.' },
              { icon: FiLock, gradient: 'from-brand-500 to-ocean-600', bg: 'bg-brand-50', title: 'Privacy First', desc: '4-digit PIN protection, encrypted storage. Every access is logged and fully auditable.' },
              { icon: FiZap, gradient: 'from-teal-400 to-ocean-500', bg: 'bg-teal-50', title: 'Emergency Bypass', desc: 'When patients are unconscious, verified doctors access critical allergies, blood group, medications.' },
            ].map((f, i) => (
              <StaggerItem key={i}>
                <motion.div whileHover={{ y: -6, scale: 1.01 }}
                  className="group relative p-7 rounded-3xl border border-surface-200/50 bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-float transition-all duration-500 overflow-hidden">
                  <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full ${f.bg} blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                  <div className={`relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="relative z-10 text-base font-extrabold text-surface-900 mb-2">{f.title}</h3>
                  <p className="relative z-10 text-sm text-surface-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═══════════════════════ */}
      <section className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0c2d48 50%, #0a3f70 100%)' }}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-ocean-500/[0.08] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-500/[0.06] rounded-full blur-[80px]" />
          <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-coral-500/[0.04] rounded-full blur-[60px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-1.5 rounded-full bg-ocean-400/10 border border-ocean-400/15 text-xs font-bold text-ocean-300 uppercase tracking-widest mb-4">
                How It Works
              </span>
              <h2 className="text-4xl font-black text-white tracking-tight">
                From registration to AI insights
                <br />in under 2 minutes
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Register', desc: 'Sign up with basic info. Get your unique Health ID and QR code instantly.', icon: FiUsers },
              { step: '02', title: 'Build Profile', desc: 'Add allergies, medications, conditions, surgeries, and family history.', icon: FiHeart },
              { step: '03', title: 'Doctor Scans', desc: 'Doctor scans QR, enters your PIN, views your complete medical record.', icon: FiSmartphone },
              { step: '04', title: 'AI Predicts', desc: 'AI analyzes your data to predict health risks and suggest screenings.', icon: FiTrendingUp },
            ].map((s, i) => (
              <FadeInUp key={i} delay={i * 0.12}>
                <motion.div whileHover={{ y: -8 }} className="relative group">
                  <span className="text-6xl font-black text-white/[0.04] block mb-4 group-hover:text-white/[0.08] transition-colors duration-500">{s.step}</span>
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mb-4 group-hover:bg-ocean-500/20 group-hover:border-ocean-400/20 transition-all duration-300">
                    <s.icon className="w-5 h-5 text-white/50 group-hover:text-ocean-300 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">{s.desc}</p>
                  {i < 3 && <div className="hidden md:block absolute top-8 -right-4 w-8 border-t border-dashed border-white/[0.08]" />}
                </motion.div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════ */}
      <section className="py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="relative rounded-[2rem] overflow-hidden">
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0c2d48 0%, #0f172a 50%, #0a3f70 100%)' }} />
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '30px 30px'
              }} />
              <motion.div animate={{ x: [0, 40, 0], y: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-0 right-0 w-80 h-80 bg-ocean-500/[0.08] rounded-full blur-3xl" />
              <motion.div animate={{ x: [0, -30, 0], y: [0, 30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-0 left-0 w-60 h-60 bg-coral-500/[0.06] rounded-full blur-3xl" />

              <div className="relative px-8 sm:px-16 py-16 sm:py-20 text-center">
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-3xl bg-gradient-to-br from-ocean-400 to-teal-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-ocean-500/25">
                  <FiStar className="w-7 h-7 text-white" />
                </motion.div>

                <h2 className="text-3xl sm:text-4xl font-black text-white mb-5 tracking-tight leading-tight">
                  Ready to secure your
                  <br />health records?
                </h2>
                <p className="text-base text-white/40 mb-10 max-w-lg mx-auto leading-relaxed">
                  Create your Health ID in under 2 minutes. It's free, secure, and could save your life in an emergency.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/patient/register" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-surface-900 font-bold text-[15px] shadow-xl hover:shadow-2xl transition-all duration-300">
                      Get Started Free <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/doctor/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/15 text-white font-bold text-[15px] hover:bg-white/10 transition-all duration-300">
                      I'm a Doctor
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ══ FOOTER ═════════════════════════════ */}
      <footer className="border-t border-surface-200/50 py-10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-ocean-500 to-brand-600 flex items-center justify-center">
                <span className="text-white text-xs font-black">M</span>
              </div>
              <span className="text-sm font-bold text-surface-900">MedVault</span>
              <span className="text-xs text-surface-400 ml-2">Universal Health Identity Platform</span>
            </div>
            <span className="text-xs text-surface-400">Built for accessible, secure, and intelligent healthcare</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
