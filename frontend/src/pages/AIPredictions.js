import { useState, useEffect } from 'react';
import { getAIPredictions, getPatientProfile } from '../services/api';
import { motion } from 'framer-motion';
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem } from '../components/ui/Motion';
import {
  FiCpu, FiAlertCircle, FiHeart, FiCheckCircle, FiActivity,
  FiRefreshCw, FiInfo, FiTrendingUp, FiShield, FiZap
} from 'react-icons/fi';

const RiskRing = ({ percentage, size = 100, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const isHigh = percentage >= 60;
  const isMed = percentage >= 35;
  const color = isHigh ? '#ef4444' : isMed ? '#f59e0b' : '#10b981';
  const bgColor = isHigh ? '#fef2f2' : isMed ? '#fffbeb' : '#ecfdf5';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill={bgColor} stroke="#f1f5f9" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black tracking-tight" style={{ color }}>{percentage}</span>
        <span className="text-[10px] font-semibold text-surface-400 -mt-0.5">%risk</span>
      </div>
    </div>
  );
};

const RiskLevelBadge = ({ percentage }) => {
  if (percentage >= 60) return <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-600 text-[10px] font-bold uppercase">High</span>;
  if (percentage >= 35) return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-600 text-[10px] font-bold uppercase">Moderate</span>;
  return <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-600 text-[10px] font-bold uppercase">Low</span>;
};

