import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPatientProfile, getAccessLogs, getVisits } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem } from '../components/ui/Motion';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { jsPDF } from 'jspdf';
import {
  FiEdit3, FiDownload, FiActivity, FiEye, FiCalendar,
  FiMaximize2, FiCpu, FiAlertTriangle, FiHeart, FiShield,
  FiClock, FiMapPin, FiPhone, FiDroplet, FiUser, FiChevronRight,
  FiMail, FiFileText, FiTrendingUp, FiStar, FiCheck,
  FiArrowUpRight, FiPlusCircle
} from 'react-icons/fi';

/* ─── Animated Counter ──────────────────── */
const AnimCount = ({ value }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = typeof value === 'number' ? value : 0;
    if (end === 0) { setCount(0); return; }
    const dur = 800;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      setCount(Math.round(start + (end - start) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{count}</>;
};

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [visits, setVisits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, v, l] = await Promise.all([getPatientProfile(), getVisits(), getAccessLogs()]);
        setProfile(p.data);
        setVisits(v.data);
        setLogs(l.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('MedVault Medical Report', 20, 25);
    doc.setFontSize(11);
    let y = 40;
    doc.text(`Name: ${profile.fullName}`, 20, y); y+=8;
    doc.text(`Health ID: ${profile.healthId}`, 20, y); y+=8;
    doc.text(`Blood Group: ${profile.bloodGroup || 'N/A'}`, 20, y); y+=8;
    doc.text(`Gender: ${profile.gender} | DOB: ${new Date(profile.dateOfBirth).toLocaleDateString()}`, 20, y); y+=12;
    if (profile.allergies?.length) {
      doc.setFontSize(13); doc.text('Drug Allergies:', 20, y); y+=8; doc.setFontSize(11);
      profile.allergies.forEach(a => { doc.text(`- ${a.name} (${a.severity})`, 25, y); y+=7; }); y+=5;
    }
    if (profile.currentMedications?.length) {
      doc.setFontSize(13); doc.text('Current Medications:', 20, y); y+=8; doc.setFontSize(11);
      profile.currentMedications.forEach(m => { doc.text(`- ${m.name} ${m.dosage} - ${m.frequency}`, 25, y); y+=7; }); y+=5;
    }
    if (profile.chronicConditions?.length) {
      doc.setFontSize(13); doc.text('Chronic Conditions:', 20, y); y+=8; doc.setFontSize(11);
      profile.chronicConditions.forEach(c => { doc.text(`- ${c.name} (${c.status})`, 25, y); y+=7; });
    }
    doc.save(`MedVault_${profile.healthId}.pdf`);
  };

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8"><DashboardSkeleton /></div>;
  if (!profile) return <div className="max-w-6xl mx-auto px-4 py-16 text-center text-surface-500">Failed to load profile</div>;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiActivity },
    { id: 'visits', label: 'Visits', icon: FiCalendar, count: visits.length },
    { id: 'access', label: 'Access Log', icon: FiEye, count: logs.length },
  ];

  const age = Math.floor((Date.now() - new Date(profile.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-16">

        {/* ══ Profile Header ═══════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden mb-8"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-teal-700" />
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 right-0 w-80 h-80 bg-white/[0.06] rounded-full -translate-y-1/2 translate-x-1/4 blur-xl"
          />
          <motion.div
            animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 left-0 w-56 h-56 bg-teal-400/[0.06] rounded-full translate-y-1/2 -translate-x-1/4 blur-xl"
          />

          <div className="relative px-7 sm:px-9 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-[76px] h-[76px] rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/25 flex items-center justify-center flex-shrink-0 shadow-xl"
              >
                <span className="text-3xl font-black text-white">{profile.fullName?.charAt(0)}</span>
              </motion.div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <motion.h1
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-2xl sm:text-3xl font-black text-white tracking-tight"
                >
                  {profile.fullName}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2.5"
                >
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-white/90">
                    <FiFileText className="w-3.5 h-3.5 text-white/50" />
                    <span className="font-mono font-bold tracking-wide">{profile.healthId}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-white/60">
                    <FiMail className="w-3.5 h-3.5 text-white/35" />
                    {profile.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-white/60">
                    <FiUser className="w-3.5 h-3.5 text-white/35" />
                    {profile.gender}, {age} yrs
                  </span>
                  {profile.bloodGroup && (
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-white/60">
                      <FiDroplet className="w-3.5 h-3.5 text-white/35" />
                      {profile.bloodGroup}
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2.5 flex-shrink-0"
              >
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/patient/qr" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-brand-700 text-[13px] font-bold shadow-xl shadow-brand-900/15 hover:shadow-2xl transition-all duration-300">
                    <FiMaximize2 className="w-4 h-4" /> QR Code
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportPDF}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 text-white text-[13px] font-bold hover:bg-white/[0.2] transition-all duration-300"
                >
                  <FiDownload className="w-4 h-4" /> Export PDF
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ══ Tab Navigation ═══════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-1 p-1.5 rounded-2xl bg-surface-100/80 border border-surface-200/60 w-fit mb-8"
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 ${
                activeTab === tab.id ? 'text-surface-900' : 'text-surface-400 hover:text-surface-600'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="dashTab"
                  className="absolute inset-0 bg-white rounded-xl shadow-soft border border-surface-200/40"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <tab.icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
              {tab.count > 0 && (
                <span className={`relative z-10 min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                  activeTab === tab.id ? 'bg-brand-100 text-brand-600' : 'bg-surface-200/80 text-surface-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* ══ Tab Content ══════════════════════ */}
        <AnimatePresence mode="wait">

          {/* ════ OVERVIEW ═════════════════════ */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Stats Grid */}
              <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: FiDroplet, label: 'Blood Group', value: profile.bloodGroup || '—', gradient: 'from-rose-500 to-pink-600', isText: true },
                  { icon: FiAlertTriangle, label: 'Known Allergies', value: profile.allergies?.length || 0, gradient: 'from-amber-500 to-orange-600' },
                  { icon: FiHeart, label: 'Active Meds', value: profile.currentMedications?.length || 0, gradient: 'from-brand-500 to-indigo-600' },
                  { icon: FiCalendar, label: 'Doctor Visits', value: visits.length, gradient: 'from-teal-500 to-emerald-600' },
                ].map((stat, i) => (
                  <StaggerItem key={i}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="group relative rounded-2xl bg-white/70 backdrop-blur-sm border border-surface-200/40 p-5 overflow-hidden hover:shadow-float hover:bg-white/90 transition-all duration-300"
                    >
                      {/* Corner glow on hover */}
                      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-[0.08] blur-2xl transition-opacity duration-500`} />

                      <div className={`relative z-10 w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="relative z-10 text-3xl font-black text-surface-900 tracking-tight">
                        {stat.isText ? stat.value : <AnimCount value={stat.value} />}
                      </p>
                      <p className="relative z-10 text-[12px] text-surface-400 font-medium mt-1">{stat.label}</p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <div className="grid lg:grid-cols-5 gap-6">
                {/* ── Left Column (3/5) ────── */}
                <div className="lg:col-span-3 space-y-5">
                  {/* Allergies */}
                  {profile.allergies?.length > 0 && (
                    <FadeInUp delay={0.05}>
                      <div className="rounded-2xl bg-white border border-red-200/40 overflow-hidden shadow-sm">
                        <div className="px-5 py-4 bg-gradient-to-r from-red-50 to-rose-50/50 border-b border-red-100/60 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md shadow-red-200/50">
                            <FiAlertTriangle className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-red-800">Drug Allergies</h3>
                            <p className="text-[11px] text-red-500/70">Critical alerts for healthcare providers</p>
                          </div>
                        </div>
                        <div className="p-3 space-y-2">
                          {profile.allergies.map((a, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + i * 0.08 }}
                              className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-red-50/80 border border-red-200/40 hover:bg-red-50 transition-colors"
                            >
                              <FiShield className="w-4 h-4 text-red-400 flex-shrink-0" />
                              <span className="text-[13px] font-bold text-red-800 uppercase tracking-wider flex-1">
                                {a.name}
                              </span>
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                                a.severity === 'life-threatening' || a.severity === 'severe'
                                  ? 'bg-red-100 text-red-600 border border-red-200/60'
                                  : 'bg-amber-100 text-amber-600 border border-amber-200/60'
                              }`}>{a.severity}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </FadeInUp>
                  )}

                  {/* Medications */}
                  {profile.currentMedications?.length > 0 && (
                    <FadeInUp delay={0.1}>
                      <div className="rounded-2xl bg-white border border-surface-200/60 overflow-hidden shadow-sm hover:shadow-card transition-shadow duration-300">
                        <div className="px-5 py-4 border-b border-surface-100 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-md">
                            <FiHeart className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-surface-900">Current Medications</h3>
                            <p className="text-[11px] text-surface-400">Active prescriptions</p>
                          </div>
                        </div>
                        <div className="divide-y divide-surface-100">
                          {profile.currentMedications.map((m, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.15 + i * 0.06 }}
                              whileHover={{ x: 4 }}
                              className="px-5 py-4 flex items-center justify-between group hover:bg-surface-50/50 transition-all duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-brand-400" />
                                <div>
                                  <p className="text-sm font-bold text-surface-900">{m.name}</p>
                                  <p className="text-[12px] text-surface-400 mt-0.5">{m.frequency}</p>
                                </div>
                              </div>
                              <span className="px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-100/60 text-brand-700 text-[12px] font-bold">{m.dosage}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </FadeInUp>
                  )}

                  {/* Chronic Conditions */}
                  {profile.chronicConditions?.length > 0 && (
                    <FadeInUp delay={0.15}>
                      <div className="rounded-2xl bg-white border border-surface-200/60 overflow-hidden shadow-sm hover:shadow-card transition-shadow duration-300">
                        <div className="px-5 py-4 border-b border-surface-100 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                            <FiActivity className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-surface-900">Chronic Conditions</h3>
                            <p className="text-[11px] text-surface-400">Ongoing health conditions</p>
                          </div>
                        </div>
                        <div className="divide-y divide-surface-100">
                          {profile.chronicConditions.map((c, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 + i * 0.06 }}
                              whileHover={{ x: 4 }}
                              className="px-5 py-4 flex items-center justify-between hover:bg-surface-50/50 transition-all duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${c.status === 'controlled' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                <span className="text-sm font-semibold text-surface-800">{c.name}</span>
                              </div>
                              <span className={`px-3 py-1.5 rounded-xl text-[11px] font-bold ${
                                c.status === 'controlled'
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                                  : 'bg-red-50 text-red-600 border border-red-200/60'
                              }`}>
                                <FiCheck className="w-3 h-3 inline mr-1" />
                                {c.status}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </FadeInUp>
                  )}
                </div>

                {/* ── Right Column (2/5) ───── */}
                <div className="lg:col-span-2 space-y-5">
                  {/* Quick Actions */}
                  <FadeInUp delay={0.05}>
                    <div className="rounded-2xl bg-white border border-surface-200/60 p-2 shadow-sm">
                      <p className="px-3 pt-3 pb-2 text-[11px] font-extrabold text-surface-400 uppercase tracking-[0.15em]">Quick Actions</p>
                      {[
                        { to: '/patient/medical-profile', icon: FiEdit3, label: 'Edit Medical Profile', sub: 'Update your health details', color: 'from-brand-500 to-indigo-600' },
                        { to: '/patient/predictions', icon: FiCpu, label: 'AI Health Insights', sub: 'View risk predictions', color: 'from-amber-500 to-orange-600' },
                        { to: '/patient/qr', icon: FiMaximize2, label: 'My QR Code', sub: 'Download or print', color: 'from-teal-500 to-emerald-600' },
                      ].map((action, i) => (
                        <motion.div key={i} whileHover={{ x: 4 }}>
                          <Link to={action.to} className="flex items-center gap-3.5 px-3 py-3.5 rounded-xl hover:bg-surface-50 transition-all duration-200 group">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md flex-shrink-0 group-hover:shadow-lg transition-shadow`}>
                              <action.icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-bold text-surface-900">{action.label}</p>
                              <p className="text-[11px] text-surface-400">{action.sub}</p>
                            </div>
                            <FiChevronRight className="w-4 h-4 text-surface-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </FadeInUp>

                  {/* Emergency Contacts */}
                  {profile.emergencyContacts?.length > 0 && (
                    <FadeInUp delay={0.1}>
                      <div className="rounded-2xl bg-white border border-surface-200/60 overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-surface-100 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md">
                            <FiPhone className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-surface-900">Emergency Contacts</h3>
                            <p className="text-[11px] text-surface-400">For urgent situations</p>
                          </div>
                        </div>
                        <div className="divide-y divide-surface-100">
                          {profile.emergencyContacts.map((ec, i) => (
                            <div key={i} className="px-5 py-4">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-bold text-surface-800">{ec.name}</p>
                                <span className="text-[11px] text-surface-400 bg-surface-50 px-2.5 py-1 rounded-lg font-medium">{ec.relationship}</span>
                              </div>
                              <p className="text-xs text-brand-600 font-semibold flex items-center gap-1.5 mt-1">
                                <FiPhone className="w-3 h-3" />{ec.phone}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FadeInUp>
                  )}

                  {/* AI Preview Card */}
                  {profile.aiPredictions?.riskScores?.length > 0 && (
                    <FadeInUp delay={0.15}>
                      <Link to="/patient/predictions" className="block group">
                        <motion.div
                          whileHover={{ y: -4, scale: 1.01 }}
                          className="relative rounded-2xl bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 p-6 shadow-xl overflow-hidden transition-shadow duration-300 hover:shadow-2xl"
                        >
                          {/* Background effects */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-500/10 rounded-full blur-xl" />

                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-5">
                              <div className="flex items-center gap-2.5">
                                <motion.div
                                  animate={{ rotate: [0, 5, -5, 0] }}
                                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20"
                                >
                                  <FiCpu className="w-4 h-4 text-white" />
                                </motion.div>
                                <h3 className="text-sm font-extrabold text-white">AI Risk Summary</h3>
                              </div>
                              <FiArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </div>

                            {profile.aiPredictions.riskScores.slice(0, 3).map((r, i) => (
                              <div key={i} className="mb-3.5 last:mb-0">
                                <div className="flex justify-between text-[12px] mb-2">
                                  <span className="font-medium text-white/50">{r.condition}</span>
                                  <span className={`font-extrabold ${r.percentage >= 60 ? 'text-rose-400' : r.percentage >= 35 ? 'text-amber-400' : 'text-teal-400'}`}>
                                    {r.percentage}%
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                  <motion.div
                                    className={`h-full rounded-full ${
                                      r.percentage >= 60 ? 'bg-gradient-to-r from-rose-500 to-rose-400' :
                                      r.percentage >= 35 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                                      'bg-gradient-to-r from-teal-500 to-teal-400'
                                    }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${r.percentage}%` }}
                                    transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                                  />
                                </div>
                              </div>
                            ))}

                            <p className="text-[11px] text-brand-400 font-bold mt-5 group-hover:text-brand-300 transition-colors flex items-center gap-1">
                              View full analysis <FiChevronRight className="w-3 h-3" />
                            </p>
                          </div>
                        </motion.div>
                      </Link>
                    </FadeInUp>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ════ VISITS ═══════════════════════ */}
          {activeTab === 'visits' && (
            <motion.div
              key="visits"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {visits.length === 0 ? (
                <EmptyState icon={FiCalendar} title="No visits recorded" description="Your doctor visits will appear here after your first consultation." />
              ) : (
                <div className="space-y-4">
                  {visits.map((v, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -2 }}
                      className="rounded-2xl bg-white border border-surface-200/60 p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-200/40">
                            <FiUser className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-base font-bold text-surface-900">{v.doctorName}</p>
                            <p className="text-[12px] text-surface-400 flex items-center gap-1.5 mt-0.5">
                              <FiMapPin className="w-3 h-3" />{v.hospitalName}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-[12px] text-surface-400 bg-surface-50 px-3 py-1.5 rounded-xl border border-surface-200/60 font-medium">
                          <FiClock className="w-3 h-3" />
                          {new Date(v.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="pl-16">
                        <p className="text-sm text-surface-800">
                          <span className="font-bold text-surface-900">Diagnosis:</span> {v.diagnosis}
                        </p>

                        {v.prescriptions?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {v.prescriptions.map((p, j) => (
                              <span key={j} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-100/60 text-[11px] text-brand-700 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                                <span className="font-bold">{p.medicine}</span> {p.dosage} &middot; {p.frequency}
                              </span>
                            ))}
                          </div>
                        )}

                        {v.notes && <p className="text-[12px] text-surface-500 mt-3 leading-relaxed bg-surface-50 p-3 rounded-xl">{v.notes}</p>}

                        {v.followUpDate && (
                          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200/60 text-[11px] font-bold text-teal-700">
                            <FiCalendar className="w-3 h-3" />
                            Follow-up: {new Date(v.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ════ ACCESS LOGS ══════════════════ */}
          {activeTab === 'access' && (
            <motion.div
              key="access"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {logs.length === 0 ? (
                <EmptyState icon={FiEye} title="No access records" description="You'll see who accessed your profile and when." />
              ) : (
                <div className="rounded-2xl bg-white border border-surface-200/60 overflow-hidden shadow-sm">
                  <div className="px-6 py-5 border-b border-surface-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                      <FiEye className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-surface-900">Profile Access History</h3>
                      <p className="text-[11px] text-surface-400">Every doctor access is logged and auditable</p>
                    </div>
                  </div>
                  <div className="divide-y divide-surface-100">
                    {logs.map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ x: 4, backgroundColor: 'rgba(0,0,0,0.01)' }}
                        className="px-6 py-4.5 flex items-center gap-4 transition-all duration-200"
                      >
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                          log.accessType === 'emergency'
                            ? 'bg-gradient-to-br from-red-500 to-rose-600'
                            : 'bg-surface-100'
                        }`}>
                          {log.accessType === 'emergency'
                            ? <FiAlertTriangle className="w-5 h-5 text-white" />
                            : <FiEye className="w-5 h-5 text-surface-400" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-surface-900">{log.doctorName}</p>
                          <p className="text-[12px] text-surface-400 flex items-center gap-1.5 mt-0.5">
                            <FiMapPin className="w-3 h-3" />{log.hospitalName}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`px-3 py-1.5 rounded-xl text-[11px] font-bold ${
                            log.accessType === 'emergency'
                              ? 'bg-red-50 text-red-600 border border-red-200/60'
                              : 'bg-brand-50 text-brand-600 border border-brand-100'
                          }`}>{log.accessType}</span>
                          <p className="text-[11px] text-surface-400 mt-2 font-medium">{new Date(log.timestamp).toLocaleString('en-IN', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PatientDashboard;
