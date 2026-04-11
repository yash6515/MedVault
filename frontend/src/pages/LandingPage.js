import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem } from '../components/ui/Motion';
import { FiShield, FiActivity, FiSmartphone, FiLock, FiCpu, FiArrowRight, FiCheck, FiZap, FiHeart } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ──────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-50 via-brand-50/30 to-teal-50/20" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-brand-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-200/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Copy */}
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/60 border border-brand-200/60 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                  <span className="text-xs font-semibold text-brand-700 tracking-wide">UNIVERSAL HEALTH IDENTITY PLATFORM</span>
                </div>
              </FadeIn>

              <FadeInUp delay={0.1}>
                <h1 className="text-[3.25rem] leading-[1.1] font-extrabold tracking-tight text-surface-950 mb-6">
                  Your complete medical
                  <span className="relative inline-block ml-3">
                    <span className="relative z-10">history,</span>
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-teal-300/30 -z-0 rounded" />
                  </span>
                  <br />
                  one scan away.
                </h1>
              </FadeInUp>

              <FadeInUp delay={0.2}>
                <p className="text-lg text-surface-500 leading-relaxed max-w-lg mb-8">
                  MedVault gives every person a unique Health ID and QR code. Allergies, medications,
                  conditions — accessible instantly by any authorized doctor, anywhere in the world.
                </p>
              </FadeInUp>

              <FadeInUp delay={0.3}>
                <div className="flex flex-wrap gap-3">
                  <Link to="/patient/register" className="btn-primary btn-lg group">
                    Create Your Health ID
                    <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link to="/doctor/login" className="btn-outline btn-lg">
                    Doctor Access
                  </Link>
                </div>
              </FadeInUp>

              <FadeInUp delay={0.4}>
                <div className="flex items-center gap-6 mt-10 text-sm text-surface-500">
                  <span className="flex items-center gap-1.5"><FiCheck className="text-teal-500" /> PIN Protected</span>
                  <span className="flex items-center gap-1.5"><FiCheck className="text-teal-500" /> AI Powered</span>
                  <span className="flex items-center gap-1.5"><FiCheck className="text-teal-500" /> Instant Access</span>
                </div>
              </FadeInUp>
            </div>

            {/* Right — Hero Visual */}
            <FadeInUp delay={0.2}>
              <div className="relative">
                {/* Main Card */}
                <div className="card-glass p-6 max-w-md ml-auto">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      P
                    </div>
                    <div>
                      <p className="font-semibold text-surface-900">Priya Sharma</p>
                      <p className="text-xs text-surface-500 font-mono">MV-4829-7156</p>
                    </div>
                    <span className="ml-auto badge-success">Active</span>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-danger-50 border border-danger-200/60">
                      <FiShield className="w-4 h-4 text-danger-500 flex-shrink-0" />
                      <span className="text-xs font-bold text-danger-600 uppercase tracking-wide">Allergic to Penicillin</span>
                      <span className="badge-danger ml-auto">Severe</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 border border-surface-200/60">
                      <FiActivity className="w-4 h-4 text-brand-500 flex-shrink-0" />
                      <span className="text-sm text-surface-700">Metformin 500mg</span>
                      <span className="text-xs text-surface-400 ml-auto">Twice daily</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 border border-surface-200/60">
                      <FiHeart className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      <span className="text-sm text-surface-700">Type 2 Diabetes</span>
                      <span className="badge-success ml-auto">Controlled</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/60">
                    <div className="flex items-center gap-2 mb-1.5">
                      <FiCpu className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-xs font-bold text-amber-700">AI Risk Alert</span>
                    </div>
                    <p className="text-xs text-amber-600 leading-relaxed">
                      68% cardiovascular risk detected. Annual cardiac screening recommended.
                    </p>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -left-8 top-12 card px-4 py-2.5 flex items-center gap-2.5 shadow-float"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                    <FiSmartphone className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-surface-900">QR Scanned</p>
                    <p className="text-[10px] text-surface-400">Dr. Mehta verified</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -right-4 bottom-8 card px-4 py-2.5 flex items-center gap-2.5 shadow-float"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
                    <FiLock className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-surface-900">Access Logged</p>
                    <p className="text-[10px] text-surface-400">Apollo Hospital</p>
                  </div>
                </motion.div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-3">Features</p>
              <h2 className="text-3xl font-extrabold text-surface-950 tracking-tight">
                Everything you need for universal health records
              </h2>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: FiShield, color: 'brand',
                title: 'Unique Health ID',
                desc: 'Auto-generated MV-XXXX-XXXX identifier with downloadable QR code for every patient.'
              },
              {
                icon: FiSmartphone, color: 'teal',
                title: 'Instant QR Access',
                desc: 'Any doctor scans the QR code, verifies via PIN, and instantly sees the full medical profile.'
              },
              {
                icon: FiActivity, color: 'red',
                title: 'Allergy Alerts',
                desc: 'Drug allergies highlighted with severity badges. Life-threatening allergies are impossible to miss.'
              },
              {
                icon: FiCpu, color: 'amber',
                title: 'AI Health Predictions',
                desc: 'AI analyzes conditions, family history, and lifestyle to predict risks and suggest screenings.'
              },
              {
                icon: FiLock, color: 'violet',
                title: 'Privacy First',
                desc: '4-digit PIN protection, OTP verification, encrypted storage. Every access is logged and auditable.'
              },
              {
                icon: FiZap, color: 'teal',
                title: 'Emergency Bypass',
                desc: 'When patients are unconscious, verified doctors access critical data — allergies, blood group, medications.'
              }
            ].map((f, i) => {
              const colorMap = {
                brand: 'bg-brand-50 text-brand-600 border-brand-100',
                teal: 'bg-teal-50 text-teal-600 border-teal-100',
                red: 'bg-danger-50 text-danger-500 border-danger-100',
                amber: 'bg-amber-50 text-amber-600 border-amber-100',
                violet: 'bg-purple-50 text-purple-600 border-purple-100',
              };
              return (
                <StaggerItem key={i}>
                  <div className="group p-6 rounded-2xl border border-surface-200/60 bg-white hover:shadow-card hover:border-surface-200 transition-all duration-300">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${colorMap[f.color]}`}>
                      <f.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-[15px] font-bold text-surface-900 mb-1.5">{f.title}</h3>
                    <p className="text-sm text-surface-500 leading-relaxed">{f.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ── How It Works ──────────────────────── */}
      <section className="py-24 bg-surface-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-3">How It Works</p>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                From registration to AI insights in minutes
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Register', desc: 'Sign up with basic info. Get your unique Health ID and QR code instantly.' },
              { step: '02', title: 'Build Profile', desc: 'Add allergies, medications, conditions, surgeries, and family history.' },
              { step: '03', title: 'Doctor Scans', desc: 'Doctor scans QR, enters your PIN, and views your complete medical record.' },
              { step: '04', title: 'AI Predicts', desc: 'AI analyzes your data to predict health risks and suggest screenings.' },
            ].map((s, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <div className="relative">
                  <span className="text-5xl font-black text-white/[0.06] block mb-3">{s.step}</span>
                  <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-surface-400 leading-relaxed">{s.desc}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-6 -right-3 text-surface-600">
                      <FiArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInUp>
            <div className="card bg-gradient-to-br from-brand-600 to-brand-800 p-12 sm:p-16 border-0">
              <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                Ready to secure your health records?
              </h2>
              <p className="text-brand-200 text-lg mb-8 max-w-lg mx-auto">
                Create your Health ID in under 2 minutes. It's free, secure, and could save your life in an emergency.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/patient/register" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-brand-700 font-semibold text-[15px] shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                  Get Started Free <FiArrowRight />
                </Link>
                <Link to="/doctor/register" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-white/30 text-white font-semibold text-[15px] hover:bg-white/10 transition-all">
                  I'm a Doctor
                </Link>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ── Footer ────────────────────────────── */}
      <footer className="border-t border-surface-200/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <span className="text-sm text-surface-400 font-medium">
            MedVault — Universal Health Identity Platform
          </span>
          <span className="text-xs text-surface-400">
            Built for accessible, secure, and intelligent healthcare
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
