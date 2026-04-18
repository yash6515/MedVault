import { useState, useEffect } from 'react';
import { getPatientProfile } from '../services/api';
import { FadeInUp } from '../components/ui/Motion';
import { ProfileSkeleton } from '../components/ui/Skeleton';
import { FiDownload, FiPrinter, FiInfo } from 'react-icons/fi';

const QRPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const { data } = await getPatientProfile(); setProfile(data); } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, []);

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = `MedVault_QR_${profile.healthId}.png`;
    link.href = profile.qrCode;
    link.click();
  };

  const printQR = () => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>MedVault QR - ${profile.healthId}</title>
      <style>*{margin:0;padding:0;box-sizing:border-box}body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:Inter,system-ui,sans-serif;background:#fff}
      .card{padding:40px;text-align:center;border:2px solid #eee;border-radius:20px;max-width:360px}
      img{max-width:220px;margin:20px 0}h2{color:#2450e6;font-size:18px;margin-bottom:4px}
      .id{font-family:monospace;font-size:20px;font-weight:bold;color:#1a1f2e;margin:8px 0}
      .name{color:#6b7280;font-size:14px}.note{font-size:11px;color:#9ca3af;margin-top:20px}</style></head>
      <body><div class="card"><h2>MedVault</h2><p class="name">${profile.fullName}</p>
      <img src="${profile.qrCode}" /><p class="id">${profile.healthId}</p>
      <p class="note">Scan this QR code to access medical records</p></div>
      <script>setTimeout(()=>window.print(),500)</script></body></html>`);
  };

  if (loading) return <div className="max-w-md mx-auto px-4 py-12"><ProfileSkeleton /></div>;

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <FadeInUp>
        <div className="w-full max-w-sm">
          <div className="card p-8 text-center">
            {/* QR Display */}
            <div className="mb-6">
              <div className="inline-block p-4 rounded-2xl bg-surface-0 border-2 border-brand-100 shadow-soft">
                {profile?.qrCode && (
                  <img src={profile.qrCode} alt="Health QR Code" className="w-48 h-48" />
                )}
              </div>
            </div>

            {/* Info */}
            <h2 className="text-lg font-bold text-surface-900">{profile?.fullName}</h2>
            <p className="text-xl font-mono font-bold text-brand-600 mt-1">{profile?.healthId}</p>
            <p className="text-xs text-surface-400 mt-1">{profile?.email}</p>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button onClick={downloadQR} className="btn-primary flex-1">
                <FiDownload className="w-4 h-4" /> Download
              </button>
              <button onClick={printQR} className="btn-outline flex-1">
                <FiPrinter className="w-4 h-4" /> Print Card
              </button>
            </div>
          </div>

          {/* Note */}
          <div className="mt-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200/60 flex gap-3">
            <FiInfo className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              <span className="font-semibold">Security note:</span> Your QR code only contains your Health ID.
              No medical data is stored in the QR code — all data stays encrypted on our servers
              and requires PIN verification to access.
            </p>
          </div>
        </div>
      </FadeInUp>
    </div>
  );
};

export default QRPage;
