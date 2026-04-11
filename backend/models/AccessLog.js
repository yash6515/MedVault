const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: String,
  hospitalName: String,
  accessType: { type: String, enum: ['full', 'emergency'], default: 'full' },
  actionsPerformed: [String],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AccessLog', accessLogSchema);
