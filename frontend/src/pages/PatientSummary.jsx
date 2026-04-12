import { useState } from 'react';
import { addVisit } from '../services/api';
import { motion } from 'framer-motion';
import { FadeInUp } from '../components/ui/Motion';
import {
  FiArrowLeft, FiAlertTriangle, FiShield, FiHeart, FiPhone,
  FiPlus, FiCheck, FiX, FiUser, FiActivity,
  FiDroplet, FiCalendar
} from 'react-icons/fi';

const SectionCard = ({ title, icon: Icon, iconColor = 'text-brand-600', iconBg = 'bg-brand-50', borderColor = '', delay = 0, children }) => (
  <FadeInUp delay={delay}>
    <div className={`glass-panel rounded-[28px] shadow-premium overflow-hidden group hover:shadow-elevated transition-all duration-500 ${borderColor}`}>
      <div className="px-6 py-5 border-b border-surface-100/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-500 shadow-sm`}>
            <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
          </div>
          <h3 className="text-xs font-bold text-surface-950 tracking-widest uppercase">{title}</h3>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-surface-200 group-hover:bg-brand-400 transition-colors" />
      </div>
      {children}
    </div>
  </FadeInUp>
);

const PatientSummary = ({ patient, healthId, onBack }) => {
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [visitForm, setVisitForm] = useState({
    diagnosis: '',
    prescriptions: [{ medicine: '', dosage: '', frequency: '', duration: '' }],
    notes: '',
    followUpDate: '',
  });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const isEmergency = patient._accessType === 'emergency';

  const updatePrescription = (index, field, value) => {
    const updated = [...visitForm.prescriptions];
    updated[index] = { ...updated[index], [field]: value };
    setVisitForm({ ...visitForm, prescriptions: updated });
  };

  const handleSubmitVisit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addVisit({
        patientHealthId: healthId,
        ...visitForm,
        prescriptions: visitForm.prescriptions.filter(p => p.medicine),
      });
      setSuccess('Visit recorded successfully! Patient can now see this in their dashboard.');
      setShowAddVisit(false);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-10 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ x: -2 }}
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-surface-200 text-sm font-bold text-surface-600 shadow-sm hover:shadow-md transition-all"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to Lookup
          </motion.button>
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Signed in as Provider</span>
          </div>
        </div>

        {/* ─── Patient Header Card ─── */}
        <FadeInUp>
          <div className="relative rounded-[32px] overflow-hidden mb-10 shadow-elevated group">
            <div className="absolute inset-0 bg-surface-950" />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.45, 0.3], rotate: [0, 5, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-20 -right-20 w-80 h-80 bg-brand-500/40 rounded-full blur-[80px]"
            />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2], x: [0, -30, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-500/30 rounded-full blur-[60px]"
            />

            <div className="relative p-8 backdrop-blur-3xl border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, rotate: -12 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.6, type: 'spring' }}
                  className="relative flex-shrink-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-teal-400 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-bold text-white shadow-2xl ring-4 ring-white/5">
                    {patient.fullName?.charAt(0)}
                  </div>
                </motion.div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{patient.fullName}</h1>
                    {isEmergency && (
                      <span className="px-3 py-1 rounded-lg bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest animate-pulse shadow-lg shadow-red-500/30">Emergency Access</span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {!isEmergency && (
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-mono font-bold text-white/90 border border-white/10 shadow-inner-soft">
                        <FiShield className="w-3.5 h-3.5 text-brand-300" /> {patient.healthId}
                      </span>
                    )}
                    {patient.bloodGroup && (
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-500/20 backdrop-blur-md text-xs font-bold text-red-100 border border-red-400/20">
                        <FiDroplet className="w-3.5 h-3.5 text-red-400" /> {patient.bloodGroup}
                      </span>
                    )}
                    {patient.gender && (
                      <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-white/5 text-xs font-bold text-white/70 border border-white/10">
                        {patient.gender}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!isEmergency && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-8 border-t border-white/10">
                  {[
                    { label: 'Allergies', count: patient.allergies?.length || 0, icon: FiAlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
                    { label: 'Medications', count: patient.currentMedications?.length || 0, icon: FiHeart, color: 'text-brand-400', bg: 'bg-brand-500/10' },
                    { label: 'Conditions', count: patient.chronicConditions?.length || 0, icon: FiActivity, color: 'text-teal-400', bg: 'bg-teal-500/10' },
                    { label: 'Total Visits', count: patient.visits?.length || 0, icon: FiCalendar, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                  ].map((stat, i) => (
                    <motion.div 
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-white leading-none">{stat.count}</p>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">{stat.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </FadeInUp>

        {success && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
            className="mb-8 p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-sm font-bold text-emerald-800 flex items-center gap-3 shadow-lg shadow-emerald-200/20">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <FiCheck className="w-4 h-4" />
            </div>
            {success}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Allergies */}
            {patient.allergies?.length > 0 && (
              <SectionCard title="Drug Allergies" icon={FiAlertTriangle} iconColor="text-red-600" iconBg="bg-red-50" borderColor="border-red-200/50">
                <div className="p-4 space-y-3">
                  {patient.allergies.map((a, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-red-50/50 border border-red-100 hover:bg-red-100/50 transition-all duration-300"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                      <span className="text-sm font-bold text-red-900 uppercase tracking-wide flex-1">{a.name}</span>
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${
                        a.severity === 'life-threatening' || a.severity === 'severe' 
                          ? 'bg-red-600 text-white shadow-lg shadow-red-200' 
                          : 'bg-orange-100 text-orange-700 border border-orange-200'
                      }`}>
                        {a.severity}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Current Medications */}
            {patient.currentMedications?.length > 0 && (
              <SectionCard title="Active Medications" icon={FiHeart} delay={0.1}>
                <div className="divide-y divide-surface-100/50">
                  {patient.currentMedications.map((m, i) => (
                    <motion.div key={i} whileHover={{ x: 6 }} className="px-6 py-5 flex items-center justify-between group hover:bg-brand-50/30 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-surface-100 flex items-center justify-center text-brand-600 font-bold text-xs group-hover:bg-brand-100 transition-all">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-base font-bold text-surface-950">{m.name}</p>
                          <p className="text-xs font-semibold text-surface-400 mt-0.5 tracking-tight">{m.frequency}</p>
                        </div>
                      </div>
                      <span className="px-4 py-2 rounded-2xl bg-white border border-brand-100 text-brand-700 text-xs font-bold shadow-sm group-hover:border-brand-500 transition-all">
                        {m.dosage}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </SectionCard>
            )}

            {!isEmergency && (
              <>
                {/* Chronic Conditions */}
                {patient.chronicConditions?.length > 0 && (
                  <SectionCard title="Chronic Conditions" icon={FiActivity} iconColor="text-amber-600" iconBg="bg-amber-50" delay={0.15}>
                    <div className="divide-y divide-surface-100/50">
                      {patient.chronicConditions.map((c, i) => (
                        <motion.div key={i} whileHover={{ x: 6 }} className="px-6 py-4 flex items-center justify-between hover:bg-amber-50/20 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${c.status === 'controlled' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500 animate-pulse'}`} />
                            <span className="text-sm font-bold text-surface-900">{c.name}</span>
                          </div>
                          <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest ${
                            c.status === 'controlled' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                          }`}>
                            {c.status}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {/* VISITS TAB: Enhanced Record History */}
                {patient.visits?.length > 0 && (
                  <SectionCard title="Consultation History" icon={FiCalendar} iconColor="text-indigo-600" iconBg="bg-indigo-50" delay={0.2}>
                    <div className="divide-y divide-surface-100/50">
                      {patient.visits.map((v, i) => (
                        <div key={i} className="p-6 group hover:bg-slate-50/50 transition-all duration-300">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-100 group-hover:scale-110 transition-transform">
                                <FiUser className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-base font-bold text-surface-950">{v.doctorName}</p>
                                <p className="text-xs text-surface-400 font-semibold">{v.hospitalName}</p>
                              </div>
                            </div>
                            <span className="px-3 py-1.5 rounded-xl bg-white border border-surface-200 text-[10px] font-bold text-surface-400 uppercase tracking-tighter">
                              {new Date(v.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="pl-14">
                            <p className="text-sm text-surface-800 leading-relaxed font-semibold mb-3">
                              {v.diagnosis}
                            </p>
                            {v.prescriptions?.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {v.prescriptions.map((p, j) => (
                                  <span key={j} className="px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-100/60 text-[10px] font-bold text-brand-700 uppercase tracking-tight">
                                    {p.medicine} &middot; {p.dosage}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {/* ─── ADD VISIT ─── */}
                {!showAddVisit ? (
                  <FadeInUp delay={0.3}>
                    <button 
                      onClick={() => setShowAddVisit(true)} 
                      className="w-full py-6 rounded-[32px] bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-sm tracking-widest uppercase shadow-xl shadow-teal-500/20 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <FiPlus className="w-5 h-5" /> Start New Consultation Record
                    </button>
                  </FadeInUp>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-8 rounded-[36px] shadow-premium relative border-teal-200/40">
                    <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full" />
                    <div className="flex items-center justify-between mb-8">
                       <div>
                         <h3 className="text-lg font-bold text-surface-950 tracking-tight">New Consultation</h3>
                         <p className="text-[11px] font-bold text-surface-400 uppercase tracking-widest mt-1">Provider: Dr. Antigravity</p>
                       </div>
                       <button onClick={() => setShowAddVisit(false)} className="w-10 h-10 rounded-2xl bg-surface-50 flex items-center justify-center text-surface-400 hover:bg-red-50 hover:text-red-500 transition-all">
                         <FiX className="w-5 h-5" />
                       </button>
                    </div>

                    <form onSubmit={handleSubmitVisit} className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[13px] font-bold text-surface-600 uppercase tracking-widest px-1">Diagnosis / Reason for Visit</label>
                        <textarea 
                          className="input min-h-[100px] text-lg font-bold" 
                          value={visitForm.diagnosis}
                          onChange={e => setVisitForm({...visitForm, diagnosis: e.target.value})} 
                          required 
                          placeholder="What did you find? (e.g., Acute Bronchitis)" 
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[13px] font-bold text-surface-600 uppercase tracking-widest px-1">Prescriptions</label>
                        <div className="space-y-3">
                          {visitForm.prescriptions.map((p, i) => (
                            <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                              <input className="input sm:col-span-2 font-bold" placeholder="Medicine Name" value={p.medicine} onChange={e => updatePrescription(i, 'medicine', e.target.value)} />
                              <input className="input font-bold" placeholder="Dosage" value={p.dosage} onChange={e => updatePrescription(i, 'dosage', e.target.value)} />
                              <input className="input font-bold" placeholder="Freq" value={p.frequency} onChange={e => updatePrescription(i, 'frequency', e.target.value)} />
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={() => setVisitForm({...visitForm, prescriptions: [...visitForm.prescriptions, {medicine:'',dosage:'',frequency:'',duration:''}]})}
                          className="w-full py-4 rounded-2xl border-2 border-dashed border-surface-200 text-xs font-bold text-surface-400 hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50/20 transition-all flex items-center justify-center gap-2">
                          <FiPlus className="w-4 h-4" /> Add Another Medication
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[13px] font-bold text-surface-600 uppercase tracking-widest px-1 text-xs">Follow-up Date</label>
                          <div className="relative">
                            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                            <input className="input pl-11" type="date" value={visitForm.followUpDate} onChange={e => setVisitForm({...visitForm, followUpDate: e.target.value})} />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[13px] font-bold text-surface-600 uppercase tracking-widest px-1 text-xs">Clinical Notes</label>
                          <input className="input" value={visitForm.notes} onChange={e => setVisitForm({...visitForm, notes: e.target.value})} placeholder="Internal notes (optional)" />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <motion.button 
                          whileHover={{ scale: 1.01 }} 
                          type="submit" 
                          className="flex-1 py-4 rounded-2xl bg-brand-600 text-white font-bold text-sm tracking-widest uppercase shadow-xl shadow-brand-200 hover:bg-brand-700 transition-all" 
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : 'Secure & Save Record'}
                        </motion.button>
                        <button type="button" onClick={() => setShowAddVisit(false)} className="px-8 rounded-2xl bg-surface-50 text-surface-400 font-bold hover:bg-surface-100 transition-all">Cancel</button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Summary Box */}
            <SectionCard title="Patient Profile" icon={FiUser} iconColor="text-indigo-600" iconBg="bg-indigo-50">
               <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-surface-400 uppercase tracking-widest text-[10px]">Access Type</span>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${isEmergency ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                      {patient._accessType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-surface-400 uppercase tracking-widest text-[10px]">Gender</span>
                    <span className="font-bold text-surface-950 uppercase">{patient.gender || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-surface-400 uppercase tracking-widest text-[10px]">Blood Group</span>
                    <span className="font-bold text-red-600 text-base">{patient.bloodGroup || '—'}</span>
                  </div>
               </div>
            </SectionCard>

            {/* Emergency Contacts */}
            {patient.emergencyContacts?.length > 0 && (
              <SectionCard title="Emergency Contacts" icon={FiPhone} iconColor="text-red-600" iconBg="bg-red-50" delay={0.1}>
                <div className="divide-y divide-surface-100/50">
                  {patient.emergencyContacts.map((ec, i) => (
                    <div key={i} className="px-6 py-5 group">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-bold text-surface-950">{ec.name}</p>
                        <span className="px-2 py-1 rounded-lg bg-surface-50 text-[9px] font-bold text-surface-400 uppercase tracking-widest">{ec.relationship}</span>
                      </div>
                      <a href={`tel:${ec.phone}`} className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 mt-2 transition-colors">
                        <FiPhone className="w-3 h-3" /> {ec.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Past Surgeries/Family side by side in sidebar */}
            {patient.pastSurgeries?.length > 0 && (
              <SectionCard title="Past Surgeries" icon={FiShield} iconColor="text-slate-600" iconBg="bg-slate-50" delay={0.2}>
                <div className="divide-y divide-surface-100/50">
                  {patient.pastSurgeries.map((s, i) => (
                    <div key={i} className="px-6 py-4 flex justify-between items-center">
                      <span className="text-sm font-bold text-surface-800 tracking-tight">{s.name}</span>
                      <span className="text-xs font-bold text-surface-400">{s.year}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSummary;
