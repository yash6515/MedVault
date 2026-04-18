import { useState, useEffect, useRef } from 'react';
import { getAIPredictions, getPatientProfile } from '../services/api';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  FiCpu, FiAlertCircle, FiHeart, FiCheckCircle, FiActivity,
  FiRefreshCw, FiInfo, FiTrendingUp, FiShield, FiZap,
  FiChevronRight, FiClock, FiTarget, FiArrowUpRight, FiArrowDownRight
} from 'react-icons/fi';

/* ─── Animated Counter ─────────────────── */
const AnimatedNumber = ({ value, duration = 1.2 }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = (now - startTime) / (duration * 1000);
      if (elapsed >= 1) { setDisplay(end); return; }
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, isInView, duration]);

  return <span ref={ref}>{display}</span>;
};

/* ─── Glowing Risk Ring ────────────────── */
const RiskRing = ({ percentage, size = 120, strokeWidth = 10, label, sublabel, delay = 0 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const isHigh = percentage >= 60;
  const isMed = percentage >= 35;
  const color = isHigh ? '#ef4444' : isMed ? '#f59e0b' : '#10b981';
  const glowColor = isHigh ? 'rgba(239,68,68,0.15)' : isMed ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)';
  const bgRing = isHigh ? 'rgba(239,68,68,0.08)' : isMed ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)';

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full blur-xl" style={{ background: glowColor }} />

        <svg width={size} height={size} className="-rotate-90 relative z-10">
          {/* Background ring */}
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={bgRing} strokeWidth={strokeWidth} />
          {/* Animated progress ring */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color}
            strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: delay + 0.3 }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-2xl font-bold tracking-tight" style={{ color }}>
            <AnimatedNumber value={percentage} />
          </span>
          <span className="text-[10px] font-bold text-surface-400 -mt-0.5 uppercase tracking-wider">% risk</span>
        </div>
      </div>
      {label && <p className="text-sm font-bold text-surface-900 mt-3">{label}</p>}
      {sublabel && <p className="text-[11px] text-surface-400 mt-0.5">{sublabel}</p>}
    </motion.div>
  );
};

/* ─── Risk Level Badge ─────────────────── */
const RiskBadge = ({ percentage }) => {
  if (percentage >= 60) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-200/50">
      <FiArrowUpRight className="w-3 h-3 text-red-500" />
      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">High Risk</span>
    </span>
  );
  if (percentage >= 35) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-200/50">
      <FiTrendingUp className="w-3 h-3 text-amber-500" />
      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Moderate</span>
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-200/50">
      <FiArrowDownRight className="w-3 h-3 text-emerald-500" />
      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Low Risk</span>
    </span>
  );
};

