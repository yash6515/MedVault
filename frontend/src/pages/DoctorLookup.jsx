import { useState, useEffect, useRef, useCallback } from 'react';
import { verifyPatient, emergencyAccess } from '../services/api';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeInUp } from '../components/ui/Motion';
import PatientSummary from './PatientSummary';
import { 
  FiSearch, FiCamera, FiAlertTriangle, FiArrowRight,
  FiShield, FiCheck, FiLoader
} from 'react-icons/fi';
import { easeOut } from 'framer-motion';

const DoctorLookup = () => {
  const [healthId, setHealthId] = useState('');
  const [pin, setPin] = useState('');
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('manual');
  const [scanned, setScanned] = useState(false);
  const scannerRef = useRef(null);
  const scannerInitRef = useRef(false);

  const cleanupScanner = useCallback(() => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch (e) { /* ignore */ }
      scannerRef.current = null;
      scannerInitRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (mode === 'scan' && !scannerInitRef.current) {
      const timeout = setTimeout(() => {
        const container = document.getElementById('qr-reader');
        if (!container || scannerInitRef.current) return;

        scannerInitRef.current = true;
        const scanner = new Html5QrcodeScanner('qr-reader', {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
        });

        scanner.render(
          (decodedText) => {
            setHealthId(decodedText);
            setScanned(true);
            cleanupScanner();
            setMode('manual');
          },
          () => { /* scan error — ignore, keep scanning */ }
        );

        scannerRef.current = scanner;
      }, 300);

      return () => clearTimeout(timeout);
    }

    if (mode !== 'scan') {
      cleanupScanner();
    }
  }, [mode, cleanupScanner]);

  useEffect(() => {
    return () => cleanupScanner();
  }, [cleanupScanner]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await verifyPatient({ healthId, pin });
      setPatient(data);
    } catch (err) { setError(err.response?.data?.message || 'Verification failed'); }
    setLoading(false);
  };

  const handleEmergency = async () => {
    if (!healthId) { setError('Please enter Health ID'); return; }
    setError(''); setLoading(true);
    try {
      const { data } = await emergencyAccess({ healthId });
      setPatient(data);
    } catch (err) { setError(err.response?.data?.message || 'Emergency access failed'); }
    setLoading(false);
  };

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    cleanupScanner();
    setScanned(false);
    setError('');
    setMode(newMode);
  };

  const tabs = [
    { id: 'manual', label: 'Health ID', icon: FiSearch },
    { id: 'scan', label: 'Scan QR', icon: FiCamera },
    { id: 'emergency', label: 'Emergency', icon: FiAlertTriangle },
  ];

  if (patient) {
    return <PatientSummary patient={patient} healthId={healthId} onBack={() => { setPatient(null); setPin(''); setScanned(false); }} />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl" />
      </div>

      <FadeInUp>
        <div className="w-full max-w-md relative">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: easeOut }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-brand-500/20"
            >
              <FiSearch className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-surface-950 tracking-tight">Patient Lookup</h1>
            <p className="text-sm text-surface-500 mt-2">Scan QR code or enter Health ID to access records</p>
          </div>

          {/* Main card */}
          <div className="glass-panel overflow-hidden shadow-elevated rounded-[32px] p-1.5 relative">
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-brand-600 via-teal-500 to-emerald-500" />
            
            <div className="p-6 sm:p-8">
              {/* Tabs */}
              <div className="flex p-1.5 bg-surface-100 rounded-[20px] mb-8 gap-1.5 shadow-inner-soft">
                {tabs.map(tab => (
                  <motion.button
                    key={tab.id}
                    onClick={() => switchMode(tab.id)}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[14px] text-sm font-bold transition-all duration-300 ${
                      mode === tab.id
                        ? 'bg-white text-surface-950 shadow-md ring-1 ring-surface-200/50'
                        : 'text-surface-400 hover:text-surface-700 hover:bg-white/50'
                    }`}
                  >
                    <tab.icon className={`w-4 h-4 ${mode === tab.id ? 'text-brand-600' : ''}`} /> 
                    <span className="hidden sm:inline">{tab.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="mb-5 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 text-sm font-semibold text-red-600 flex items-center gap-2"
                  >
                    <FiAlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content by mode */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: easeOut }}
                >
                  {/* Scan QR */}
                  {mode === 'scan' && (
                    <div>
                      <div className="rounded-2xl overflow-hidden bg-surface-900/5 min-h-[280px] border border-surface-200/60">
                        <div id="qr-reader" style={{ width: '100%' }} />
                      </div>
                      <p className="text-xs text-surface-400 text-center mt-4 flex items-center justify-center gap-1.5">
                        <FiCamera className="w-3.5 h-3.5" /> Point your camera at the patient's QR code
                      </p>
                    </div>
                  )}

                  {/* Manual Entry */}
                  {mode === 'manual' && (
                    <div>
                      {scanned && healthId && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-5 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 text-sm font-semibold text-emerald-700 flex items-center gap-2"
                        >
                          <FiCheck className="w-4 h-4" /> QR scanned! Health ID detected.
                        </motion.div>
                      )}
                      <form onSubmit={handleVerify} className="space-y-5">
                        <div>
                          <label className="text-[13px] font-semibold text-surface-600 mb-2 block">Health ID</label>
                          <div className="relative">
                            <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                            <input className="input pl-10 font-mono tracking-wider" value={healthId} onChange={e => setHealthId(e.target.value)} required placeholder="MV-XXXX-XXXX" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[13px] font-semibold text-surface-600 mb-2 block">Patient's 4-Digit PIN</label>
                          <input
                            className="input max-w-[180px] text-center text-lg font-bold tracking-[0.5em]"
                            type="password"
                            value={pin}
                            onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            required
                            maxLength={4}
                            inputMode="numeric"
                            placeholder="****"
                          />
                        </div>
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          disabled={loading}
                          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {loading ? <><FiLoader className="w-4 h-4 animate-spin" /> Verifying...</> : <>Access Records <FiArrowRight className="w-4 h-4" /></>}
                        </motion.button>
                      </form>
                    </div>
                  )}

                  {/* Emergency */}
                  {mode === 'emergency' && (
                    <div className="space-y-5">
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60">
                        <div className="flex items-start gap-2.5">
                          <FiAlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-amber-800">Emergency Mode</p>
                            <p className="text-[11px] text-amber-600 mt-0.5 leading-relaxed">
                              Limited data only: allergies, blood group, and medications. Full access requires patient PIN.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-[13px] font-semibold text-surface-600 mb-2 block">Health ID</label>
                        <div className="relative">
                          <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                          <input className="input pl-10 font-mono tracking-wider" value={healthId} onChange={e => setHealthId(e.target.value)} placeholder="MV-XXXX-XXXX" />
                        </div>
                      </div>
                      <motion.button
                        onClick={handleEmergency}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        disabled={loading}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-bold shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? <><FiLoader className="w-4 h-4 animate-spin" /> Accessing...</> : <>Emergency Access (Limited)</>}
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Security note */}
          <p className="text-center text-[11px] text-surface-400 mt-5 flex items-center justify-center gap-1.5">
            <FiShield className="w-3 h-3 text-brand-500" /> All access is logged and audited
          </p>
        </div>
      </FadeInUp>
    </div>
  );
};

export default DoctorLookup;
