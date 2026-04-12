const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  doctorName: String,
  hospitalName: String,
  diagnosis: String,
  prescriptions: [{
    medicine: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  notes: String,
  followUpDate: Date,
  labRecommendations: [String],
  selfReported: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visit', visitSchema);
