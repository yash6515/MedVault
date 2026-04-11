const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Visit = require('../models/Visit');
const AccessLog = require('../models/AccessLog');
const { authMiddleware } = require('../middleware/auth');

// Get complete medical history for PDF export
router.get('/export/:patientId', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId).select('-password -pin');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    if (req.user.id !== req.params.patientId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const visits = await Visit.find({ patientId: patient._id }).sort({ timestamp: -1 });
    const logs = await AccessLog.find({ patientId: patient._id }).sort({ timestamp: -1 });

    res.json({ patient, visits, accessLogs: logs });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
