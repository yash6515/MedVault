import { motion } from 'framer-motion';

const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: { box: 'w-8 h-8', cross: 'w-3.5 h-3.5', text: 'text-[15px]' },
    md: { box: 'w-10 h-10', cross: 'w-4.5 h-4.5', text: 'text-[17px]' },
    lg: { box: 'w-14 h-14', cross: 'w-6 h-6', text: 'text-xl' },
    xl: { box: 'w-20 h-20', cross: 'w-9 h-9', text: 'text-2xl' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05, rotateY: 10 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className={`${s.box} relative rounded-2xl overflow-hidden flex items-center justify-center`}
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)',
          boxShadow: '0 8px 24px -4px rgba(37,99,235,0.3), 0 2px 8px -2px rgba(20,184,166,0.2), inset 0 1px 1px rgba(255,255,255,0.2)',
        }}
      >
        {/* Inner shine */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
        {/* Medical cross + vault */}
        <svg className={`${s.cross} text-white relative z-10`} viewBox="0 0 24 24" fill="none">
          {/* Cross */}
          <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3z" fill="currentColor" opacity="0.95" />
          {/* Shield outline */}
          <path d="M12 2L3 6v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
        </svg>
        {/* Bottom shadow for 3D effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/15 to-transparent" />
      </motion.div>

      {showText && (
        <span className={`${s.text} font-extrabold tracking-tight text-surface-900`}>
          Med<span className="text-brand-600">Vault</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
