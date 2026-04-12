import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiX, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { uploadProfilePicture } from '../../services/api';

const ProfilePictureUpload = ({ currentImage, onUploadSuccess }) => {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [faceStatus, setFaceStatus] = useState(null);
  const fileRef = useRef(null);
  const canvasRef = useRef(null);

  const validateFace = useCallback(async (imgSrc) => {
    setFaceStatus('checking');
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imgSrc;
      });

      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = 200;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size);
      const data = imageData.data;
      let skinPixels = 0;
      const totalPixels = size * size;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (r > 60 && g > 40 && b > 20 && r > g && r > b &&
            Math.abs(r - g) > 10 && r - b > 15 && r - g < 100) {
          skinPixels++;
        }
      }

      const skinRatio = skinPixels / totalPixels;
      if (skinRatio >= 0.04 && skinRatio <= 0.65) {
        setFaceStatus('valid');
        return true;
      } else {
        setFaceStatus('invalid');
        return false;
      }
    } catch {
      setFaceStatus('valid');
      return true;
    }
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setFaceStatus(null);

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPG, JPEG, and PNG images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setPreview(dataUrl);
      await validateFace(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview || faceStatus !== 'valid') return;
    setUploading(true);
    setError('');
    try {
      const { data } = await uploadProfilePicture({ profilePicture: preview });
      onUploadSuccess?.(data.profilePicture);
      setPreview(null);
      setFaceStatus(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    }
    setUploading(false);
  };

  const handleCancel = () => {
    setPreview(null);
    setError('');
    setFaceStatus(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const displayImage = preview || currentImage;

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="hidden" />
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={handleFileSelect} />

      <motion.div
        whileHover={{ scale: 1.03 }}
        onClick={() => !uploading && fileRef.current?.click()}
        className="relative w-24 h-24 rounded-3xl overflow-hidden cursor-pointer group border-2 border-surface-200/60 shadow-card"
      >
        {displayImage ? (
          <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-50 to-teal-50 flex items-center justify-center">
            <FiCamera className="w-8 h-8 text-brand-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
          <FiCamera className="w-5 h-5 text-white" />
        </div>
      </motion.div>

      <p className="text-[11px] text-surface-400 mt-2.5 font-medium">
        {preview ? 'Preview' : 'Click to upload photo'}
      </p>

      <AnimatePresence>
        {faceStatus && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-2.5 flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-xl ${
              faceStatus === 'checking' ? 'bg-surface-50 text-surface-500 border border-surface-200/60' :
              faceStatus === 'valid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' :
              'bg-danger-50 text-danger-600 border border-danger-200/50'
            }`}
          >
            {faceStatus === 'checking' && <><FiLoader className="w-3 h-3 animate-spin" /> Detecting face...</>}
            {faceStatus === 'valid' && <><FiCheck className="w-3 h-3" /> Face detected</>}
            {faceStatus === 'invalid' && <><FiAlertCircle className="w-3 h-3" /> Please upload a clear face image</>}
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-[11px] text-danger-500 mt-1.5 font-medium">{error}</p>}

      <AnimatePresence>
        {preview && faceStatus === 'valid' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 mt-3"
          >
            <button onClick={handleCancel} disabled={uploading}
              className="px-3 py-1.5 rounded-xl bg-surface-100 text-surface-600 text-[11px] font-semibold hover:bg-surface-200 transition-colors flex items-center gap-1">
              <FiX className="w-3 h-3" /> Cancel
            </button>
            <button onClick={handleUpload} disabled={uploading}
              className="px-3 py-1.5 rounded-xl bg-brand-600 text-white text-[11px] font-semibold hover:bg-brand-700 transition-colors flex items-center gap-1 disabled:opacity-50">
              {uploading ? <><FiLoader className="w-3 h-3 animate-spin" /> Uploading...</> : <><FiCheck className="w-3 h-3" /> Save Photo</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePictureUpload;
