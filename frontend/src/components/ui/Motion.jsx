import { motion } from 'framer-motion';

const ease = [0.25, 0.46, 0.45, 0.94];

export const FadeIn = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease }}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeInUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease }}
    className={className}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay, ease }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ children, className = '' }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      visible: { transition: { staggerChildren: 0.08 } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const PageTransition = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const AnimCount = ({ value, duration = 2 }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {value}
    </motion.span>
  );
};
