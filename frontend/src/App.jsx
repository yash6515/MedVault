// Medlife Application
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/common/Navbar';
import LandingPage from './pages/LandingPage';
import PatientRegister from './pages/PatientRegister';
import PatientLogin from './pages/PatientLogin';
import PatientDashboard from './pages/PatientDashboard';
import MedicalProfileForm from './pages/MedicalProfileForm';
import QRPage from './pages/QRPage';
import AIPredictions from './pages/AIPredictions';
import DoctorRegister from './pages/DoctorRegister';
import DoctorLogin from './pages/DoctorLogin';
import DoctorLookup from './pages/DoctorLookup';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/patient/register" element={<PatientRegister />} />
              <Route path="/patient/login" element={<PatientLogin />} />
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/medical-profile" element={<MedicalProfileForm />} />
              <Route path="/patient/qr" element={<QRPage />} />
              <Route path="/patient/predictions" element={<AIPredictions />} />
              <Route path="/doctor/register" element={<DoctorRegister />} />
              <Route path="/doctor/login" element={<DoctorLogin />} />
              <Route path="/doctor/lookup" element={<DoctorLookup />} />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
