import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo';
import { FiLogOut, FiGrid, FiMaximize2, FiCpu, FiSearch, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useState } from 'react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl
                 text-surface-500 hover:text-surface-800 hover:bg-surface-100
                 transition-all duration-200"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex"
        >
          {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={() => { setMobileOpen(false); onClick?.(); }}
      className={`relative px-4 py-2 text-[13px] font-medium rounded-xl transition-all duration-200 ${
        isActive(to)
          ? 'text-brand-700 bg-brand-50 dark:text-brand-300 dark:bg-brand-500/10'
          : 'text-surface-500 hover:text-surface-800 hover:bg-surface-100'
      }`}
    >
      {children}
    </Link>
  );

  const navContent = (
    <>
      {!user ? (
        <>
          <NavLink to="/patient/register">Create Health ID</NavLink>
          <NavLink to="/doctor/login">For Doctors</NavLink>
          <div className="w-px h-5 bg-surface-200 mx-1 hidden sm:block" />
          <Link to="/patient/login" className="btn-primary btn-sm" onClick={() => setMobileOpen(false)}>
            Sign In
          </Link>
        </>
      ) : role === 'patient' ? (
        <>
          <NavLink to="/patient/dashboard">
            <span className="flex items-center gap-1.5"><FiGrid className="w-3.5 h-3.5" /> Dashboard</span>
          </NavLink>
          <NavLink to="/patient/qr">
            <span className="flex items-center gap-1.5"><FiMaximize2 className="w-3.5 h-3.5" /> QR Code</span>
          </NavLink>
          <NavLink to="/patient/predictions">
            <span className="flex items-center gap-1.5"><FiCpu className="w-3.5 h-3.5" /> AI Insights</span>
          </NavLink>
          <div className="w-px h-5 bg-surface-200 mx-1 hidden sm:block" />
          <button onClick={handleLogout} className="btn-ghost btn-sm text-surface-500 hover:text-surface-800">
            <FiLogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/doctor/lookup">
            <span className="flex items-center gap-1.5"><FiSearch className="w-3.5 h-3.5" /> Patient Lookup</span>
          </NavLink>
          <div className="w-px h-5 bg-surface-200 mx-1 hidden sm:block" />
          <button onClick={handleLogout} className="btn-ghost btn-sm text-surface-500 hover:text-surface-800">
            <FiLogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </>
      )}
    </>
  );

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-surface-0/80 backdrop-blur-xl border-b border-surface-200/60
                 dark:bg-surface-50/80 dark:border-surface-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Logo size="sm" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {navContent}
            <div className="w-px h-5 bg-surface-200 mx-1" />
            <ThemeToggle />
          </div>

          {/* Mobile controls */}
          <div className="sm:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn-icon"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sm:hidden border-t border-surface-200/60 bg-surface-0 px-4 py-3 space-y-1
                     dark:bg-surface-50 dark:border-surface-200/50"
        >
          {navContent}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
