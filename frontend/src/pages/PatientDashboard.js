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
  FiMail, FiFileText
} from 'react-icons/fi';

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
      profile.allergies.forEach(a => { doc.text(`• ${a.name} (${a.severity})`, 25, y); y+=7; }); y+=5;
    }
    if (profile.currentMedications?.length) {
      doc.setFontSize(13); doc.text('Current Medications:', 20, y); y+=8; doc.setFontSize(11);
      profile.currentMedications.forEach(m => { doc.text(`• ${m.name} ${m.dosage} - ${m.frequency}`, 25, y); y+=7; }); y+=5;
    }
    if (profile.chronicConditions?.length) {
      doc.setFontSize(13); doc.text('Chronic Conditions:', 20, y); y+=8; doc.setFontSize(11);
      profile.chronicConditions.forEach(c => { doc.text(`• ${c.name} (${c.status})`, 25, y); y+=7; });
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
    <div className="min-h-[calc(100vh-64px)] bg-surface-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-12">

        {/* ── Profile Header Card ──────────── */}
        <FadeIn>
          <div className="relative rounded-2xl overflow-hidden mb-8">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500" />
            <div className="absolute inset-0 opacity-[0.07]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px'}} />
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/[0.04] rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/[0.03] rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative px-6 sm:px-8 py-7">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                {/* Avatar */}
                <div className="w-[72px] h-[72px] rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-extrabold text-white">{profile.fullName?.charAt(0)}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">{profile.fullName}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-white/80">
                      <FiFileText className="w-3.5 h-3.5 text-white/50" />
                      <span className="font-mono font-semibold text-white/95">{profile.healthId}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-white/70">
                      <FiMail className="w-3.5 h-3.5 text-white/40" />
                      {profile.email}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-white/70">
                      <FiUser className="w-3.5 h-3.5 text-white/40" />
                      {profile.gender}, {age} yrs
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to="/patient/qr" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-brand-700 text-[13px] font-semibold shadow-lg shadow-brand-900/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                    <FiMaximize2 className="w-4 h-4" /> QR Code
                  </Link>
                  <button onClick={exportPDF} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[13px] font-semibold hover:bg-white/25 transition-all duration-200">
                    <FiDownload className="w-4 h-4" /> Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Tab Navigation ───────────────── */}
        <FadeIn>
          <div className="flex items-center gap-1 mb-6 border-b border-surface-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-[13px] font-semibold transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-brand-600'
                    : 'text-surface-400 hover:text-surface-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                    activeTab === tab.id ? 'bg-brand-100 text-brand-600' : 'bg-surface-100 text-surface-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* ── Tab Content ──────────────────── */}
        <AnimatePresence mode="wait">
          {/* ── Overview ───────────────── */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.2}}>
              {/* Stats Row */}
              <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: FiDroplet, label: 'Blood Group', value: profile.bloodGroup || '—', gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-50' },
                  { icon: FiAlertTriangle, label: 'Known Allergies', value: profile.allergies?.length || 0, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
                  { icon: FiHeart, label: 'Active Medications', value: profile.currentMedications?.length || 0, gradient: 'from-brand-500 to-indigo-500', bg: 'bg-brand-50' },
                  { icon: FiCalendar, label: 'Doctor Visits', value: visits.length, gradient: 'from-teal-500 to-emerald-500', bg: 'bg-teal-50' },
                ].map((stat, i) => (
                  <StaggerItem key={i}>
                    <div className="card p-5 group hover:shadow-float transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm`}>
                          <stat.icon className="w-[18px] h-[18px] text-white" />
                        </div>
                      </div>
                      <p className="text-3xl font-extrabold text-surface-900 tracking-tight">{stat.value}</p>
                      <p className="text-[12px] text-surface-400 font-medium mt-0.5">{stat.label}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <div className="grid lg:grid-cols-5 gap-6">
                {/* ── Left Column (3/5) ────── */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Allergies */}
                  {profile.allergies?.length > 0 && (
                    <FadeInUp delay={0.05}>
                      <div className="card overflow-hidden border-danger-200/40">
                        <div className="px-5 py-3.5 bg-danger-50/50 border-b border-danger-100 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-danger-500 flex items-center justify-center">
                            <FiAlertTriangle className="w-3.5 h-3.5 text-white" />
                          </div>
                          <h3 className="text-[13px] font-bold text-danger-700 uppercase tracking-wide">Drug Allergies</h3>
                        </div>
                        <div className="p-3 space-y-2">
                          {profile.allergies.map((a, i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-danger-50/70 border border-danger-200/40">
                              <FiShield className="w-4 h-4 text-danger-400 flex-shrink-0" />
                              <span className="text-[13px] font-bold text-danger-700 uppercase tracking-wider flex-1">
                                {a.name}
                              </span>
                              <span className={`badge ${a.severity === 'life-threatening' || a.severity === 'severe' ? 'badge-danger' : 'badge-warning'}`}>
                                {a.severity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FadeInUp>
                  )}

                  {/* Medications */}
                  {profile.currentMedications?.length > 0 && (
                    <FadeInUp delay={0.1}>
                      <div className="card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-surface-200/60 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center">
                            <FiHeart className="w-3.5 h-3.5 text-brand-600" />
                          </div>
                          <h3 className="text-[13px] font-bold text-surface-800">Current Medications</h3>
                        </div>
                        <div className="divide-y divide-surface-100">
                          {profile.currentMedications.map((m, i) => (
                            <div key={i} className="px-5 py-3.5 flex items-center justify-between group hover:bg-surface-50/50 transition-colors">
                              <div>
                                <p className="text-sm font-semibold text-surface-900">{m.name}</p>
                                <p className="text-[12px] text-surface-400 mt-0.5">{m.frequency}</p>
                              </div>
                              <span className="px-3 py-1 rounded-lg bg-brand-50 text-brand-700 text-[12px] font-bold">{m.dosage}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FadeInUp>
                  )}

                  {/* Chronic Conditions */}
                  {profile.chronicConditions?.length > 0 && (
                    <FadeInUp delay={0.15}>
                      <div className="card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-surface-200/60 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                            <FiActivity className="w-3.5 h-3.5 text-amber-600" />
                          </div>
                          <h3 className="text-[13px] font-bold text-surface-800">Chronic Conditions</h3>
                        </div>
                        <div className="divide-y divide-surface-100">
                          {profile.chronicConditions.map((c, i) => (
                            <div key={i} className="px-5 py-3.5 flex items-center justify-between hover:bg-surface-50/50 transition-colors">
                              <span className="text-sm font-medium text-surface-800">{c.name}</span>
                              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                c.status === 'controlled'
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                                  : 'bg-danger-50 text-danger-600 border border-danger-200/60'
                              }`}>{c.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FadeInUp>
                  )}
                </div>

                {/* ── Right Column (2/5) ───── */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Quick Actions */}
                  <FadeInUp delay={0.05}>
                    <div className="card p-2">
                      <p className="px-3 pt-3 pb-2 text-[11px] font-bold text-surface-400 uppercase tracking-widest">Quick Actions</p>
                      {[
                        { to: '/patient/medical-profile', icon: FiEdit3, label: 'Edit Medical Profile', sub: 'Update your health details', color: 'from-brand-500 to-indigo-500' },
                        { to: '/patient/predictions', icon: FiCpu, label: 'AI Health Insights', sub: 'View risk predictions', color: 'from-amber-500 to-orange-500' },
                        { to: '/patient/qr', icon: FiMaximize2, label: 'My QR Code', sub: 'Download or print', color: 'from-teal-500 to-emerald-500' },
                      ].map((action, i) => (
                        <Link key={i} to={action.to} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface-50 transition-all duration-200 group">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                            <action.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-surface-900">{action.label}</p>
                            <p className="text-[11px] text-surface-400">{action.sub}</p>
                          </div>
                          <FiChevronRight className="w-4 h-4 text-surface-300 group-hover:text-surface-500 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </FadeInUp>

                  {/* Emergency Contacts */}
                  {profile.emergencyContacts?.length > 0 && (
                    <FadeInUp delay={0.1}>
                      <div className="card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-surface-200/60 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
                            <FiPhone className="w-3.5 h-3.5 text-rose-500" />
                          </div>
                          <h3 className="text-[13px] font-bold text-surface-800">Emergency Contacts</h3>
                        </div>
                        <div className="divide-y divide-surface-100">
                          {profile.emergencyContacts.map((ec, i) => (
                            <div key={i} className="px-5 py-3.5">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-surface-800">{ec.name}</p>
                                <span className="text-[11px] text-surface-400 bg-surface-50 px-2 py-0.5 rounded-md">{ec.relationship}</span>
                              </div>
                              <p className="text-xs text-brand-600 font-medium flex items-center gap-1 mt-1"><FiPhone className="w-3 h-3" />{ec.phone}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FadeInUp>
                  )}

                  {/* AI Preview */}
                  {profile.aiPredictions?.riskScores?.length > 0 && (
                    <FadeInUp delay={0.15}>
                      <Link to="/patient/predictions" className="block group">
                        <div className="rounded-2xl bg-gradient-to-br from-surface-900 to-surface-800 p-5 shadow-card hover:shadow-float transition-all duration-300 hover:-translate-y-0.5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                <FiCpu className="w-3.5 h-3.5 text-amber-400" />
                              </div>
                              <h3 className="text-[13px] font-bold text-white">AI Risk Summary</h3>
                            </div>
                            <FiChevronRight className="w-4 h-4 text-surface-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                          </div>
                          {profile.aiPredictions.riskScores.slice(0, 3).map((r, i) => (
                            <div key={i} className="mb-3 last:mb-0">
                              <div className="flex justify-between text-[12px] mb-1.5">
                                <span className="font-medium text-surface-300">{r.condition}</span>
                                <span className={`font-extrabold ${r.percentage >= 60 ? 'text-rose-400' : r.percentage >= 35 ? 'text-amber-400' : 'text-teal-400'}`}>
                                  {r.percentage}%
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full rounded-full ${
                                    r.percentage >= 60 ? 'bg-gradient-to-r from-rose-500 to-rose-400' :
                                    r.percentage >= 35 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                                    'bg-gradient-to-r from-teal-500 to-teal-400'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${r.percentage}%` }}
                                  transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                                />
                              </div>
                            </div>
                          ))}
                          <p className="text-[11px] text-brand-400 font-semibold mt-4 group-hover:text-brand-300 transition-colors">
                            View full analysis &rarr;
                          </p>
                        </div>
                      </Link>
                    </FadeInUp>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Visits ─────────────────── */}
          {activeTab === 'visits' && (
            <motion.div key="visits" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.2}}>
              {visits.length === 0 ? (
                <EmptyState icon={FiCalendar} title="No visits recorded" description="Your doctor visits will appear here after your first consultation." />
              ) : (
                <div className="space-y-3">
                  {visits.map((v, i) => (
                    <FadeInUp key={i} delay={i * 0.04}>
                      <div className="card p-5 hover:shadow-float transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center shadow-sm">
                              <FiUser className="w-[18px] h-[18px] text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-surface-900">{v.doctorName}</p>
                              <p className="text-[12px] text-surface-400 flex items-center gap-1"><FiMapPin className="w-3 h-3" />{v.hospitalName}</p>
                            </div>
                          </div>
                          <span className="text-[12px] text-surface-400 flex items-center gap-1.5 bg-surface-50 px-2.5 py-1 rounded-lg">
                            <FiClock className="w-3 h-3" />
                            {new Date(v.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        <div className="pl-[52px]">
                          <p className="text-sm text-surface-800"><span className="font-semibold text-surface-900">Diagnosis:</span> {v.diagnosis}</p>
                          {v.prescriptions?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                              {v.prescriptions.map((p, j) => (
                                <span key={j} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 border border-brand-100 text-[11px] text-brand-700 font-medium">
                                  <span className="font-bold">{p.medicine}</span> {p.dosage} &middot; {p.frequency}
                                </span>
                              ))}
                            </div>
                          )}
                          {v.notes && <p className="text-[12px] text-surface-500 mt-2 leading-relaxed">{v.notes}</p>}
                          {v.followUpDate && (
                            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-100 text-[11px] font-semibold text-teal-700">
                              <FiCalendar className="w-3 h-3" />
                              Follow-up: {new Date(v.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          )}
                        </div>
                      </div>
                    </FadeInUp>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Access Logs ────────────── */}
          {activeTab === 'access' && (
            <motion.div key="access" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.2}}>
              {logs.length === 0 ? (
                <EmptyState icon={FiEye} title="No access records" description="You'll see who accessed your profile and when." />
              ) : (
                <div className="card overflow-hidden">
                  <div className="px-6 py-4 border-b border-surface-200/60">
                    <h3 className="text-sm font-bold text-surface-900">Profile Access History</h3>
                    <p className="text-[12px] text-surface-400 mt-0.5">Every time a doctor views your records, it's logged here</p>
                  </div>
                  <div className="divide-y divide-surface-100">
                    {logs.map((log, i) => (
                      <motion.div key={i}
                        initial={{opacity:0}} animate={{opacity:1}} transition={{delay: i * 0.04}}
                        className="px-6 py-4 flex items-center gap-4 hover:bg-surface-50/50 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          log.accessType === 'emergency'
                            ? 'bg-gradient-to-br from-danger-500 to-rose-500 shadow-sm'
                            : 'bg-surface-100'
                        }`}>
                          {log.accessType === 'emergency'
                            ? <FiAlertTriangle className="w-[18px] h-[18px] text-white" />
                            : <FiEye className="w-[18px] h-[18px] text-surface-400" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-surface-900">{log.doctorName}</p>
                          <p className="text-[12px] text-surface-400">{log.hospitalName}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                            log.accessType === 'emergency'
                              ? 'bg-danger-50 text-danger-600 border border-danger-200/60'
                              : 'bg-brand-50 text-brand-600 border border-brand-100'
                          }`}>{log.accessType}</span>
                          <p className="text-[11px] text-surface-400 mt-1.5">{new Date(log.timestamp).toLocaleString('en-IN', {
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
