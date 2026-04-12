import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import Logo from '../ui/Logo';
import { FiLogOut, FiGrid, FiMaximize2, FiCpu, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

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
          ? 'text-brand-700 bg-brand-50'
          : 'text-surface-500 hover:text-surface-800 hover:bg-surface-50'
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
          <button onClick={handleLogout} className="btn-ghost btn-sm text-surface-400 hover:text-surface-600">
            <FiLogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/doctor/lookup">
            <span className="flex items-center gap-1.5"><FiSearch className="w-3.5 h-3.5" /> Patient Lookup</span>
          </NavLink>
          <div className="w-px h-5 bg-surface-200 mx-1 hidden sm:block" />
          <button onClick={handleLogout} className="btn-ghost btn-sm text-surface-400 hover:text-surface-600">
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
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Logo size="sm" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {navContent}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden btn-icon"
          >
            {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sm:hidden border-t border-surface-100 bg-white px-4 py-3 space-y-1"
        >
          {navContent}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
