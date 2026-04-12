import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Patient APIs
export const registerPatient = (data) => API.post('/patients/register', data);
export const loginPatient = (data) => API.post('/patients/login', data);
export const getPatientProfile = () => API.get('/patients/profile');
export const updateMedicalProfile = (data) => API.put('/patients/profile/medical', data);
export const uploadLabReport = (data) => API.post('/patients/lab-report', data);
export const getAccessLogs = () => API.get('/patients/access-logs');
export const getVisits = () => API.get('/patients/visits');
export const changePin = (data) => API.put('/patients/change-pin', data);
export const addSelfVisit = (data) => API.post('/patients/self-visit', data);
export const uploadProfilePicture = (data) => API.put('/patients/profile-picture', data);
export const extractMedicalData = (data) => API.post('/ai/extract-medical', data);
export const parseDocument = (data) => API.post('/ai/parse-document', data);

// Doctor APIs
export const registerDoctor = (data) => API.post('/doctors/register', data);
export const loginDoctor = (data) => API.post('/doctors/login', data);
export const verifyPatient = (data) => API.post('/doctors/verify-patient', data);
export const emergencyAccess = (data) => API.post('/doctors/emergency-access', data);
export const addVisit = (data) => API.post('/doctors/add-visit', data);

// Records
export const exportRecords = (patientId) => API.get(`/records/export/${patientId}`);

// AI
export const getAIPredictions = (forceRefresh = false) => API.post('/ai/predict', { forceRefresh });

export default API;
