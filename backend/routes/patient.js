const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const Patient = require('../models/Patient');
const AccessLog = require('../models/AccessLog');
const Visit = require('../models/Visit');
const generateHealthId = require('../config/generateHealthId');
const { authMiddleware } = require('../middleware/auth');

// Register patient
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password, pin, dateOfBirth, gender, address } = req.body;

    const existing = await Patient.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    let healthId;
    let idExists = true;
    while (idExists) {
      healthId = generateHealthId();
      idExists = await Patient.findOne({ healthId });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pin, 10);

    const qrCode = await QRCode.toDataURL(healthId);

    const patient = new Patient({
      healthId,
      fullName,
      email,
      phone,
      password: hashedPassword,
      pin: hashedPin,
      dateOfBirth,
      gender,
      address,
      qrCode
    });

    await patient.save();

    const token = jwt.sign(
      { id: patient._id, role: 'patient', healthId: patient.healthId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      patient: {
        id: patient._id,
        healthId: patient.healthId,
        fullName: patient.fullName,
        email: patient.email,
        qrCode: patient.qrCode
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login patient
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: patient._id, role: 'patient', healthId: patient.healthId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      patient: {
        id: patient._id,
        healthId: patient.healthId,
        fullName: patient.fullName,
        email: patient.email,
        qrCode: patient.qrCode
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get patient profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select('-password -pin');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update medical profile
router.put('/profile/medical', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.pin;
    delete updates.healthId;
    delete updates.email;

    const patient = await Patient.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password -pin');
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Upload lab report
router.post('/lab-report', authMiddleware, async (req, res) => {
  try {
    const { title, fileData, fileType } = req.body;
    const patient = await Patient.findById(req.user.id);
    patient.labReports.push({ title, fileData, fileType, date: new Date() });
    await patient.save();
    res.json({ message: 'Lab report uploaded', labReports: patient.labReports });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get access logs
router.get('/access-logs', authMiddleware, async (req, res) => {
  try {
    const logs = await AccessLog.find({ patientId: req.user.id }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get visits
router.get('/visits', authMiddleware, async (req, res) => {
  try {
    const visits = await Visit.find({ patientId: req.user.id }).sort({ timestamp: -1 });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Change PIN
router.put('/change-pin', authMiddleware, async (req, res) => {
  try {
    const { currentPin, newPin } = req.body;
    const patient = await Patient.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPin, patient.pin);
    if (!isMatch) return res.status(400).json({ message: 'Current PIN is incorrect' });

    patient.pin = await bcrypt.hash(newPin, 10);
    await patient.save();
    res.json({ message: 'PIN changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
