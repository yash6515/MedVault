const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const AccessLog = require('../models/AccessLog');
const Visit = require('../models/Visit');
const { doctorAuth } = require('../middleware/auth');

// Register doctor
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, phone, hospitalName, registrationNumber, specialization } = req.body;

    const existing = await Doctor.findOne({ $or: [{ email }, { registrationNumber }] });
    if (existing) return res.status(400).json({ message: 'Doctor already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new Doctor({
      fullName, email, password: hashedPassword, phone,
      hospitalName, registrationNumber, specialization
    });

    await doctor.save();

    const token = jwt.sign(
      { id: doctor._id, role: 'doctor' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      doctor: { id: doctor._id, fullName: doctor.fullName, hospitalName: doctor.hospitalName }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login doctor
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: doctor._id, role: 'doctor' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      doctor: { id: doctor._id, fullName: doctor.fullName, hospitalName: doctor.hospitalName }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Verify patient PIN and access records
router.post('/verify-patient', doctorAuth, async (req, res) => {
  try {
    const { healthId, pin } = req.body;
    const patient = await Patient.findOne({ healthId }).select('-password');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const isMatch = await bcrypt.compare(pin, patient.pin);
    if (!isMatch) return res.status(400).json({ message: 'Invalid PIN' });

    const doctor = await Doctor.findById(req.user.id);

    // Log access
    await new AccessLog({
      patientId: patient._id,
      doctorId: doctor._id,
      doctorName: doctor.fullName,
      hospitalName: doctor.hospitalName,
      accessType: 'full',
      actionsPerformed: ['Viewed full medical record']
    }).save();

    const visits = await Visit.find({ patientId: patient._id }).sort({ timestamp: -1 });

    const patientData = patient.toObject();
    delete patientData.pin;
    patientData.visits = visits;

    res.json(patientData);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Emergency access (limited data)
router.post('/emergency-access', doctorAuth, async (req, res) => {
  try {
    const { healthId } = req.body;
    const patient = await Patient.findOne({ healthId });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const doctor = await Doctor.findById(req.user.id);

    await new AccessLog({
      patientId: patient._id,
      doctorId: doctor._id,
      doctorName: doctor.fullName,
      hospitalName: doctor.hospitalName,
      accessType: 'emergency',
      actionsPerformed: ['Emergency access - limited data']
    }).save();

    res.json({
      fullName: patient.fullName,
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies,
      currentMedications: patient.currentMedications,
      emergencyContacts: patient.emergencyContacts,
      _accessType: 'emergency'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add visit/prescription
router.post('/add-visit', doctorAuth, async (req, res) => {
  try {
    const { patientHealthId, diagnosis, prescriptions, notes, followUpDate, labRecommendations } = req.body;
    const patient = await Patient.findOne({ healthId: patientHealthId });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const doctor = await Doctor.findById(req.user.id);

    const visit = new Visit({
      patientId: patient._id,
      doctorId: doctor._id,
      doctorName: doctor.fullName,
      hospitalName: doctor.hospitalName,
      diagnosis, prescriptions, notes, followUpDate, labRecommendations
    });

    await visit.save();

    await new AccessLog({
      patientId: patient._id,
      doctorId: doctor._id,
      doctorName: doctor.fullName,
      hospitalName: doctor.hospitalName,
      accessType: 'full',
      actionsPerformed: ['Added prescription/visit notes']
    }).save();

    res.json({ message: 'Visit recorded successfully', visit });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
