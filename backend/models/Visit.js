const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
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
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visit', visitSchema);
