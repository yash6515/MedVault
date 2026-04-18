import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatientProfile, updateMedicalProfile, parseDocument, extractMedicalData } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeInUp } from '../components/ui/Motion';
import {
  FiPlus, FiX, FiCheck, FiArrowRight, FiArrowLeft,
  FiUploadCloud, FiCpu, FiFileText, FiLoader, FiAlertCircle, FiZap,
  FiDroplet, FiHeart, FiScissors, FiSun, FiPhone, FiUser,
  FiAlertTriangle, FiShield, FiFile, FiTrash2
} from 'react-icons/fi';

/* ─── Step Definitions ───────────────────── */
const steps = [
  { id: 1, title: 'Basic', desc: 'Blood & allergies', icon: FiDroplet, color: 'from-blue-500 to-blue-600' },
  { id: 2, title: 'Meds', desc: 'Medications & conditions', icon: FiHeart, color: 'from-rose-500 to-pink-600' },
  { id: 3, title: 'History', desc: 'Surgeries & family', icon: FiScissors, color: 'from-amber-500 to-orange-600' },
  { id: 4, title: 'Lifestyle', desc: 'Habits & diet', icon: FiSun, color: 'from-emerald-500 to-teal-600' },
  { id: 5, title: 'Emergency', desc: 'Contacts', icon: FiPhone, color: 'from-red-500 to-rose-600' },
];

const easeOut = [0.25, 0.46, 0.45, 0.94];

/* ─── Sub-Components (defined outside to prevent re-mount on every render) ── */
const AiBadge = ({ field, aiFilledFields }) => {
  if (!aiFilledFields.has(field)) return null;
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/60 text-[10px] font-bold text-teal-600 ml-2 uppercase tracking-wider"
    >
      <FiZap className="w-2.5 h-2.5" /> AI filled
    </motion.span>
  );
};

const SectionHeader = ({ icon: Icon, title, subtitle, gradient = 'from-brand-500 to-teal-500' }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <h2 className="text-base font-bold text-surface-900 tracking-tight">{title}</h2>
      <p className="text-xs text-surface-400 mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const InputField = ({ label, icon: Icon, children, className = '' }) => (
  <div className={className}>
    <label className="flex items-center gap-2 text-[12px] font-semibold text-surface-600 mb-2 tracking-wide">
      {Icon && <Icon className="w-3.5 h-3.5 text-surface-400" />}
      {label}
    </label>
    {children}
  </div>
);

const AddButton = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full py-2.5 rounded-xl border-2 border-dashed border-surface-200/80 text-xs font-semibold text-surface-400 hover:border-brand-300 hover:text-brand-500 hover:bg-brand-50/30 transition-all duration-200 flex items-center justify-center gap-2"
  >
    <FiPlus className="w-3 h-3" />
    {label}
  </button>
);

const RemoveButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-8 h-8 rounded-xl bg-danger-50/80 text-danger-400 hover:text-white hover:bg-danger-500 flex items-center justify-center flex-shrink-0 transition-all duration-200"
  >
    <FiX className="w-3.5 h-3.5" />
  </button>
);

const ErrorMsg = ({ error }) => error ? (
  <p className="text-[11px] text-danger-500 mt-1.5 font-medium flex items-center gap-1">
    <FiAlertCircle className="w-3 h-3" /> {error}
  </p>
) : null;

const MedicalProfileForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiStatus, setAiStatus] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [aiFilledFields, setAiFilledFields] = useState(new Set());
  const [aiExtractedText, setAiExtractedText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [contactErrors, setContactErrors] = useState({});
  const [saveError, setSaveError] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [aiProgress, setAiProgress] = useState(0);
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  const [form, setForm] = useState({
    bloodGroup: '',
    allergies: [{ name: '', severity: 'mild' }],
    currentMedications: [{ name: '', dosage: '', frequency: '' }],
    chronicConditions: [{ name: '', status: 'controlled' }],
    pastSurgeries: [{ name: '', year: '' }],
    familyHistory: [{ relation: '', condition: '' }],
    currentWeight: '',
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
          currentWeight: data.currentWeight || '',
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

  const addItem = (field, template) => setForm(prev => ({ ...prev, [field]: [...prev[field], template] }));
  const removeItem = (field, index) => {
    setForm(prev => {
      if (field === 'emergencyContacts' && prev.emergencyContacts.length <= 2) return prev;
      if (prev[field].length <= 1) return prev;
      return { ...prev, [field]: prev[field].filter((_, i) => i !== index) };
    });
  };
  const updateItem = (field, index, key, value) => {
    setForm(prev => {
      const updated = [...prev[field]];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, [field]: updated };
    });
    if (field === 'emergencyContacts') {
      setContactErrors(prev => ({ ...prev, [`${index}-${key}`]: '' }));
    }
  };

  /* ─── Emergency Contact Validation ─────── */
  const validateContacts = useCallback(() => {
    const errors = {};
    let valid = true;
    const contacts = form.emergencyContacts.slice(0, 2);
    contacts.forEach((ec, i) => {
      if (!ec.name.trim()) { errors[`${i}-name`] = 'Full name is required'; valid = false; }
      if (!ec.phone.trim()) { errors[`${i}-phone`] = 'Phone number is required'; valid = false; }
      else if (!/^\d{10}$/.test(ec.phone)) { errors[`${i}-phone`] = 'Enter a valid 10-digit number'; valid = false; }
      if (!ec.relationship.trim()) { errors[`${i}-relationship`] = 'Relationship is required'; valid = false; }
    });
    setContactErrors(errors);
    return valid;
  }, [form.emergencyContacts]);

  /* ─── AI Document Processing ───────────── */
  const processFile = async (file) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setAiMessage('Only PDF, JPG, and PNG files are supported.');
      setAiStatus('error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setAiMessage('File must be less than 10MB.');
      setAiStatus('error');
      return;
    }

    setAiProcessing(true);
    setAiStatus('extracting');
    setAiMessage('');
    setAiExtractedText('');
    setShowPreview(false);
    setUploadedFileName(file.name);
    setAiProgress(10);

    try {
      const fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setAiProgress(30);

      // Step 1: Extract text from document
      setAiStatus('extracting');
      let extractedText = '';

      try {
        const parseRes = await parseDocument({ fileData, fileType: file.type });
        extractedText = parseRes.data.text || '';
      } catch (parseErr) {
        const msg = parseErr.response?.data?.message || parseErr.message;
        throw new Error(`Text extraction failed: ${msg}`);
      }

      setAiProgress(60);

      if (!extractedText || extractedText.trim().length < 10) {
        throw new Error('No readable text found in the document. Try a clearer image or PDF with selectable text.');
      }

      // Show preview of extracted text
      setAiExtractedText(extractedText.slice(0, 500));
      setShowPreview(true);

      // Step 2: AI structuring
      setAiStatus('analyzing');
      setAiProgress(75);
      let extracted;

      try {
        const extractRes = await extractMedicalData({ text: extractedText, fileType: file.type });
        extracted = extractRes.data.extracted;
      } catch (aiErr) {
        const msg = aiErr.response?.data?.message || aiErr.message;
        throw new Error(`AI analysis failed: ${msg}`);
      }

      if (!extracted) {
        throw new Error('AI could not parse the document. Try uploading a clearer medical report.');
      }

      setAiProgress(90);

      // Step 3: Auto-fill
      const filledFields = new Set();

      if (extracted.allergies?.length > 0) {
        const existing = form.allergies.filter(a => a.name);
        const newItems = [...existing, ...extracted.allergies];
        setForm(prev => ({ ...prev, allergies: newItems.length ? newItems : prev.allergies }));
        filledFields.add('allergies');
      }
      if (extracted.currentMedications?.length > 0) {
        const existing = form.currentMedications.filter(m => m.name);
        const newItems = [...existing, ...extracted.currentMedications];
        setForm(prev => ({ ...prev, currentMedications: newItems.length ? newItems : prev.currentMedications }));
        filledFields.add('currentMedications');
      }
      if (extracted.chronicConditions?.length > 0) {
        const existing = form.chronicConditions.filter(c => c.name);
        const newItems = [...existing, ...extracted.chronicConditions];
        setForm(prev => ({ ...prev, chronicConditions: newItems.length ? newItems : prev.chronicConditions }));
        filledFields.add('chronicConditions');
      }
      if (extracted.pastSurgeries?.length > 0) {
        const existing = form.pastSurgeries.filter(s => s.name);
        const newItems = [...existing, ...extracted.pastSurgeries];
        setForm(prev => ({ ...prev, pastSurgeries: newItems.length ? newItems : prev.pastSurgeries }));
        filledFields.add('pastSurgeries');
      }
      if (extracted.familyHistory?.length > 0) {
        const existing = form.familyHistory.filter(f => f.relation && f.condition);
        const newItems = [...existing, ...extracted.familyHistory];
        setForm(prev => ({ ...prev, familyHistory: newItems.length ? newItems : prev.familyHistory }));
        filledFields.add('familyHistory');
      }

      setAiProgress(100);
      setAiFilledFields(filledFields);
      setAiStatus('done');
      setAiMessage(
        filledFields.size > 0
          ? `Successfully extracted ${filledFields.size} categor${filledFields.size === 1 ? 'y' : 'ies'}. Review the auto-filled data below.`
          : 'Document processed but no structured medical data was found.'
      );
    } catch (err) {
      console.error('AI extraction error:', err);
      setAiStatus('error');
      setAiMessage(err.response?.data?.message || err.message || 'Failed to process document');
      setAiProgress(0);
    }

    setAiProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  /* ─── Save Handler ─────────────────────── */
  const handleSave = async () => {
    setSaveError('');
    if (!validateContacts()) {
      setSaveError('Please fill in all required emergency contact fields.');
      return;
    }

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
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save profile');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 py-8 sm:py-12">
      {/* Subtle background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto px-4 relative">

        {/* ══ STEPPER ═══════════════════════════ */}
        <FadeInUp>
          <div className="bg-surface-0/80 backdrop-blur-xl rounded-3xl border border-surface-200/60 dark:border-surface-200/40 shadow-card p-5 sm:p-7 mb-6 overflow-hidden relative">
            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 via-teal-500 to-emerald-500 opacity-40" />

            {/* Steps row */}
            <div className="relative">
              {/* Connector line (behind the icons) */}
              <div className="absolute top-[22px] left-0 right-0 flex justify-center" style={{ pointerEvents: 'none' }}>
                <div className="w-[75%] h-[3px] bg-surface-100 rounded-full relative overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-500 via-teal-500 to-emerald-500 rounded-full"
                    initial={false}
                    animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
              </div>

              {/* Step buttons — Grid for equal spacing */}
              <div className="relative z-10 grid grid-cols-5 gap-0">
                {steps.map((s) => {
                  const isDone = step > s.id;
                  const isActive = step === s.id;
                  const StepIcon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setStep(s.id)}
                      className="flex flex-col items-center group outline-none cursor-pointer py-1"
                      type="button"
                    >
                      {/* Icon circle */}
                      <motion.div
                        layout
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                        animate={isActive ? { boxShadow: '0 0 0 6px rgba(59,130,246,0.1)' } : { boxShadow: '0 0 0 0px rgba(59,130,246,0)' }}
                        transition={{ duration: 0.4, ease: easeOut }}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-400 ${
                          isDone
                            ? 'bg-gradient-to-br from-teal-400 to-emerald-500 text-white shadow-lg'
                            : isActive
                            ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-xl'
                            : 'bg-surface-0 text-surface-400 border-2 border-surface-200 group-hover:border-brand-300 group-hover:text-brand-500 group-hover:bg-brand-50/50'
                        }`}
                      >
                        {isDone ? (
                          <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
                            <FiCheck className="w-4 h-4" strokeWidth={3} />
                          </motion.div>
                        ) : (
                          <StepIcon className="w-[18px] h-[18px]" />
                        )}
                      </motion.div>

                      {/* Label */}
                      <div className="mt-2.5 text-center w-full px-0.5">
                        <p className={`text-[11px] font-bold leading-tight transition-colors duration-300 ${
                          isActive ? 'text-brand-600' : isDone ? 'text-teal-600' : 'text-surface-400 group-hover:text-surface-600'
                        }`}>{s.title}</p>
                        <p className={`text-[9px] mt-0.5 transition-colors duration-300 hidden sm:block ${
                          isActive ? 'text-brand-400' : isDone ? 'text-teal-400' : 'text-surface-300'
                        }`}>{s.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step counter pill */}
            <div className="flex justify-center mt-4">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-surface-50 to-brand-50/30 border border-surface-200/60"
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${steps[step - 1].color}`} />
                <span className="text-[11px] font-bold text-brand-600">Step {step}</span>
                <span className="text-[11px] text-surface-400 font-medium">of {steps.length}</span>
              </motion.div>
            </div>
          </div>
        </FadeInUp>

        {/* ══ AI UPLOAD CARD ════════════════════ */}
        <FadeInUp delay={0.05}>
          <div className="bg-surface-0/80 backdrop-blur-xl rounded-3xl border border-surface-200/60 dark:border-surface-200/40 shadow-card p-6 sm:p-7 mb-6 overflow-hidden relative">
            {/* Decorative gradient stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-teal-500 to-emerald-500" />

            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/20">
                <FiCpu className="w-5.5 h-5.5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-surface-900">AI-Powered Auto-Fill</h3>
                  <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-brand-50 to-teal-50 border border-brand-200/40 text-[9px] font-bold text-brand-600 uppercase tracking-widest">Beta</span>
                </div>
                <p className="text-[13px] text-surface-400 mt-1 leading-relaxed">
                  Upload a medical report, prescription, or lab result. Our AI will extract and auto-fill your medical data.
                </p>
              </div>
            </div>

            {/* Drag & drop zone */}
            <div
              ref={dropRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !aiProcessing && fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden ${
                dragOver
                  ? 'border-brand-400 bg-gradient-to-br from-brand-50/80 to-teal-50/80 scale-[1.01]'
                  : aiProcessing
                  ? 'border-surface-200 bg-surface-50/50 cursor-wait'
                  : 'border-surface-200/80 bg-surface-50/30 hover:border-brand-300 hover:bg-gradient-to-br hover:from-brand-50/30 hover:to-teal-50/30'
              }`}
            >
              <input ref={fileInputRef} type="file" className="hidden"
                accept=".pdf,image/jpeg,image/png,image/jpg" onChange={handleDocumentUpload} />

              {aiProcessing ? (
                <div className="flex flex-col items-center gap-4 py-8 px-6">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-50 to-teal-50 flex items-center justify-center">
                      <FiCpu className="w-6 h-6 text-brand-600 animate-pulse" />
                    </div>
                    <motion.div
                      className="absolute -inset-1 rounded-2xl border-2 border-brand-300/30"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-surface-800">
                      {aiStatus === 'extracting' ? 'Extracting text from document...' : 'AI is analyzing medical data...'}
                    </p>
                    <p className="text-xs text-surface-400 mt-1">This may take a few seconds</p>
                    {uploadedFileName && (
                      <p className="text-[11px] text-surface-400 mt-2 flex items-center justify-center gap-1.5">
                        <FiFile className="w-3 h-3" /> {uploadedFileName}
                      </p>
                    )}
                  </div>
                  {/* Real progress bar */}
                  <div className="w-full max-w-xs">
                    <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-brand-500 to-teal-500 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${aiProgress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="text-[10px] text-surface-400 mt-1.5 text-center font-medium">{aiProgress}% complete</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-8 px-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    dragOver
                      ? 'bg-brand-100 scale-110'
                      : 'bg-gradient-to-br from-brand-50 to-teal-50'
                  }`}>
                    <FiUploadCloud className={`w-6 h-6 transition-colors ${dragOver ? 'text-brand-600' : 'text-brand-500'}`} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-surface-700">
                      {dragOver ? 'Drop your file here' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-xs text-surface-400 mt-1.5">Supports PDF, JPG, PNG up to 10MB</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-100/80 text-[10px] font-medium text-surface-500">
                      <FiFileText className="w-3 h-3" /> PDF
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-100/80 text-[10px] font-medium text-surface-500">
                      <FiFile className="w-3 h-3" /> JPG
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-100/80 text-[10px] font-medium text-surface-500">
                      <FiFile className="w-3 h-3" /> PNG
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Status Messages */}
            <AnimatePresence>
              {aiStatus && !aiProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-5"
                >
                  <div className={`flex items-start gap-3 p-4 rounded-2xl text-[13px] font-medium ${
                    aiStatus === 'done'
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/50'
                      : 'bg-gradient-to-r from-danger-50 to-rose-50 text-danger-600 border border-danger-200/50'
                  }`}>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      aiStatus === 'done' ? 'bg-emerald-100' : 'bg-danger-100'
                    }`}>
                      {aiStatus === 'done' ? <FiCheck className="w-3.5 h-3.5" /> : <FiAlertCircle className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="leading-relaxed">{aiMessage}</span>
                      {aiStatus === 'done' && aiFilledFields.size > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {[...aiFilledFields].map(f => (
                            <span key={f} className="px-2 py-0.5 rounded-md bg-surface-0/80 border border-emerald-200/50 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                              {f.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Extracted Text Preview */}
                  {showPreview && aiExtractedText && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 p-4 rounded-2xl bg-surface-50/80 border border-surface-200/60"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-surface-500 uppercase tracking-wider flex items-center gap-1.5">
                          <FiFileText className="w-3 h-3" /> Extracted Text Preview
                        </span>
                        <button onClick={() => setShowPreview(false)} className="w-6 h-6 rounded-lg bg-surface-100 hover:bg-surface-200 text-surface-400 hover:text-surface-600 flex items-center justify-center transition-colors">
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs text-surface-600 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto font-mono bg-surface-0/60 rounded-xl p-3 border border-surface-100">
                        {aiExtractedText}{aiExtractedText.length >= 500 ? '...' : ''}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeInUp>

        {/* Success / Error banners */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="mb-5 px-5 py-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 text-sm font-semibold text-emerald-700 flex items-center gap-3 shadow-sm"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <FiCheck className="w-4 h-4" />
              </div>
              {success}
            </motion.div>
          )}
          {saveError && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="mb-5 px-5 py-4 rounded-2xl bg-gradient-to-r from-danger-50 to-rose-50 border border-danger-200/60 text-sm font-semibold text-danger-600 flex items-center gap-3 shadow-sm"
            >
              <div className="w-8 h-8 rounded-xl bg-danger-100 flex items-center justify-center flex-shrink-0">
                <FiAlertTriangle className="w-4 h-4" />
              </div>
              {saveError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ FORM STEPS ═══════════════════════ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24, scale: 0.99 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -24, scale: 0.99 }}
            transition={{ duration: 0.35, ease: easeOut }}
          >
            <div className="bg-surface-0/80 backdrop-blur-xl rounded-3xl border border-surface-200/60 dark:border-surface-200/40 shadow-card p-6 sm:p-8 relative overflow-hidden">
              {/* Top accent line matching step color */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${steps[step - 1].color}`} />

              {/* ──── Step 1: Basic Medical ──── */}
              {step === 1 && (
                <div>
                  <SectionHeader icon={FiDroplet} title="Basic Medical Information" subtitle="Blood group and known drug allergies" gradient="from-blue-500 to-indigo-600" />

                  <InputField label="Blood Group" icon={FiDroplet} className="mb-8">
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => (
                        <motion.button
                          key={bg}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setForm(prev => ({...prev, bloodGroup: bg}))}
                          className={`py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                            form.bloodGroup === bg
                              ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 ring-2 ring-brand-200'
                              : 'bg-surface-50 text-surface-600 border border-surface-200/60 hover:border-brand-300 hover:bg-brand-50/30'
                          }`}
                        >
                          {bg}
                        </motion.button>
                      ))}
                    </div>
                  </InputField>

                  <InputField label={<>Drug Allergies <AiBadge aiFilledFields={aiFilledFields} field="allergies" /></>} icon={FiAlertTriangle}>
                    <div className="space-y-2.5">
                      {form.allergies.map((a, i) => (
                        <div key={i}
                          className="flex gap-2 items-center group">
                          <input className="input flex-1" placeholder="e.g., Penicillin" value={a.name}
                            onChange={e => updateItem('allergies', i, 'name', e.target.value)} />
                          <select className="input w-36" value={a.severity} onChange={e => updateItem('allergies', i, 'severity', e.target.value)}>
                            <option value="mild">Mild</option>
                            <option value="moderate">Moderate</option>
                            <option value="severe">Severe</option>
                            <option value="life-threatening">Life-threatening</option>
                          </select>
                          {form.allergies.length > 1 && <RemoveButton onClick={() => removeItem('allergies', i)} />}
                        </div>
                      ))}
                      <AddButton onClick={() => addItem('allergies', { name: '', severity: 'mild' })} label="Add Allergy" />
                    </div>
                  </InputField>
                </div>
              )}

              {/* ──── Step 2: Medications ──── */}
              {step === 2 && (
                <div>
                  <SectionHeader icon={FiHeart} title="Medications & Conditions" subtitle="Current medications and chronic conditions" gradient="from-rose-500 to-pink-600" />

                  <InputField label={<>Current Medications <AiBadge aiFilledFields={aiFilledFields} field="currentMedications" /></>} className="mb-8">
                    <div className="space-y-2.5">
                      {form.currentMedications.map((m, i) => (
                        <div key={i}
                          className="flex gap-2 items-center">
                          <input className="input flex-1" placeholder="Medicine name" value={m.name} onChange={e => updateItem('currentMedications', i, 'name', e.target.value)} />
                          <input className="input w-24" placeholder="Dosage" value={m.dosage} onChange={e => updateItem('currentMedications', i, 'dosage', e.target.value)} />
                          <input className="input w-28 hidden sm:block" placeholder="Frequency" value={m.frequency} onChange={e => updateItem('currentMedications', i, 'frequency', e.target.value)} />
                          {form.currentMedications.length > 1 && <RemoveButton onClick={() => removeItem('currentMedications', i)} />}
                        </div>
                      ))}
                      <AddButton onClick={() => addItem('currentMedications', { name: '', dosage: '', frequency: '' })} label="Add Medication" />
                    </div>
                  </InputField>

                  <InputField label={<>Chronic Conditions <AiBadge aiFilledFields={aiFilledFields} field="chronicConditions" /></>}>
                    <div className="space-y-2.5">
                      {form.chronicConditions.map((c, i) => (
                        <div key={i}
                          className="flex gap-2 items-center">
                          <input className="input flex-1" placeholder="e.g., Diabetes" value={c.name} onChange={e => updateItem('chronicConditions', i, 'name', e.target.value)} />
                          <select className="input w-36" value={c.status} onChange={e => updateItem('chronicConditions', i, 'status', e.target.value)}>
                            <option value="controlled">Controlled</option>
                            <option value="uncontrolled">Uncontrolled</option>
                          </select>
                          {form.chronicConditions.length > 1 && <RemoveButton onClick={() => removeItem('chronicConditions', i)} />}
                        </div>
                      ))}
                      <AddButton onClick={() => addItem('chronicConditions', { name: '', status: 'controlled' })} label="Add Condition" />
                    </div>
                  </InputField>
                </div>
              )}

              {/* ──── Step 3: History ──── */}
              {step === 3 && (
                <div>
                  <SectionHeader icon={FiScissors} title="Medical History" subtitle="Past surgeries and family medical history" gradient="from-amber-500 to-orange-600" />

                  <InputField label={<>Past Surgeries <AiBadge aiFilledFields={aiFilledFields} field="pastSurgeries" /></>} className="mb-8">
                    <div className="space-y-2.5">
                      {form.pastSurgeries.map((s, i) => (
                        <div key={i}
                          className="flex gap-2 items-center">
                          <input className="input flex-1" placeholder="Surgery name" value={s.name} onChange={e => updateItem('pastSurgeries', i, 'name', e.target.value)} />
                          <input className="input w-28" placeholder="Year (2019)" value={s.year} onChange={e => updateItem('pastSurgeries', i, 'year', e.target.value)} />
                          {form.pastSurgeries.length > 1 && <RemoveButton onClick={() => removeItem('pastSurgeries', i)} />}
                        </div>
                      ))}
                      <AddButton onClick={() => addItem('pastSurgeries', { name: '', year: '' })} label="Add Surgery" />
                    </div>
                  </InputField>

                  <InputField label={<>Family Medical History <AiBadge aiFilledFields={aiFilledFields} field="familyHistory" /></>}>
                    <div className="space-y-2.5">
                      {form.familyHistory.map((f, i) => (
                        <div key={i}
                          className="flex gap-2 items-center">
                          <input className="input flex-1" placeholder="Relation (Father)" value={f.relation} onChange={e => updateItem('familyHistory', i, 'relation', e.target.value)} />
                          <input className="input flex-1" placeholder="Condition" value={f.condition} onChange={e => updateItem('familyHistory', i, 'condition', e.target.value)} />
                          {form.familyHistory.length > 1 && <RemoveButton onClick={() => removeItem('familyHistory', i)} />}
                        </div>
                      ))}
                      <AddButton onClick={() => addItem('familyHistory', { relation: '', condition: '' })} label="Add Family History" />
                    </div>
                  </InputField>
                </div>
              )}

              {/* ──── Step 4: Lifestyle ──── */}
              {step === 4 && (
                <div>
                  <SectionHeader icon={FiSun} title="Lifestyle" subtitle="Habits and lifestyle information" gradient="from-emerald-500 to-teal-600" />

                  <div className="space-y-6">
                    {/* Weight Input */}
                    <InputField label="Current Weight (kg)">
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          className="input w-40"
                          placeholder="e.g., 68"
                          value={form.currentWeight || ''}
                          min="1"
                          max="500"
                          onChange={e => setForm(prev => ({ ...prev, currentWeight: e.target.value ? Number(e.target.value) : '' }))}
                        />
                        <span className="text-xs text-surface-400 font-medium">kg</span>
                      </div>
                    </InputField>

                    {/* Smoker */}
                    <InputField label="Smoker">
                      <div className="grid grid-cols-2 gap-2">
                        {[{ val: false, label: 'No', icon: '🚭', activeBg: 'bg-emerald-50 border-emerald-300 text-emerald-700' },
                          { val: true, label: 'Yes', icon: '🚬', activeBg: 'bg-amber-50 border-amber-300 text-amber-700' }].map(opt => (
                          <button
                            key={String(opt.val)}
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, smoker: opt.val }))}
                            className={`py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 border-2 ${
                              form.smoker === opt.val
                                ? opt.activeBg + ' shadow-sm'
                                : 'bg-surface-50 border-surface-200/60 text-surface-500 hover:border-surface-300'
                            }`}
                          >
                            <span>{opt.icon}</span> {opt.label}
                          </button>
                        ))}
                      </div>
                    </InputField>

                    {/* Alcohol Use */}
                    <InputField label="Alcohol Use">
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { val: 'none', label: 'None', icon: '🚫' },
                          { val: 'occasional', label: 'Occasional', icon: '🍷' },
                          { val: 'moderate', label: 'Moderate', icon: '🍺' },
                          { val: 'heavy', label: 'Heavy', icon: '🥃' },
                        ].map(opt => (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, alcoholUse: opt.val }))}
                            className={`py-2.5 rounded-xl text-[11px] font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-1 border-2 ${
                              form.alcoholUse === opt.val
                                ? opt.val === 'none'
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                                  : opt.val === 'heavy'
                                  ? 'bg-red-50 border-red-300 text-red-700 shadow-sm'
                                  : 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
                                : 'bg-surface-50 border-surface-200/60 text-surface-500 hover:border-surface-300'
                            }`}
                          >
                            <span className="text-base">{opt.icon}</span>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </InputField>

                    {/* Exercise Frequency */}
                    <InputField label="Exercise Frequency">
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { val: 'none', label: 'None', icon: '🛋️' },
                          { val: 'light', label: '1-2x/wk', icon: '🚶' },
                          { val: 'moderate', label: '3-4x/wk', icon: '🏃' },
                          { val: 'daily', label: 'Daily', icon: '💪' },
                        ].map(opt => (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, exerciseFrequency: opt.val }))}
                            className={`py-2.5 rounded-xl text-[11px] font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-1 border-2 ${
                              form.exerciseFrequency === opt.val
                                ? opt.val === 'daily'
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                                  : opt.val === 'none'
                                  ? 'bg-red-50 border-red-300 text-red-700 shadow-sm'
                                  : 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm'
                                : 'bg-surface-50 border-surface-200/60 text-surface-500 hover:border-surface-300'
                            }`}
                          >
                            <span className="text-base">{opt.icon}</span>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </InputField>

                    {/* Diet Type */}
                    <InputField label="Diet Type">
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { val: 'veg', label: 'Vegetarian', icon: '🥗' },
                          { val: 'non-veg', label: 'Non-Veg', icon: '🍗' },
                          { val: 'vegan', label: 'Vegan', icon: '🌱' },
                          { val: 'other', label: 'Other', icon: '🍽️' },
                        ].map(opt => (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, dietType: opt.val }))}
                            className={`py-2.5 rounded-xl text-[11px] font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-1 border-2 ${
                              form.dietType === opt.val
                                ? 'bg-teal-50 border-teal-300 text-teal-700 shadow-sm'
                                : 'bg-surface-50 border-surface-200/60 text-surface-500 hover:border-surface-300'
                            }`}
                          >
                            <span className="text-base">{opt.icon}</span>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </InputField>
                  </div>
                </div>
              )}

              {/* ──── Step 5: Emergency Contacts ──── */}
              {step === 5 && (
                <div>
                  <SectionHeader icon={FiShield} title="Emergency Contacts" subtitle="People to contact in case of emergency" gradient="from-red-500 to-rose-600" />

                  {/* Mandatory notice */}
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <FiAlertCircle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Minimum 2 contacts required</p>
                      <p className="text-xs text-amber-600 mt-0.5">All fields (name, phone, relationship) must be filled for the first two contacts.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence>
                      {form.emergencyContacts.map((ec, i) => {
                        const isMandatory = i < 2;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: -12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.98 }}
                            transition={{ duration: 0.3, ease: easeOut }}
                            className={`p-5 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden ${
                              isMandatory
                                ? 'bg-surface-0 border-surface-200/80 shadow-sm hover:shadow-md'
                                : 'bg-surface-50/50 border-surface-200/50 hover:border-surface-300'
                            }`}
                          >
                            {/* Mandatory indicator stripe */}
                            {isMandatory && (
                              <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-brand-500 to-teal-500 rounded-l-2xl" />
                            )}

                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                  isMandatory
                                    ? 'bg-gradient-to-br from-brand-50 to-teal-50 border border-brand-200/50'
                                    : 'bg-surface-100 border border-surface-200/50'
                                }`}>
                                  <FiUser className={`w-4 h-4 ${isMandatory ? 'text-brand-600' : 'text-surface-400'}`} />
                                </div>
                                <div>
                                  <span className="text-sm font-bold text-surface-700">
                                    Contact {i + 1}
                                  </span>
                                  {isMandatory && (
                                    <span className="ml-2 px-1.5 py-0.5 rounded-md bg-danger-50 text-[9px] font-bold text-danger-500 uppercase tracking-wider">Required</span>
                                  )}
                                </div>
                              </div>
                              {!isMandatory && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeItem('emergencyContacts', i)}
                                  className="w-8 h-8 rounded-xl bg-danger-50 text-danger-400 hover:text-white hover:bg-danger-500 flex items-center justify-center transition-all duration-200"
                                >
                                  <FiTrash2 className="w-3.5 h-3.5" />
                                </motion.button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="text-[11px] font-semibold text-surface-500 mb-1.5 block">Full Name</label>
                                <input
                                  className={`input ${contactErrors[`${i}-name`] ? 'border-danger-300 focus:border-danger-400 focus:ring-danger-50 bg-danger-50/20' : ''}`}
                                  placeholder="John Doe"
                                  value={ec.name}
                                  onChange={e => updateItem('emergencyContacts', i, 'name', e.target.value)}
                                />
                                <ErrorMsg error={contactErrors[`${i}-name`]} />
                              </div>
                              <div>
                                <label className="text-[11px] font-semibold text-surface-500 mb-1.5 block">Phone Number</label>
                                <input
                                  className={`input ${contactErrors[`${i}-phone`] ? 'border-danger-300 focus:border-danger-400 focus:ring-danger-50 bg-danger-50/20' : ''}`}
                                  placeholder="9876543210"
                                  value={ec.phone}
                                  maxLength={10}
                                  inputMode="numeric"
                                  onChange={e => updateItem('emergencyContacts', i, 'phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                />
                                <ErrorMsg error={contactErrors[`${i}-phone`]} />
                              </div>
                              <div>
                                <label className="text-[11px] font-semibold text-surface-500 mb-1.5 block">Relationship</label>
                                <input
                                  className={`input ${contactErrors[`${i}-relationship`] ? 'border-danger-300 focus:border-danger-400 focus:ring-danger-50 bg-danger-50/20' : ''}`}
                                  placeholder="e.g., Spouse"
                                  value={ec.relationship}
                                  onChange={e => updateItem('emergencyContacts', i, 'relationship', e.target.value)}
                                />
                                <ErrorMsg error={contactErrors[`${i}-relationship`]} />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {form.emergencyContacts.length < 5 && (
                    <div className="mt-4">
                      <AddButton
                        onClick={() => addItem('emergencyContacts', { name: '', phone: '', relationship: '' })}
                        label="Add Another Contact"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ══ NAVIGATION ═══════════════════ */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-surface-100/80">
                <motion.button
                  whileHover={step > 1 ? { x: -3 } : {}}
                  whileTap={step > 1 ? { scale: 0.97 } : {}}
                  onClick={() => setStep(s => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-surface-500 hover:text-surface-700 hover:bg-surface-100 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FiArrowLeft className="w-4 h-4" /> Previous
                </motion.button>

                {step < 5 ? (
                  <motion.button
                    whileHover={{ scale: 1.02, x: 3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStep(s => s + 1)}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30 transition-all duration-300"
                  >
                    Continue <FiArrowRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSave}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-[15px] font-bold text-white bg-gradient-to-r from-brand-600 via-teal-600 to-emerald-600 hover:from-brand-700 hover:via-teal-700 hover:to-emerald-700 shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2"><FiLoader className="w-4 h-4 animate-spin" /> Saving...</span>
                    ) : (
                      <span className="flex items-center gap-2"><FiCheck className="w-4.5 h-4.5" /> Save Medical Profile</span>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
};

export default MedicalProfileForm;
