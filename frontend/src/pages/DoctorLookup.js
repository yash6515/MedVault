import { useState, useEffect, useRef, useCallback } from 'react';
import { verifyPatient, emergencyAccess } from '../services/api';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion } from 'framer-motion';
import { FadeInUp } from '../components/ui/Motion';
import PatientSummary from './PatientSummary';
import { FiSearch, FiCamera, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';

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
      // Small delay to let the DOM render the #qr-reader div
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

    // Cleanup when leaving scan mode
    if (mode !== 'scan') {
      cleanupScanner();
    }
  }, [mode, cleanupScanner]);

  // Cleanup on unmount
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

  if (patient) {
    return <PatientSummary patient={patient} healthId={healthId} onBack={() => { setPatient(null); setPin(''); setScanned(false); }} />;
  }

  const tabs = [
    { id: 'manual', label: 'Health ID', icon: FiSearch },
    { id: 'scan', label: 'Scan QR', icon: FiCamera },
    { id: 'emergency', label: 'Emergency', icon: FiAlertTriangle },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center px-4 py-12">
      <FadeInUp>
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-xl font-extrabold text-surface-950">Patient Lookup</h1>
            <p className="text-sm text-surface-500 mt-1">Scan QR code or enter Health ID to access records</p>
          </div>

          <div className="card p-6">
            {/* Tabs */}
            <div className="flex p-1 bg-surface-100 rounded-xl mb-6">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => switchMode(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    mode === tab.id ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'
                  }`}>
                  <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              ))}
            </div>

            {error && (
              <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
                className="mb-4 px-4 py-3 rounded-xl bg-danger-50 border border-danger-200 text-sm font-medium text-danger-600">
                {error}
              </motion.div>
            )}

            {/* Scan QR Mode */}
            {mode === 'scan' && (
              <div>
                <div className="rounded-2xl overflow-hidden bg-black/5 min-h-[280px]">
                  <div id="qr-reader" style={{width: '100%'}} />
                </div>
                <p className="text-xs text-surface-400 text-center mt-3">
                  Point your camera at the patient's QR code
                </p>
              </div>
            )}

            {/* Manual Entry Mode (also shown after successful scan) */}
            {mode === 'manual' && (
              <div>
                {scanned && healthId && (
                  <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-medium text-emerald-700">
                    QR scanned successfully! Health ID detected.
                  </div>
                )}
                <form onSubmit={handleVerify} className="space-y-4">
                  <div>
                    <label className="label">Health ID</label>
                    <input className="input font-mono" value={healthId} onChange={e => setHealthId(e.target.value)} required placeholder="MV-XXXX-XXXX" />
                  </div>
                  <div>
                    <label className="label">Patient's 4-Digit PIN</label>
                    <input className="input max-w-[160px]" type="password" value={pin} onChange={e => setPin(e.target.value)} required maxLength={4} placeholder="****" />
                  </div>
                  <button type="submit" className="btn-primary btn-lg w-full" disabled={loading}>
                    {loading ? 'Verifying...' : <span className="flex items-center gap-2">Access Records <FiArrowRight /></span>}
                  </button>
                </form>
              </div>
            )}

            {/* Emergency Mode */}
            {mode === 'emergency' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-xs text-amber-700 leading-relaxed">
                  <span className="font-bold">Emergency mode</span> provides limited data only: allergies, blood group, and current medications. Full access requires patient PIN.
                </div>
                <div>
                  <label className="label">Health ID</label>
                  <input className="input font-mono" value={healthId} onChange={e => setHealthId(e.target.value)} placeholder="MV-XXXX-XXXX" />
                </div>
                <button onClick={handleEmergency} disabled={loading} className="btn-danger btn-lg w-full">
                  {loading ? 'Accessing...' : 'Emergency Access (Limited)'}
                </button>
              </div>
            )}
          </div>
        </div>
      </FadeInUp>
    </div>
  );
};

export default DoctorLookup;