/* ─── Shimmer Loading Card ─────────────── */
const ShimmerCard = ({ delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
    className="rounded-2xl bg-surface-0 border border-surface-200/60 p-5 space-y-4"
  >
    <div className="flex items-center justify-between">
      <div className="h-5 w-20 rounded-full bg-surface-100 animate-pulse" />
      <div className="h-5 w-5 rounded-full bg-surface-100 animate-pulse" />
    </div>
    <div className="h-8 w-24 rounded-lg bg-surface-100 animate-pulse" />
    <div className="h-2 w-full rounded-full bg-surface-100 animate-pulse" />
    <div className="space-y-2">
      <div className="h-4 w-3/4 rounded bg-surface-100 animate-pulse" />
      <div className="h-3 w-1/2 rounded bg-surface-100 animate-pulse" />
    </div>
  </motion.div>
);

/* ─── Section Header Component ─────────── */
const SectionHeader = ({ icon: Icon, title, subtitle, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex items-center gap-3 mb-4"
  >
    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <h3 className="text-base font-bold text-surface-900 tracking-tight">{title}</h3>
      <p className="text-[11px] text-surface-400">{subtitle}</p>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════
   ██ MAIN COMPONENT
   ═══════════════════════════════════════════ */
const AIPredictions = () => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await getPatientProfile();
        if (data.aiPredictions?.lastUpdated) {
          setPredictions({
            riskScores: data.aiPredictions.riskScores,
            warnings: data.aiPredictions.warnings,
            recommendations: data.aiPredictions.recommendations,
            screeningSuggestions: data.aiPredictions.screeningSuggestions
          });
        }
      } catch (err) { console.error(err); }
    };
    loadProfile();
  }, []);

  const generatePredictions = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const { data } = await getAIPredictions(forceRefresh);
      setPredictions(data.predictions);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const overallRisk = predictions?.riskScores?.length
    ? Math.round(predictions.riskScores.reduce((s, r) => s + r.percentage, 0) / predictions.riskScores.length)
    : 0;

  const tabs = [
    { id: 'overview', label: 'Risk Overview', icon: FiTarget },
    { id: 'insights', label: 'Insights & Actions', icon: FiZap },
    { id: 'screenings', label: 'Screenings', icon: FiShield },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-16">

        {/* ══ Hero Header ═════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden mb-8"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />

          {/* Floating orbs */}
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 left-10 w-56 h-56 bg-brand-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl"
          />

          <div className="relative px-8 py-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-5">
                {/* Animated icon */}
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl shadow-amber-500/30"
                >
                  <FiCpu className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                  >
                    AI Health Insights
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-sm text-white/50 mt-1"
                  >
                    Personalized risk analysis powered by Claude AI & your medical profile
                  </motion.p>
                </div>
              </div>

              {predictions && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => generatePredictions(true)}
                  disabled={loading}
                  className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] text-white text-[13px] font-bold hover:bg-white/[0.15] transition-all duration-300"
                >
                  <FiRefreshCw className={`w-4 h-4 transition-transform duration-500 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                  {loading ? 'Analyzing...' : 'Refresh Analysis'}
                </motion.button>
              )}
            </div>

            {/* Quick stats bar */}
            {predictions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-wrap gap-4 mt-7 pt-6 border-t border-white/[0.06]"
              >
                {[
                  { label: 'Risk Factors', value: predictions.riskScores?.length || 0, icon: FiActivity },
                  { label: 'Warnings', value: predictions.warnings?.length || 0, icon: FiAlertCircle },
                  { label: 'Actions', value: predictions.recommendations?.length || 0, icon: FiCheckCircle },
                  { label: 'Screenings', value: predictions.screeningSuggestions?.length || 0, icon: FiShield },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.06]"
                  >
                    <stat.icon className="w-3.5 h-3.5 text-white/40" />
                    <span className="text-white font-bold text-sm">{stat.value}</span>
                    <span className="text-white/30 text-[11px] font-medium">{stat.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ══ Disclaimer ═══════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-start gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/40 mb-8"
        >
          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <FiInfo className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-[12px] text-amber-700 leading-relaxed">
            <span className="font-bold">Medical Disclaimer:</span> AI-generated health insights for informational purposes only. These predictions are not a substitute for professional medical diagnosis. Always consult your healthcare provider.
          </p>
        </motion.div>

        {/* ══ Empty State ══════════════════════ */}
        {!predictions && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl border-2 border-dashed border-surface-200 bg-surface-0 p-16 text-center overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10"
            >
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-100 via-orange-100 to-red-50 border border-amber-200/50 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-100/50">
                <FiZap className="w-11 h-11 text-amber-500" />
              </div>
            </motion.div>

            <h2 className="text-2xl font-bold text-surface-900 mb-3 relative z-10">Analyze Your Health Profile</h2>
            <p className="text-sm text-surface-500 max-w-lg mx-auto mb-10 leading-relaxed relative z-10">
              Our AI examines your conditions, medications, family history, and lifestyle to identify potential health risks and provide personalized recommendations.
            </p>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => generatePredictions(false)}
              disabled={loading}
              className="relative z-10 inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300"
            >
              <FiCpu className="w-5 h-5" />
              Generate AI Predictions
              <FiChevronRight className="w-4 h-4" />
            </motion.button>

            <div className="flex items-center justify-center gap-6 mt-8 relative z-10">
              {['Powered by Claude AI', 'Evidence-based', 'Privacy-first'].map((t, i) => (
                <span key={i} className="text-[11px] text-surface-400 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* ══ Loading State ════════════════════ */}
        {loading && !predictions && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map(i => <ShimmerCard key={i} delay={i * 0.1} />)}
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <ShimmerCard delay={0.4} />
              <ShimmerCard delay={0.5} />
            </div>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center text-sm text-surface-400 font-medium"
            >
              🧠 AI is analyzing your health profile...
            </motion.p>
          </div>
        )}

        {/* ══ Predictions Content ══════════════ */}
        {predictions && (
          <div className="space-y-8">

            {/* ── Tab Navigation ──────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-1 p-1.5 rounded-2xl bg-surface-100/80 border border-surface-200/60 w-fit"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 ${
                    activeTab === tab.id ? 'text-surface-900' : 'text-surface-400 hover:text-surface-600'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeAITab"
                      className="absolute inset-0 bg-surface-0 rounded-xl shadow-soft border border-surface-200/40"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <tab.icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </motion.div>

            {/* ── Tab Content ─────────────────── */}
            <AnimatePresence mode="wait">

              {/* ════ OVERVIEW TAB ════════════════ */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  {/* Overall Risk + Summary */}
                  <div className="grid lg:grid-cols-5 gap-5">
                    {/* Overall Risk Card */}
                    <div className="lg:col-span-2 rounded-3xl bg-surface-0/70 backdrop-blur-sm border border-surface-200/40 p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-card transition-shadow duration-300">
                      <RiskRing percentage={overallRisk} size={160} strokeWidth={12} />
                      <p className="text-lg font-bold text-surface-900 mt-5">Overall Health Risk</p>
                      <p className="text-[12px] text-surface-400 mt-1 max-w-[200px]">
                        Weighted average across {predictions.riskScores?.length || 0} identified risk factors
                      </p>
                      <div className="flex items-center gap-3 mt-5">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> 0-34% Low
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold">
                          <span className="w-2 h-2 rounded-full bg-amber-500" /> 35-59% Med
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold">
                          <span className="w-2 h-2 rounded-full bg-red-500" /> 60%+ High
                        </span>
                      </div>
                    </div>

                    {/* Individual Risk Cards */}
                    <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
                      {predictions.riskScores?.map((r, i) => {
                        const isHigh = r.percentage >= 60;
                        const isMed = r.percentage >= 35;
                        const gradientBg = isHigh
                          ? 'from-red-50/80 to-white'
                          : isMed ? 'from-amber-50/80 to-white'
                          : 'from-emerald-50/80 to-white';
                        const barGradient = isHigh
                          ? 'from-red-500 via-rose-500 to-red-400'
                          : isMed ? 'from-amber-500 via-yellow-500 to-amber-400'
                          : 'from-emerald-500 via-teal-500 to-emerald-400';

                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className={`group relative rounded-2xl bg-gradient-to-br ${gradientBg} border border-surface-200/60 p-5 cursor-default overflow-hidden transition-shadow duration-300 hover:shadow-float`}
                          >
                            {/* Decorative corner glow */}
                            <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                              isHigh ? 'bg-red-200/40' : isMed ? 'bg-amber-200/40' : 'bg-emerald-200/40'
                            }`} />

                            <div className="relative z-10">
                              <div className="flex items-center justify-between mb-4">
                                <RiskBadge percentage={r.percentage} />
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                                  isHigh ? 'bg-red-100' : isMed ? 'bg-amber-100' : 'bg-emerald-100'
                                }`}>
                                  <FiTrendingUp className={`w-4 h-4 ${
                                    isHigh ? 'text-red-500' : isMed ? 'text-amber-500' : 'text-emerald-500'
                                  }`} />
                                </div>
                              </div>

                              <div className="mb-3">
                                <span className={`text-2xl font-bold tracking-tight ${
                                  isHigh ? 'text-red-500' : isMed ? 'text-amber-500' : 'text-emerald-500'
                                }`}>
                                  <AnimatedNumber value={r.percentage} />
                                  <span className="text-lg">%</span>
                                </span>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden mb-4">
                                <motion.div
                                  className={`h-full rounded-full bg-gradient-to-r ${barGradient}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${r.percentage}%` }}
                                  transition={{ duration: 1.2, delay: 0.4 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                />
                              </div>

                              <p className="text-[13px] font-bold text-surface-900 leading-snug">{r.condition}</p>
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <FiClock className="w-3 h-3 text-surface-300" />
                                <p className="text-[11px] text-surface-400 font-medium">{r.timeframe}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ════ INSIGHTS TAB ════════════════ */}
              {activeTab === 'insights' && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="grid lg:grid-cols-2 gap-6"
                >
                  {/* Warnings */}
                  {predictions.warnings?.length > 0 && (
                    <div className="rounded-3xl bg-surface-0 border border-surface-200/60 overflow-hidden shadow-sm hover:shadow-card transition-shadow duration-300">
                      <div className="px-6 py-5 border-b border-surface-100">
                        <SectionHeader
                          icon={FiAlertCircle}
                          title="⚠️ Early Warning Alerts"
                          subtitle="Critical patterns detected in your health data"
                          gradient="from-amber-500 to-orange-600"
                        />
                      </div>
                      <div className="p-5 space-y-3">
                        {predictions.warnings.map((w, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.12 }}
                            whileHover={{ x: 4 }}
                            className="group flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 to-orange-50/30 border border-amber-200/30 hover:border-amber-300/50 transition-all duration-300"
                          >
                            <motion.div
                              whileHover={{ scale: 1.15, rotate: 10 }}
                              className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-200/50"
                            >
                              <span className="text-white text-xs font-bold">!</span>
                            </motion.div>
                            <div>
                              <span className="text-[13px] text-surface-700 leading-relaxed font-medium">{w}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {predictions.recommendations?.length > 0 && (
                    <div className="rounded-3xl bg-surface-0 border border-surface-200/60 overflow-hidden shadow-sm hover:shadow-card transition-shadow duration-300">
                      <div className="px-6 py-5 border-b border-surface-100">
                        <SectionHeader
                          icon={FiHeart}
                          title="💡 Personalized Recommendations"
                          subtitle="Evidence-based actions to improve your health"
                          gradient="from-emerald-500 to-teal-600"
                          delay={0.1}
                        />
                      </div>
                      <div className="p-5 space-y-3">
                        {predictions.recommendations.map((r, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            whileHover={{ x: 4 }}
                            className="group flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/30 border border-emerald-200/30 hover:border-emerald-300/50 transition-all duration-300"
                          >
                            <motion.div
                              whileHover={{ scale: 1.15, rotate: -10 }}
                              className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-200/50"
                            >
                              <FiCheckCircle className="w-4 h-4 text-white" />
                            </motion.div>
                            <div>
                              <span className="text-[13px] text-surface-700 leading-relaxed font-medium">{r}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ════ SCREENINGS TAB ══════════════ */}
              {activeTab === 'screenings' && (
                <motion.div
                  key="screenings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="rounded-3xl bg-surface-0 border border-surface-200/60 overflow-hidden shadow-sm">
                    <div className="px-6 py-5 border-b border-surface-100">
                      <SectionHeader
                        icon={FiShield}
                        title="🔬 Recommended Screenings"
                        subtitle="Tests & checkups suggested based on your risk profile"
                        gradient="from-brand-500 to-indigo-600"
                      />
                    </div>
                    <div className="p-5 grid sm:grid-cols-2 gap-4">
                      {predictions.screeningSuggestions?.map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.1 }}
                          whileHover={{ y: -3, scale: 1.01 }}
                          className="group relative p-5 rounded-2xl bg-gradient-to-br from-brand-50/80 via-indigo-50/50 to-surface-0 border border-brand-200/30 hover:border-brand-300/50 hover:shadow-lg transition-all duration-300 overflow-hidden dark:from-brand-500/10 dark:via-indigo-500/5 dark:to-surface-100 dark:border-brand-400/20"
                        >
                          {/* Corner decoration */}
                          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-brand-100/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="relative z-10 flex items-start gap-4">
                            <motion.div
                              whileHover={{ rotate: 15 }}
                              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-100 to-indigo-100 border border-brand-200/40 flex items-center justify-center flex-shrink-0"
                            >
                              <FiActivity className="w-5 h-5 text-brand-600" />
                            </motion.div>
                            <div>
                              <span className="text-[13px] text-surface-800 leading-relaxed font-semibold">{s}</span>
                              <div className="flex items-center gap-1.5 mt-2">
                                <FiClock className="w-3 h-3 text-brand-400" />
                                <span className="text-[10px] text-brand-500 font-semibold">Consult your doctor to schedule</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Last Updated Footer ─────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-2 pt-4"
            >
              <FiClock className="w-3 h-3 text-surface-300" />
              <p className="text-[11px] text-surface-300 font-medium">
                Analysis generated by Claude AI • Results cached for consistency
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPredictions;
