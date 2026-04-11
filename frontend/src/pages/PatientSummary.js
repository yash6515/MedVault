import { useState } from 'react';
import { addVisit } from '../services/api';
import { motion } from 'framer-motion';
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem } from '../components/ui/Motion';
import {
  FiArrowLeft, FiAlertTriangle, FiShield, FiHeart, FiPhone,
  FiClock, FiMapPin, FiPlus, FiCheck, FiX, FiUser
} from 'react-icons/fi';

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
    <div className="min-h-[calc(100vh-64px)] bg-surface-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <FadeIn>
          <button onClick={onBack} className="btn-ghost btn-sm mb-4">
            <FiArrowLeft className="w-4 h-4" /> Back to Lookup
          </button>
        </FadeIn>

        {isEmergency && (
          <FadeIn>
            <div className="mb-4 p-4 rounded-xl bg-amber-50 border-2 border-amber-300 flex items-center gap-3">
              <FiAlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-800">Emergency Access — Limited Data</p>
                <p className="text-xs text-amber-600">Only showing allergies, blood group, medications. Full access requires PIN.</p>
              </div>
            </div>
          </FadeIn>
        )}

        {success && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
            className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-medium text-emerald-700 flex items-center gap-2">
            <FiCheck className="w-4 h-4" /> {success}
          </motion.div>
        )}

        {/* Patient Header */}
        <FadeInUp>
          <div className="card p-6 mb-6 bg-gradient-to-r from-surface-900 to-surface-800 text-white border-0">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-xl font-bold">
                {patient.fullName?.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold">{patient.fullName}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm opacity-75">
                  {!isEmergency && <span className="font-mono">{patient.healthId}</span>}
                  {patient.bloodGroup && (
                    <span className="px-2 py-0.5 rounded bg-white/15 text-xs font-bold">{patient.bloodGroup}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </FadeInUp>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Allergies */}
            {patient.allergies?.length > 0 && (
              <FadeInUp delay={0.05}>
                <div className="card overflow-hidden border-danger-200/60">
                  <div className="px-5 py-4 bg-danger-50 border-b border-danger-200/60 flex items-center gap-2">
                    <FiAlertTriangle className="w-4 h-4 text-danger-500" />
                    <h3 className="text-sm font-bold text-danger-700">DRUG ALLERGIES</h3>
                  </div>
                  <div className="p-4 space-y-2">
                    {patient.allergies.map((a, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-danger-50/60 border border-danger-200/40">
                        <FiShield className="w-4 h-4 text-danger-500 flex-shrink-0" />
                        <span className="text-sm font-bold text-danger-700 uppercase tracking-wide flex-1">{a.name}</span>
                        <span className={a.severity === 'life-threatening' || a.severity === 'severe' ? 'badge-danger' : 'badge-warning'}>
                          {a.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            )}

            {/* Current Medications */}
            {patient.currentMedications?.length > 0 && (
              <FadeInUp delay={0.1}>
                <div className="card overflow-hidden">
                  <div className="px-5 py-4 border-b border-surface-200/60">
                    <h3 className="text-sm font-bold text-surface-900">Current Medications</h3>
                  </div>
                  <div className="divide-y divide-surface-100">
                    {patient.currentMedications.map((m, i) => (
                      <div key={i} className="px-5 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-surface-900">{m.name}</p>
                          <p className="text-xs text-surface-500">{m.frequency}</p>
                        </div>
                        <span className="badge-info">{m.dosage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            )}

            {!isEmergency && (
              <>
                {/* Chronic Conditions */}
                {patient.chronicConditions?.length > 0 && (
                  <FadeInUp delay={0.15}>
                    <div className="card overflow-hidden">
                      <div className="px-5 py-4 border-b border-surface-200/60">
                        <h3 className="text-sm font-bold text-surface-900">Chronic Conditions</h3>
                      </div>
                      <div className="divide-y divide-surface-100">
                        {patient.chronicConditions.map((c, i) => (
                          <div key={i} className="px-5 py-3 flex items-center justify-between">
                            <span className="text-sm font-medium text-surface-800">{c.name}</span>
                            <span className={c.status === 'controlled' ? 'badge-success' : 'badge-danger'}>{c.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeInUp>
                )}

                {/* Past Surgeries + Family History side by side */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {patient.pastSurgeries?.length > 0 && (
                    <FadeInUp delay={0.2}>
                      <div className="card overflow-hidden h-full">
                        <div className="px-5 py-4 border-b border-surface-200/60">
                          <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider">Surgeries</h3>
                        </div>
                        <div className="divide-y divide-surface-100">
                          {patient.pastSurgeries.map((s, i) => (
                            <div key={i} className="px-5 py-2.5 flex justify-between text-sm">
                              <span className="text-surface-800">{s.name}</span>
                              <span className="text-surface-400">{s.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FadeInUp>
                  )}
                  {patient.familyHistory?.length > 0 && (
                    <FadeInUp delay={0.25}>
                      <div className="card overflow-hidden h-full">
                        <div className="px-5 py-4 border-b border-surface-200/60">
                          <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider">Family History</h3>
                        </div>
                        <div className="divide-y divide-surface-100">
                          {patient.familyHistory.map((f, i) => (
                            <div key={i} className="px-5 py-2.5 flex justify-between text-sm">
                              <span className="text-surface-400">{f.relation}</span>
                              <span className="text-surface-800">{f.condition}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FadeInUp>
                  )}
                </div>

                {/* Previous Visits */}
                {patient.visits?.length > 0 && (
                  <FadeInUp delay={0.3}>
                    <div className="card overflow-hidden">
                      <div className="px-5 py-4 border-b border-surface-200/60">
                        <h3 className="text-sm font-bold text-surface-900">Previous Visits</h3>
                      </div>
                      <div className="divide-y divide-surface-100">
                        {patient.visits.map((v, i) => (
                          <div key={i} className="p-5">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <FiUser className="w-4 h-4 text-brand-500" />
                                <span className="text-sm font-semibold text-surface-900">{v.doctorName}</span>
                                <span className="text-xs text-surface-400">&middot; {v.hospitalName}</span>
                              </div>
                              <span className="text-[11px] text-surface-400 flex items-center gap-1">
                                <FiClock className="w-3 h-3" />
                                {new Date(v.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-sm text-surface-700 mb-1">{v.diagnosis}</p>
                            {v.prescriptions?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {v.prescriptions.map((p, j) => (
                                  <span key={j} className="px-2 py-1 rounded-lg bg-surface-50 border border-surface-200/60 text-[11px] text-surface-600">
                                    {p.medicine} {p.dosage}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeInUp>
                )}

                {/* Add Visit */}
                {!showAddVisit ? (
                  <FadeInUp delay={0.35}>
                    <button onClick={() => setShowAddVisit(true)} className="btn-teal btn-lg w-full">
                      <FiPlus className="w-4 h-4" /> Add Prescription / Visit Notes
                    </button>
                  </FadeInUp>
                ) : (
                  <FadeInUp>
                    <div className="card p-6">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-bold text-surface-900">Add Visit Notes</h3>
                        <button onClick={() => setShowAddVisit(false)} className="btn-icon">
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                      <form onSubmit={handleSubmitVisit} className="space-y-4">
                        <div>
                          <label className="label">Diagnosis</label>
                          <input className="input" value={visitForm.diagnosis}
                            onChange={e => setVisitForm({...visitForm, diagnosis: e.target.value})} required placeholder="e.g., Upper Respiratory Infection" />
                        </div>

                        <div>
                          <label className="label">Prescriptions</label>
                          {visitForm.prescriptions.map((p, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                              <input className="input flex-1" placeholder="Medicine" value={p.medicine} onChange={e => updatePrescription(i, 'medicine', e.target.value)} />
                              <input className="input w-20" placeholder="Dosage" value={p.dosage} onChange={e => updatePrescription(i, 'dosage', e.target.value)} />
                              <input className="input w-24" placeholder="Frequency" value={p.frequency} onChange={e => updatePrescription(i, 'frequency', e.target.value)} />
                              <input className="input w-20" placeholder="Duration" value={p.duration} onChange={e => updatePrescription(i, 'duration', e.target.value)} />
                            </div>
                          ))}
                          <button type="button" onClick={() => setVisitForm({...visitForm, prescriptions: [...visitForm.prescriptions, {medicine:'',dosage:'',frequency:'',duration:''}]})}
                            className="w-full py-2 rounded-xl border-2 border-dashed border-surface-200 text-xs font-semibold text-surface-400 hover:border-brand-300 hover:text-brand-500 transition-all flex items-center justify-center gap-1">
                            <FiPlus className="w-3 h-3" /> Add Prescription
                          </button>
                        </div>

                        <div>
                          <label className="label">Notes</label>
                          <textarea className="input" rows={3} value={visitForm.notes}
                            onChange={e => setVisitForm({...visitForm, notes: e.target.value})} placeholder="Additional notes..." />
                        </div>

                        <div>
                          <label className="label">Follow-up Date</label>
                          <input className="input max-w-[200px]" type="date" value={visitForm.followUpDate}
                            onChange={e => setVisitForm({...visitForm, followUpDate: e.target.value})} />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : <span className="flex items-center gap-2"><FiCheck /> Save Visit</span>}
                          </button>
                          <button type="button" onClick={() => setShowAddVisit(false)} className="btn-ghost">Cancel</button>
                        </div>
                      </form>
                    </div>
                  </FadeInUp>
                )}
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Emergency Contacts */}
            {patient.emergencyContacts?.length > 0 && (
              <FadeInUp delay={0.1}>
                <div className="card overflow-hidden">
                  <div className="px-5 py-4 border-b border-surface-200/60">
                    <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider">Emergency Contacts</h3>
                  </div>
                  <div className="divide-y divide-surface-100">
                    {patient.emergencyContacts.map((ec, i) => (
                      <div key={i} className="px-5 py-3">
                        <p className="text-sm font-medium text-surface-800">{ec.name}</p>
                        <p className="text-xs text-surface-400">{ec.relationship}</p>
                        <p className="text-xs text-brand-600 flex items-center gap-1 mt-1"><FiPhone className="w-3 h-3" />{ec.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSummary;
