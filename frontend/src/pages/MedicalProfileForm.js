import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatientProfile, updateMedicalProfile } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeInUp } from '../components/ui/Motion';
import { FiPlus, FiX, FiCheck, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

const steps = [
  { id: 1, title: 'Basic Medical', desc: 'Blood group & allergies' },
  { id: 2, title: 'Medications', desc: 'Current meds & conditions' },
  { id: 3, title: 'History', desc: 'Surgeries & family' },
  { id: 4, title: 'Lifestyle', desc: 'Habits & diet' },
  { id: 5, title: 'Emergency', desc: 'Emergency contacts' },
];

const MedicalProfileForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    bloodGroup: '',
    allergies: [{ name: '', severity: 'mild' }],
    currentMedications: [{ name: '', dosage: '', frequency: '' }],
    chronicConditions: [{ name: '', status: 'controlled' }],
    pastSurgeries: [{ name: '', year: '' }],
    familyHistory: [{ relation: '', condition: '' }],
    smoker: false,
    alcoholUse: 'none',
    exerciseFrequency: 'none',
    dietType: 'non-veg',
    emergencyContacts: [{ name: '', phone: '', relationship: '' }, { name: '', phone: '', relationship: '' }]
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await getPatientProfile();
        setForm(prev => ({
          ...prev,
          bloodGroup: data.bloodGroup || '',
          allergies: data.allergies?.length ? data.allergies : prev.allergies,
          currentMedications: data.currentMedications?.length ? data.currentMedications : prev.currentMedications,
          chronicConditions: data.chronicConditions?.length ? data.chronicConditions : prev.chronicConditions,
          pastSurgeries: data.pastSurgeries?.length ? data.pastSurgeries : prev.pastSurgeries,
          familyHistory: data.familyHistory?.length ? data.familyHistory : prev.familyHistory,
          smoker: data.smoker || false,
          alcoholUse: data.alcoholUse || 'none',
          exerciseFrequency: data.exerciseFrequency || 'none',
          dietType: data.dietType || 'non-veg',
          emergencyContacts: data.emergencyContacts?.length >= 2 ? data.emergencyContacts : prev.emergencyContacts
        }));
      } catch (err) { /* new profile */ }
    };
    loadProfile();
  }, []);

  const addItem = (field, template) => setForm({ ...form, [field]: [...form[field], template] });
  const removeItem = (field, index) => {
    if (form[field].length <= 1) return;
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });
  };
  const updateItem = (field, index, key, value) => {
    const updated = [...form[field]];
    updated[index] = { ...updated[index], [key]: value };
    setForm({ ...form, [field]: updated });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const cleanData = {
        ...form,
        allergies: form.allergies.filter(a => a.name),
        currentMedications: form.currentMedications.filter(m => m.name),
        chronicConditions: form.chronicConditions.filter(c => c.name),
        pastSurgeries: form.pastSurgeries.filter(s => s.name),
        familyHistory: form.familyHistory.filter(f => f.relation && f.condition),
        emergencyContacts: form.emergencyContacts.filter(e => e.name && e.phone)
      };
      await updateMedicalProfile(cleanData);
      setSuccess('Profile saved successfully!');
      setTimeout(() => navigate('/patient/dashboard'), 1500);
    } catch (err) { setSuccess(''); }
    setLoading(false);
  };

  const DynamicRow = ({ children, onRemove, canRemove }) => (
    <div className="flex gap-2 items-start mb-2">
      <div className="flex-1 grid grid-cols-2 gap-2">{children}</div>
      {canRemove && (
        <button onClick={onRemove} className="w-8 h-8 rounded-lg bg-danger-50 text-danger-400 hover:text-danger-600 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
          <FiX className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );

  const AddButton = ({ onClick, label }) => (
    <button onClick={onClick} className="w-full py-2.5 rounded-xl border-2 border-dashed border-surface-200 text-xs font-semibold text-surface-400 hover:border-brand-300 hover:text-brand-500 transition-all flex items-center justify-center gap-1.5">
      <FiPlus className="w-3.5 h-3.5" /> {label}
    </button>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Bar */}
        <FadeInUp>
          <div className="card p-4 mb-6">
            <div className="flex items-center justify-between">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      step > s.id ? 'bg-teal-500 text-white' :
                      step === s.id ? 'bg-brand-600 text-white shadow-glow' :
                      'bg-surface-100 text-surface-400'
                    }`}>
                      {step > s.id ? <FiCheck className="w-3.5 h-3.5" /> : s.id}
                    </div>
                    <div className="hidden sm:block">
                      <p className={`text-xs font-semibold ${step === s.id ? 'text-surface-900' : 'text-surface-400'}`}>{s.title}</p>
                    </div>
                  </div>
                  {i < steps.length - 1 && <div className={`w-8 lg:w-16 h-0.5 mx-2 rounded ${step > s.id ? 'bg-teal-400' : 'bg-surface-200'}`} />}
                </div>
              ))}
            </div>
          </div>
        </FadeInUp>

        {success && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
            className="mb-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-medium text-emerald-700 flex items-center gap-2">
            <FiCheck className="w-4 h-4" /> {success}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.25}}>
            <div className="card p-6">
              {/* Step 1 */}
              {step === 1 && (
                <div>
                  <h2 className="text-lg font-bold text-surface-900 mb-1">Basic Medical Information</h2>
                  <p className="text-sm text-surface-500 mb-6">Blood group and known drug allergies</p>

                  <div className="mb-6">
                    <label className="label">Blood Group</label>
                    <select className="input max-w-[200px]" value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})}>
                      <option value="">Select</option>
                      {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="label">Drug Allergies</label>
                    {form.allergies.map((a, i) => (
                      <DynamicRow key={i} onRemove={() => removeItem('allergies', i)} canRemove={form.allergies.length > 1}>
                        <input className="input" placeholder="e.g., Penicillin" value={a.name}
                          onChange={e => updateItem('allergies', i, 'name', e.target.value)} />
                        <select className="input" value={a.severity} onChange={e => updateItem('allergies', i, 'severity', e.target.value)}>
                          <option value="mild">Mild</option>
                          <option value="moderate">Moderate</option>
                          <option value="severe">Severe</option>
                          <option value="life-threatening">Life-threatening</option>
                        </select>
                      </DynamicRow>
                    ))}
                    <AddButton onClick={() => addItem('allergies', {name:'', severity:'mild'})} label="Add Allergy" />
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div>
                  <h2 className="text-lg font-bold text-surface-900 mb-1">Medications & Conditions</h2>
                  <p className="text-sm text-surface-500 mb-6">Current medications and chronic conditions</p>

                  <div className="mb-6">
                    <label className="label">Current Medications</label>
                    {form.currentMedications.map((m, i) => (
                      <div key={i} className="flex gap-2 items-start mb-2">
                        <input className="input flex-1" placeholder="Medicine" value={m.name} onChange={e => updateItem('currentMedications', i, 'name', e.target.value)} />
                        <input className="input w-24" placeholder="Dosage" value={m.dosage} onChange={e => updateItem('currentMedications', i, 'dosage', e.target.value)} />
                        <input className="input w-28" placeholder="Frequency" value={m.frequency} onChange={e => updateItem('currentMedications', i, 'frequency', e.target.value)} />
                        {form.currentMedications.length > 1 && (
                          <button onClick={() => removeItem('currentMedications', i)} className="w-8 h-8 rounded-lg bg-danger-50 text-danger-400 hover:text-danger-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <FiX className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <AddButton onClick={() => addItem('currentMedications', {name:'',dosage:'',frequency:''})} label="Add Medication" />
                  </div>

                  <div>
                    <label className="label">Chronic Conditions</label>
                    {form.chronicConditions.map((c, i) => (
                      <DynamicRow key={i} onRemove={() => removeItem('chronicConditions', i)} canRemove={form.chronicConditions.length > 1}>
                        <input className="input" placeholder="e.g., Diabetes" value={c.name} onChange={e => updateItem('chronicConditions', i, 'name', e.target.value)} />
                        <select className="input" value={c.status} onChange={e => updateItem('chronicConditions', i, 'status', e.target.value)}>
                          <option value="controlled">Controlled</option>
                          <option value="uncontrolled">Uncontrolled</option>
                        </select>
                      </DynamicRow>
                    ))}
                    <AddButton onClick={() => addItem('chronicConditions', {name:'',status:'controlled'})} label="Add Condition" />
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div>
                  <h2 className="text-lg font-bold text-surface-900 mb-1">Medical History</h2>
                  <p className="text-sm text-surface-500 mb-6">Past surgeries and family medical history</p>

                  <div className="mb-6">
                    <label className="label">Past Surgeries</label>
                    {form.pastSurgeries.map((s, i) => (
                      <DynamicRow key={i} onRemove={() => removeItem('pastSurgeries', i)} canRemove={form.pastSurgeries.length > 1}>
                        <input className="input" placeholder="Surgery name" value={s.name} onChange={e => updateItem('pastSurgeries', i, 'name', e.target.value)} />
                        <input className="input" placeholder="Year (2019)" value={s.year} onChange={e => updateItem('pastSurgeries', i, 'year', e.target.value)} />
                      </DynamicRow>
                    ))}
                    <AddButton onClick={() => addItem('pastSurgeries', {name:'',year:''})} label="Add Surgery" />
                  </div>

                  <div>
                    <label className="label">Family Medical History</label>
                    {form.familyHistory.map((f, i) => (
                      <DynamicRow key={i} onRemove={() => removeItem('familyHistory', i)} canRemove={form.familyHistory.length > 1}>
                        <input className="input" placeholder="Relation (Father)" value={f.relation} onChange={e => updateItem('familyHistory', i, 'relation', e.target.value)} />
                        <input className="input" placeholder="Condition" value={f.condition} onChange={e => updateItem('familyHistory', i, 'condition', e.target.value)} />
                      </DynamicRow>
                    ))}
                    <AddButton onClick={() => addItem('familyHistory', {relation:'',condition:''})} label="Add Family History" />
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <div>
                  <h2 className="text-lg font-bold text-surface-900 mb-1">Lifestyle</h2>
                  <p className="text-sm text-surface-500 mb-6">Habits and lifestyle information</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Smoker</label>
                      <select className="input" value={form.smoker ? 'yes' : 'no'} onChange={e => setForm({...form, smoker: e.target.value === 'yes'})}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Alcohol Use</label>
                      <select className="input" value={form.alcoholUse} onChange={e => setForm({...form, alcoholUse: e.target.value})}>
                        <option value="none">None</option>
                        <option value="occasional">Occasional</option>
                        <option value="moderate">Moderate</option>
                        <option value="heavy">Heavy</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Exercise</label>
                      <select className="input" value={form.exerciseFrequency} onChange={e => setForm({...form, exerciseFrequency: e.target.value})}>
                        <option value="none">None / Sedentary</option>
                        <option value="light">Light (1-2x/week)</option>
                        <option value="moderate">Moderate (3-4x/week)</option>
                        <option value="daily">Daily</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Diet Type</label>
                      <select className="input" value={form.dietType} onChange={e => setForm({...form, dietType: e.target.value})}>
                        <option value="veg">Vegetarian</option>
                        <option value="non-veg">Non-Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5 */}
              {step === 5 && (
                <div>
                  <h2 className="text-lg font-bold text-surface-900 mb-1">Emergency Contacts</h2>
                  <p className="text-sm text-surface-500 mb-6">Minimum 2 contacts required</p>

                  {form.emergencyContacts.map((ec, i) => (
                    <div key={i} className="p-4 rounded-xl bg-surface-50 border border-surface-200/60 mb-3">
                      <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Contact {i + 1}</p>
                      <div className="grid grid-cols-3 gap-2">
                        <input className="input" placeholder="Full Name" value={ec.name} onChange={e => updateItem('emergencyContacts', i, 'name', e.target.value)} />
                        <input className="input" placeholder="Phone" value={ec.phone} onChange={e => updateItem('emergencyContacts', i, 'phone', e.target.value)} />
                        <input className="input" placeholder="Relationship" value={ec.relationship} onChange={e => updateItem('emergencyContacts', i, 'relationship', e.target.value)} />
                      </div>
                    </div>
                  ))}
                  {form.emergencyContacts.length < 5 && (
                    <AddButton onClick={() => addItem('emergencyContacts', {name:'',phone:'',relationship:''})} label="Add Contact" />
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-200/60">
                <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
                  className="btn-ghost disabled:opacity-30">
                  <FiArrowLeft className="w-4 h-4" /> Previous
                </button>
                {step < 5 ? (
                  <button onClick={() => setStep(s => s + 1)} className="btn-primary">
                    Next <FiArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleSave} disabled={loading} className="btn-teal btn-lg">
                    {loading ? 'Saving...' : <span className="flex items-center gap-2"><FiCheck /> Save Medical Profile</span>}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MedicalProfileForm;