const AIPredictions = () => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await getPatientProfile();
        setProfile(data);
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

  const generatePredictions = async () => {
    setLoading(true);
    try {
      const { data } = await getAIPredictions();
      setPredictions(data.predictions);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const overallRisk = predictions?.riskScores?.length
    ? Math.round(predictions.riskScores.reduce((s, r) => s + r.percentage, 0) / predictions.riskScores.length)
    : 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-12">

        {/* ── Header Card ──────────────────── */}
        <FadeIn>
          <div className="relative rounded-2xl overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900" />
            <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px'}} />
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/[0.07] rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-brand-500/[0.05] rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

            <div className="relative px-6 sm:px-8 py-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <FiCpu className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold text-white tracking-tight">AI Health Insights</h1>
                    <p className="text-sm text-surface-400 mt-0.5">Personalized risk analysis powered by your medical data</p>
                  </div>
                </div>
                {predictions && (
                  <button onClick={generatePredictions} disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white text-[13px] font-semibold hover:bg-white/20 transition-all">
                    <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Analyzing...' : 'Refresh Analysis'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Disclaimer ───────────────────── */}
        <FadeIn>
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-50/70 border border-amber-200/50 mb-6">
            <FiInfo className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-700 leading-relaxed">
              <span className="font-bold">Disclaimer:</span> AI-based health suggestions only. Always consult a qualified doctor for medical advice.
            </p>
          </div>
        </FadeIn>

        {/* ── No Predictions State ──────────── */}
        {!predictions && (
          <FadeInUp>
            <div className="card p-16 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/40 flex items-center justify-center mx-auto mb-5">
                <FiZap className="w-9 h-9 text-amber-500" />
              </div>
              <h2 className="text-xl font-extrabold text-surface-900 mb-2">Analyze Your Health Profile</h2>
              <p className="text-sm text-surface-500 max-w-md mx-auto mb-8 leading-relaxed">
                Our AI engine examines your conditions, medications, family history, and lifestyle to identify potential health risks before they become serious.
              </p>
              <button onClick={generatePredictions} disabled={loading} className="btn-primary btn-lg mx-auto">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing your health profile...
                  </span>
                ) : (
                  <span className="flex items-center gap-2"><FiCpu className="w-4 h-4" /> Generate AI Predictions</span>
                )}
              </button>
            </div>
          </FadeInUp>
        )}

        {/* ── Predictions Results ───────────── */}
        {predictions && (
          <div className="space-y-6">

            {/* ── Overview Score + Risk Cards ── */}
            <div className="grid lg:grid-cols-4 gap-4">
              {/* Overall Score */}
              <FadeInUp>
                <div className="card p-6 flex flex-col items-center justify-center text-center lg:row-span-1">
                  <RiskRing percentage={overallRisk} size={120} strokeWidth={10} />
                  <p className="text-sm font-bold text-surface-900 mt-3">Overall Risk</p>
                  <p className="text-[11px] text-surface-400 mt-0.5">Averaged across all factors</p>
                </div>
              </FadeInUp>

              {/* Individual Risk Cards */}
              <div className="lg:col-span-3">
                <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {predictions.riskScores?.map((r, i) => {
                    const isHigh = r.percentage >= 60;
                    const isMed = r.percentage >= 35;
                    return (
                      <StaggerItem key={i}>
                        <div className={`card p-5 border ${
                          isHigh ? 'border-red-200/60' : isMed ? 'border-amber-200/60' : 'border-emerald-200/60'
                        } hover:shadow-float transition-all duration-300`}>
                          <div className="flex items-start justify-between mb-4">
                            <RiskLevelBadge percentage={r.percentage} />
                            <FiTrendingUp className={`w-4 h-4 ${
                              isHigh ? 'text-red-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
                            }`} />
                          </div>

                          {/* Inline bar */}
                          <div className="mb-3">
                            <div className="flex items-end justify-between mb-1.5">
                              <span className={`text-3xl font-black tracking-tight ${
                                isHigh ? 'text-red-500' : isMed ? 'text-amber-500' : 'text-emerald-500'
                              }`}>{r.percentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${
                                  isHigh ? 'bg-gradient-to-r from-red-500 to-rose-400' :
                                  isMed ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                                  'bg-gradient-to-r from-emerald-500 to-teal-400'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${r.percentage}%` }}
                                transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                              />
                            </div>
                          </div>

                          <p className="text-[13px] font-bold text-surface-900 leading-snug">{r.condition}</p>
                          <p className="text-[11px] text-surface-400 mt-0.5">{r.timeframe}</p>
                        </div>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              </div>
            </div>

            {/* ── Warnings + Recommendations ── */}
            <div className="grid lg:grid-cols-2 gap-5">
              {/* Warnings */}
              {predictions.warnings?.length > 0 && (
                <FadeInUp delay={0.1}>
                  <div className="card overflow-hidden h-full">
                    <div className="px-5 py-4 border-b border-surface-200/60 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
                        <FiAlertCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-bold text-surface-900">Early Warning Alerts</h3>
                        <p className="text-[11px] text-surface-400">Patterns detected in your health data</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      {predictions.warnings.map((w, i) => (
                        <motion.div key={i}
                          initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay: 0.3 + i * 0.1}}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/40"
                        >
                          <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-[10px] font-black">!</span>
                          </div>
                          <span className="text-[13px] text-amber-800 leading-relaxed">{w}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </FadeInUp>
              )}

              {/* Recommendations */}
              {predictions.recommendations?.length > 0 && (
                <FadeInUp delay={0.15}>
                  <div className="card overflow-hidden h-full">
                    <div className="px-5 py-4 border-b border-surface-200/60 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
                        <FiHeart className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-bold text-surface-900">Lifestyle Recommendations</h3>
                        <p className="text-[11px] text-surface-400">Actions to lower your risk</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      {predictions.recommendations.map((r, i) => (
                        <motion.div key={i}
                          initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay: 0.35 + i * 0.08}}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/40"
                        >
                          <FiCheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-[13px] text-emerald-800 leading-relaxed">{r}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </FadeInUp>
              )}
            </div>

            {/* ── Screening Suggestions ────── */}
            {predictions.screeningSuggestions?.length > 0 && (
              <FadeInUp delay={0.2}>
                <div className="card overflow-hidden">
                  <div className="px-5 py-4 border-b border-surface-200/60 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center shadow-sm">
                      <FiShield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-bold text-surface-900">Recommended Screenings</h3>
                      <p className="text-[11px] text-surface-400">Tests suggested based on your risk profile</p>
                    </div>
                  </div>
                  <div className="p-4 grid sm:grid-cols-2 gap-2">
                    {predictions.screeningSuggestions.map((s, i) => (
                      <motion.div key={i}
                        initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay: 0.4 + i * 0.08}}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-50/60 border border-brand-200/30"
                      >
                        <FiActivity className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                        <span className="text-[13px] text-brand-800 leading-relaxed">{s}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPredictions;
