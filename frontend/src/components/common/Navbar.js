import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FiLogOut, FiGrid, FiMaximize2, FiCpu, FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`relative px-3.5 py-2 text-[13px] font-medium rounded-xl transition-all duration-200 ${
        isActive(to)
          ? 'text-brand-700 bg-brand-50'
          : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-surface-200/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-4-4l4 4 4-4M9 8h6" />
              </svg>
            </div>
            <span className="text-[17px] font-bold tracking-tight text-surface-900">
              Med<span className="text-brand-600">Vault</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {!user ? (
              <>
                <NavLink to="/patient/register">Create Health ID</NavLink>
                <NavLink to="/doctor/login">For Doctors</NavLink>
                <div className="w-px h-5 bg-surface-200 mx-2" />
                <Link to="/patient/login" className="btn-primary btn-sm">
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
                <div className="w-px h-5 bg-surface-200 mx-2" />
                <button onClick={handleLogout} className="btn-ghost btn-sm text-surface-500">
                  <FiLogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/doctor/lookup">
                  <span className="flex items-center gap-1.5"><FiSearch className="w-3.5 h-3.5" /> Patient Lookup</span>
                </NavLink>
                <div className="w-px h-5 bg-surface-200 mx-2" />
                <button onClick={handleLogout} className="btn-ghost btn-sm text-surface-500">
                  <FiLogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
