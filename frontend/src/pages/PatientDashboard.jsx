import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getPatientProfile, getVisits, addSelfVisit, parseDocument, extractMedicalData, updateWeight } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiCalendar, FiActivity, FiMapPin,
  FiFileText, FiChevronRight, FiMaximize2,
  FiDownload, FiDroplet, FiAlertTriangle, FiHeart,
  FiEdit3, FiPhone, FiCpu, FiArrowUpRight, FiMail,
  FiPlus, FiX, FiCheck, FiLoader, FiUploadCloud, FiZap, FiTrendingUp
} from 'react-icons/fi';
import { FadeInUp, StaggerContainer, StaggerItem, AnimCount } from '../components/ui/Motion';

const easeOutCurve = [0.16, 1, 0.3, 1];

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddVisit, setShowAddVisit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, visitsRes] = await Promise.all([
          getPatientProfile(),
          getVisits()
        ]);
        setProfile(profileRes.data);
        setVisits(visitsRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVisitAdded = (newVisit) => {
    setVisits(prev => [newVisit, ...prev]);
    setShowAddVisit(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!profile) return null;

  const age = profile.dateOfBirth ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : '—';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiActivity, count: 0 },
    { id: 'visits', label: 'Medical History', icon: FiCalendar, count: visits.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* ══ Header Section ══════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-8 shadow-card group"
        >
          <div className="absolute inset-0 bg-surface-950" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-[20%] -right-[10%] w-[60%] h-[120%] bg-brand-500/30 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-[30%] -left-[10%] w-[50%] h-[100%] bg-teal-500/20 rounded-full blur-[80px]"
          />

          <div className="relative p-6 md:p-8 backdrop-blur-3xl border border-white/10">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative flex-shrink-0"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-teal-400 blur-xl opacity-40" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl overflow-hidden">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-white">{profile.fullName?.charAt(0)}</span>
                  )}
                </div>
              </motion.div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                  {profile.fullName}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-semibold text-white/90 backdrop-blur-sm">
                    <FiFileText className="w-3.5 h-3.5 text-brand-300" />
                    <span className="font-mono tracking-wider opacity-80">{profile.healthId}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60">
                    <FiMail className="w-3.5 h-3.5" />
                    {profile.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60">
                    <FiUser className="w-3.5 h-3.5" />
                    {profile.gender} &middot; {age} yrs
                  </span>
                  {profile.bloodGroup && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/20 text-red-200 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider">
                      <FiDroplet className="w-3 h-3" />
                      {profile.bloodGroup}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-3 flex-shrink-0"
              >
                <Link to="/patient/qr" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-surface-950 text-xs font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200">
                  <FiMaximize2 className="w-4 h-4" /> QR ID
                </Link>
                <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-all duration-200">
                  <FiDownload className="w-4 h-4" /> Export
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ══ Tab Navigation ═══════════════════ */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface-100/80 border border-surface-200/50 w-fit backdrop-blur-sm"
          >
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                  activeTab === tab.id ? 'text-surface-950' : 'text-surface-400 hover:text-surface-600'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="dashTab"
                    className="absolute inset-0 bg-white border border-surface-200/40 rounded-xl shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? 'text-brand-600' : ''}`} />
                <span className="relative z-10">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`relative z-10 min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    activeTab === tab.id ? 'bg-brand-600 text-white' : 'bg-surface-200 text-surface-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </div>

        {/* ══ Tab Content ══════════════════════ */}
        <AnimatePresence mode="wait">

          {/* ════ OVERVIEW ═════════════════════ */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: easeOutCurve }}
            >
              <div className="grid lg:grid-cols-12 gap-8">
                {/* ── Left Content (8/12) ──── */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Stats Grid */}
                  <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { icon: FiDroplet, label: 'Blood Group', value: profile.bloodGroup || '—', gradient: 'from-rose-500 to-pink-600', isText: true },
                      { icon: FiAlertTriangle, label: 'Allergies', value: profile.allergies?.length || 0, gradient: 'from-amber-500 to-orange-600' },
                      { icon: FiHeart, label: 'Active Meds', value: profile.currentMedications?.length || 0, gradient: 'from-brand-500 to-indigo-600' },
                      { icon: FiCalendar, label: 'Visits', value: visits.length, gradient: 'from-teal-500 to-emerald-600' },
                    ].map((stat, i) => (
                      <StaggerItem key={i}>
                        <motion.div
                          whileHover={{ y: -4 }}
                          className="group relative rounded-2xl bg-white border border-surface-200/50 p-5 overflow-hidden shadow-card hover:shadow-float transition-all duration-300"
                        >
                          <div className={`relative z-10 w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-md`}>
                            <stat.icon className="w-4 h-4 text-white" />
                          </div>
                          <p className="relative z-10 text-2xl font-bold text-surface-950 tracking-tight">
                            {stat.isText ? stat.value : <AnimCount value={stat.value} />}
                          </p>
                          <p className="relative z-10 text-[10px] font-semibold text-surface-400 uppercase tracking-wider mt-1.5">{stat.label}</p>
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>

                  {/* Medical Record Cards */}
                  <div className="space-y-5">
                    {/* Allergies */}
                    {profile.allergies?.length > 0 && (
                      <FadeInUp delay={0.1}>
                        <div className="bg-white rounded-2xl border border-surface-200/50 overflow-hidden shadow-card">
                          <div className="px-5 py-4 bg-red-50/50 border-b border-red-100/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md">
                                <FiAlertTriangle className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-red-900">Drug Allergies</h3>
                                <p className="text-[10px] text-red-500/70">Critical alerts for providers</p>
                              </div>
                            </div>
                            <span className="px-2.5 py-1 bg-red-600 text-white text-[9px] font-bold rounded-lg uppercase tracking-wider">Alert</span>
                          </div>
                          <div className="p-4 space-y-2">
                            {profile.allergies.map((a, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-red-100/50 hover:bg-red-50/30 transition-all duration-200"
                              >
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-sm font-semibold text-red-900 flex-1">{a.name}</span>
                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                                  a.severity === 'life-threatening' || a.severity === 'severe'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>{a.severity}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </FadeInUp>
                    )}

                    {/* Medications */}
                    {profile.currentMedications?.length > 0 && (
                      <FadeInUp delay={0.15}>
                        <div className="bg-white rounded-2xl border border-surface-200/50 overflow-hidden shadow-card hover:shadow-float transition-shadow duration-300">
                          <div className="px-5 py-4 border-b border-surface-100/50 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-md">
                              <FiHeart className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-surface-950">Current Medications</h3>
                              <p className="text-[10px] text-surface-400">Active prescriptions</p>
                            </div>
                          </div>
                          <div className="divide-y divide-surface-100/50">
                            {profile.currentMedications.map((m, i) => (
                              <div
                                key={i}
                                className="px-5 py-3.5 flex items-center justify-between hover:bg-brand-50/20 transition-colors duration-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-600 font-bold text-xs">
                                    {i + 1}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-surface-950">{m.name}</p>
                                    <p className="text-[10px] text-surface-400 mt-0.5">{m.frequency}</p>
                                  </div>
                                </div>
                                <span className="px-3 py-1.5 rounded-lg bg-white border border-brand-100 text-brand-700 text-xs font-semibold">{m.dosage}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </FadeInUp>
                    )}
                  </div>
                </div>

                {/* ── Right Sidebar (4/12) ──── */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Quick Actions */}
                  <FadeInUp delay={0.2}>
                    <div className="bg-white rounded-2xl border border-surface-200/50 p-2 shadow-card">
                      <p className="px-4 pt-3 pb-2 text-[10px] font-bold text-surface-400 uppercase tracking-wider">Quick Actions</p>
                      {[
                        { to: '/patient/medical-profile', icon: FiEdit3, label: 'Health Profile', sub: 'Update medical data', color: 'from-brand-500 to-indigo-600' },
                        { to: '/patient/predictions', icon: FiCpu, label: 'AI Health Lab', sub: 'Predictive risk scores', color: 'from-amber-500 to-orange-600' },
                        { to: '/patient/qr', icon: FiMaximize2, label: 'Visual ID', sub: 'Your Health QR', color: 'from-teal-500 to-emerald-600' },
                      ].map((action, i) => (
                        <motion.div key={i} whileHover={{ x: 4 }}>
                          <Link to={action.to} className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-surface-50 transition-all duration-200 group">
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform`}>
                              <action.icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-surface-950">{action.label}</p>
                              <p className="text-[10px] text-surface-400 mt-0.5">{action.sub}</p>
                            </div>
                            <FiChevronRight className="w-4 h-4 text-surface-200 group-hover:text-brand-500 transition-colors" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </FadeInUp>

                  {/* Weight Tracker */}
                  <FadeInUp delay={0.22}>
                    <WeightTracker
                      currentWeight={profile.currentWeight}
                      weightHistory={profile.weightHistory}
                      onWeightUpdated={(w, h) => setProfile(prev => ({ ...prev, currentWeight: w, weightHistory: h }))}
                    />
                  </FadeInUp>

                  {/* AI Preview Card */}
                  {profile.aiPredictions?.riskScores?.length > 0 && (
                    <FadeInUp delay={0.25}>
                      <Link to="/patient/predictions" className="block group">
                        <motion.div
                          whileHover={{ y: -4 }}
                          className="relative rounded-2xl bg-surface-950 p-6 shadow-card overflow-hidden border border-white/5"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-[50px]" />
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full blur-[30px]" />

                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                                  <FiCpu className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Diagnostics</h3>
                              </div>
                              <FiArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                            </div>

                            <div className="space-y-4">
                              {profile.aiPredictions.riskScores.slice(0, 3).map((r, i) => (
                                <div key={i}>
                                  <div className="flex justify-between text-[10px] mb-1.5 font-semibold">
                                    <span className="text-white/40">{r.condition}</span>
                                    <span className={r.percentage >= 60 ? 'text-rose-400' : 'text-teal-400'}>
                                      {r.percentage}%
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                      className={`h-full rounded-full ${r.percentage >= 60 ? 'bg-rose-500' : 'bg-teal-500'}`}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${r.percentage}%` }}
                                      transition={{ duration: 1.2, delay: 0.3 + i * 0.15 }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-5 flex items-center gap-1.5 text-brand-400 text-[10px] font-bold uppercase tracking-wider">
                              View Full Report <FiChevronRight className="w-3 h-3" />
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </FadeInUp>
                  )}

                  {/* Emergency Contacts */}
                  {profile.emergencyContacts?.length > 0 && (
                    <FadeInUp delay={0.3}>
                      <div className="bg-white rounded-2xl border border-surface-200/50 p-5 shadow-card">
                         <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                               <FiPhone className="w-4 h-4 text-red-500" />
                            </div>
                            <h3 className="text-xs font-bold text-surface-950 uppercase tracking-wider">Emergency</h3>
                         </div>
                         <div className="space-y-2.5">
                            {profile.emergencyContacts.map((ec, i) => (
                              <div key={i} className="p-3 rounded-xl bg-surface-50 border border-surface-100 hover:border-red-200 transition-all">
                                 <p className="text-xs font-bold text-surface-950">{ec.name}</p>
                                 <div className="flex items-center justify-between mt-1">
                                    <span className="text-[10px] text-surface-400">{ec.relationship}</span>
                                    <p className="text-[11px] font-semibold text-brand-600">{ec.phone}</p>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                    </FadeInUp>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ════ VISITS ═══��═══════════════════ */}
          {activeTab === 'visits' && (
            <motion.div
              key="visits"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: easeOutCurve }}
            >
              <div className="max-w-4xl mx-auto">
                {/* Add Visit Button */}
                <div className="flex justify-end mb-5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddVisit(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md hover:bg-brand-700 transition-all"
                  >
                    <FiPlus className="w-4 h-4" /> Add New Visit
                  </motion.button>
                </div>

                {/* Add Visit Modal */}
                <AnimatePresence>
                  {showAddVisit && (
                    <AddVisitModal
                      onClose={() => setShowAddVisit(false)}
                      onVisitAdded={handleVisitAdded}
                    />
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  {visits.length === 0 && !showAddVisit ? (
                    <div className="bg-white rounded-2xl border border-surface-200/50 p-12 text-center shadow-card">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                         <FiCalendar className="w-7 h-7 text-slate-300" />
                      </div>
                      <h3 className="text-base font-bold text-surface-950">No medical history yet</h3>
                      <p className="text-xs text-surface-400 mt-1.5 max-w-xs mx-auto">Your records will appear here after your first consultation.</p>
                      <button
                        onClick={() => setShowAddVisit(true)}
                        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md hover:bg-brand-700 transition-all"
                      >
                        <FiPlus className="w-3.5 h-3.5" /> Add Your First Visit
                      </button>
                    </div>
                  ) : (
                    visits.map((v, i) => (
                      <motion.div
                        key={v._id || i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="bg-white rounded-2xl border border-surface-200/50 overflow-hidden shadow-card hover:shadow-float transition-all duration-300"
                      >
                        <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-md">
                              <FiUser className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-surface-950">{v.doctorName || 'Self-Reported'}</p>
                              <p className="text-[10px] text-surface-400 font-medium mt-0.5 flex items-center gap-1.5">
                                <FiMapPin className="w-3 h-3 text-brand-500" /> {v.hospitalName || 'Patient Entry'}
                                {v.selfReported && (
                                  <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 text-[8px] font-bold uppercase">Self</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="px-3 py-1.5 rounded-lg bg-surface-50 border border-surface-100 text-[10px] font-semibold text-surface-400 flex items-center gap-1.5">
                             <FiCalendar className="w-3 h-3" />
                             {new Date(v.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>

                        <div className="p-5">
                          <h4 className="text-[10px] font-bold text-brand-600 uppercase tracking-wider mb-1.5">Diagnosis</h4>
                          <p className="text-base font-semibold text-surface-950 leading-snug">{v.diagnosis}</p>

                          {v.prescriptions?.length > 0 && (
                            <div className="mt-4">
                               <h4 className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mb-2">Prescriptions</h4>
                               <div className="flex flex-wrap gap-2.5">
                                  {v.prescriptions.map((p, j) => (
                                    <div key={j} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-brand-50 shadow-xs hover:border-brand-200 transition-all">
                                       <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                                       <div>
                                          <p className="text-xs font-semibold text-surface-950">{p.medicine}</p>
                                          <p className="text-[9px] text-surface-400 mt-0.5">{p.dosage} &middot; {p.frequency}{p.duration ? ` &middot; ${p.duration}` : ''}</p>
                                       </div>
                                    </div>
                                  ))}
                               </div>
                            </div>
                          )}

                          {v.notes && (
                            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                               <h4 className="text-[9px] font-bold text-surface-400 uppercase tracking-wider mb-1.5">Notes</h4>
                               <p className="text-xs text-surface-600 leading-relaxed">{v.notes}</p>
                            </div>
                          )}

                          {v.followUpDate && (
                            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 border border-teal-100 text-[10px] font-semibold text-teal-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                              Follow-up: {new Date(v.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   ADD VISIT MODAL — Manual + AI modes
   ══════════════════════════════════════════════ */
/* ══════════════════════════════════════════════
   WEIGHT TRACKER WIDGET
   ══════════════════════════════════════════════ */
const WeightTracker = ({ currentWeight, weightHistory = [], onWeightUpdated }) => {
  const [editing, setEditing] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const w = Number(newWeight);
    if (!w || w <= 0 || w > 500) return;
    setSaving(true);
    try {
      const res = await updateWeight({ weight: w });
      onWeightUpdated(res.data.currentWeight, res.data.weightHistory);
      setEditing(false);
      setNewWeight('');
    } catch (err) {
      console.error('Failed to update weight', err);
    }
    setSaving(false);
  };

  // Build chart data (last 10 entries)
  const chartData = (weightHistory || []).slice(-10);
  const weights = chartData.map(e => e.weight);
  const minW = weights.length ? Math.min(...weights) - 2 : 0;
  const maxW = weights.length ? Math.max(...weights) + 2 : 100;
  const range = maxW - minW || 1;

  // Build SVG path
  const chartWidth = 220;
  const chartHeight = 60;
  const points = chartData.map((e, i) => {
    const x = chartData.length > 1 ? (i / (chartData.length - 1)) * chartWidth : chartWidth / 2;
    const y = chartHeight - ((e.weight - minW) / range) * chartHeight;
    return { x, y };
  });
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = pathD + ` L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  // Weight change
  const lastTwo = weights.slice(-2);
  const change = lastTwo.length === 2 ? (lastTwo[1] - lastTwo[0]).toFixed(1) : null;

  return (
    <div className="bg-white rounded-2xl border border-surface-200/50 p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
            <FiTrendingUp className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xs font-bold text-surface-950 uppercase tracking-wider">Weight</h3>
        </div>
        <button
          onClick={() => { setEditing(!editing); setNewWeight(currentWeight || ''); }}
          className="text-[10px] font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          {editing ? 'Cancel' : 'Update'}
        </button>
      </div>

      {/* Current Weight Display */}
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-2xl font-bold text-surface-950">{currentWeight || '—'}</span>
        <span className="text-xs text-surface-400 font-medium">kg</span>
        {change !== null && (
          <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
            Number(change) > 0 ? 'bg-amber-50 text-amber-600' : Number(change) < 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-surface-50 text-surface-400'
          }`}>
            {Number(change) > 0 ? '+' : ''}{change} kg
          </span>
        )}
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            className="input flex-1 text-xs"
            placeholder="Enter weight in kg"
            value={newWeight}
            min="1"
            max="500"
            onChange={e => setNewWeight(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {saving ? <FiLoader className="w-3.5 h-3.5 animate-spin" /> : <FiCheck className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* Mini Chart */}
      {chartData.length >= 2 && (
        <div className="mt-2">
          <svg width={chartWidth} height={chartHeight} className="w-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#weightGrad)" />
            <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#8b5cf6" stroke="white" strokeWidth="1.5" />
            ))}
          </svg>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-surface-400">
              {new Date(chartData[0].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
            <span className="text-[9px] text-surface-400">
              {new Date(chartData[chartData.length - 1].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
      )}

      {chartData.length < 2 && (
        <p className="text-[10px] text-surface-400 mt-1">Update your weight regularly to see trends</p>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════
   ADD VISIT MODAL — Manual + AI modes
   ══════════════════════════════════════════════ */
const AddVisitModal = ({ onClose, onVisitAdded }) => {
  const [mode, setMode] = useState('manual'); // 'manual' | 'ai'
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiStatus, setAiStatus] = useState('');
  const [aiProgress, setAiProgress] = useState(0);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    doctorName: '',
    hospitalName: '',
    diagnosis: '',
    prescriptions: [{ medicine: '', dosage: '', frequency: '', duration: '' }],
    notes: '',
    followUpDate: '',
  });

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const updatePrescription = (index, key, value) => {
    setForm(prev => {
      const updated = [...prev.prescriptions];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, prescriptions: updated };
    });
  };

  const addPrescription = () => {
    setForm(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, { medicine: '', dosage: '', frequency: '', duration: '' }]
    }));
  };

  const removePrescription = (index) => {
    setForm(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.length > 1
        ? prev.prescriptions.filter((_, i) => i !== index)
        : prev.prescriptions
    }));
  };

  /* ─── AI Prescription Upload ─── */
  const handleAIUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Only PDF, JPG, and PNG files are supported.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be less than 10MB.');
      return;
    }

    setAiProcessing(true);
    setAiStatus('extracting');
    setError('');
    setAiProgress(10);

    try {
      const fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setAiProgress(30);

      // Step 1: Extract text
      let extractedText = '';
      try {
        const parseRes = await parseDocument({ fileData, fileType: file.type });
        extractedText = parseRes.data.text || '';
      } catch (err) {
        throw new Error('Text extraction failed. Try a clearer image.');
      }

      if (!extractedText || extractedText.trim().length < 10) {
        throw new Error('No readable text found. Try a clearer image or PDF.');
      }

      setAiProgress(60);
      setAiStatus('analyzing');

      // Step 2: Extract medical data
      let extracted;
      try {
        const extractRes = await extractMedicalData({ text: extractedText, fileType: file.type });
        extracted = extractRes.data.extracted;
      } catch (err) {
        throw new Error('AI analysis failed. Try a different document.');
      }

      setAiProgress(90);

      // Step 3: Auto-fill form
      if (extracted) {
        setForm(prev => ({
          ...prev,
          diagnosis: extracted.diagnosis || prev.diagnosis,
          doctorName: extracted.doctorName || prev.doctorName,
          hospitalName: extracted.hospitalName || prev.hospitalName,
          notes: extracted.notes || prev.notes,
          prescriptions: extracted.currentMedications?.length > 0
            ? extracted.currentMedications.map(m => ({
                medicine: m.name || '',
                dosage: m.dosage || '',
                frequency: m.frequency || '',
                duration: m.duration || ''
              }))
            : prev.prescriptions,
        }));
      }

      setAiProgress(100);
      setAiStatus('done');
    } catch (err) {
      setError(err.message || 'Failed to process document');
      setAiStatus('error');
      setAiProgress(0);
    }

    setAiProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ─── Save Visit ─── */
  const handleSave = async () => {
    if (!form.diagnosis.trim()) {
      setError('Diagnosis is required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        ...form,
        prescriptions: form.prescriptions.filter(p => p.medicine.trim()),
      };
      const res = await addSelfVisit(payload);
      onVisitAdded(res.data.visit || res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save visit');
    }
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-surface-200/50 shadow-elevated mb-6 overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center shadow-md">
            <FiPlus className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-surface-950">Add New Visit</h3>
            <p className="text-[10px] text-surface-400">Record a consultation or prescription</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-100 hover:bg-surface-200 flex items-center justify-center text-surface-400 hover:text-surface-600 transition-colors">
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="px-5 pt-4 flex gap-2">
        {[
          { id: 'manual', label: 'Manual Entry', icon: FiEdit3 },
          { id: 'ai', label: 'AI from Prescription', icon: FiZap },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === m.id
                ? 'bg-brand-50 text-brand-700 border border-brand-200'
                : 'bg-surface-50 text-surface-400 border border-surface-200 hover:text-surface-600'
            }`}
          >
            <m.icon className="w-3.5 h-3.5" /> {m.label}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-4">
        {/* AI Upload Area */}
        {mode === 'ai' && (
          <div className="mb-2">
            <div
              onClick={() => !aiProcessing && fileInputRef.current?.click()}
              className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                aiProcessing
                  ? 'border-surface-200 bg-surface-50/50 cursor-wait'
                  : 'border-surface-200 bg-surface-50/30 hover:border-brand-300 hover:bg-brand-50/20'
              }`}
            >
              <input ref={fileInputRef} type="file" className="hidden"
                accept=".pdf,image/jpeg,image/png,image/jpg" onChange={handleAIUpload} />

              {aiProcessing ? (
                <div className="flex flex-col items-center gap-3 py-6 px-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <FiCpu className="w-5 h-5 text-brand-600 animate-pulse" />
                  </div>
                  <p className="text-xs font-semibold text-surface-700">
                    {aiStatus === 'extracting' ? 'Extracting text...' : 'AI analyzing prescription...'}
                  </p>
                  <div className="w-full max-w-xs">
                    <div className="w-full h-1.5 bg-surface-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-brand-500 to-teal-500 rounded-full"
                        animate={{ width: `${aiProgress}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <p className="text-[10px] text-surface-400 mt-1 text-center">{aiProgress}%</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-6 px-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <FiUploadCloud className="w-5 h-5 text-brand-500" />
                  </div>
                  <p className="text-xs font-semibold text-surface-600">
                    Upload prescription image or PDF
                  </p>
                  <p className="text-[10px] text-surface-400">
                    AI will extract doctor details, diagnosis & medicines
                  </p>
                </div>
              )}
            </div>

            {aiStatus === 'done' && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200/50 text-xs font-medium text-emerald-700"
              >
                <FiCheck className="w-4 h-4" /> Data extracted. Review and edit below, then save.
              </motion.div>
            )}
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-surface-500 mb-1 block">Doctor Name</label>
            <input className="input" placeholder="Dr. Smith" value={form.doctorName}
              onChange={e => updateField('doctorName', e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-surface-500 mb-1 block">Hospital / Clinic</label>
            <input className="input" placeholder="City Hospital" value={form.hospitalName}
              onChange={e => updateField('hospitalName', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-surface-500 mb-1 block">Diagnosis / Reason *</label>
          <textarea className="input min-h-[60px] resize-none" placeholder="e.g., Seasonal flu with mild fever"
            value={form.diagnosis} onChange={e => updateField('diagnosis', e.target.value)} rows={2} />
        </div>

        {/* Prescriptions */}
        <div>
          <label className="text-[11px] font-semibold text-surface-500 mb-2 block">Prescriptions</label>
          <div className="space-y-2">
            {form.prescriptions.map((p, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input className="input flex-1" placeholder="Medicine" value={p.medicine}
                  onChange={e => updatePrescription(i, 'medicine', e.target.value)} />
                <input className="input w-20" placeholder="Dosage" value={p.dosage}
                  onChange={e => updatePrescription(i, 'dosage', e.target.value)} />
                <input className="input w-24 hidden sm:block" placeholder="Frequency" value={p.frequency}
                  onChange={e => updatePrescription(i, 'frequency', e.target.value)} />
                <input className="input w-20 hidden md:block" placeholder="Duration" value={p.duration}
                  onChange={e => updatePrescription(i, 'duration', e.target.value)} />
                {form.prescriptions.length > 1 && (
                  <button onClick={() => removePrescription(i)}
                    className="w-8 h-8 rounded-lg bg-danger-50 text-danger-400 hover:bg-danger-500 hover:text-white flex items-center justify-center flex-shrink-0 transition-colors">
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            <button onClick={addPrescription}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-surface-200 text-xs font-semibold text-surface-400 hover:border-brand-300 hover:text-brand-500 transition-all flex items-center justify-center gap-1.5">
              <FiPlus className="w-3 h-3" /> Add Medicine
            </button>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-surface-500 mb-1 block">Clinical Notes</label>
          <textarea className="input min-h-[48px] resize-none" placeholder="Any additional notes..."
            value={form.notes} onChange={e => updateField('notes', e.target.value)} rows={2} />
        </div>

        <div className="w-48">
          <label className="text-[11px] font-semibold text-surface-500 mb-1 block">Follow-up Date</label>
          <input type="date" className="input" value={form.followUpDate}
            onChange={e => updateField('followUpDate', e.target.value)} />
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-danger-50 border border-danger-200/50 text-xs font-medium text-danger-600"
          >
            <FiAlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-surface-500 hover:bg-surface-100 transition-colors">
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md hover:bg-brand-700 transition-all disabled:opacity-50"
          >
            {saving ? (
              <><FiLoader className="w-3.5 h-3.5 animate-spin" /> Saving...</>
            ) : (
              <><FiCheck className="w-3.5 h-3.5" /> Save Visit</>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientDashboard;
