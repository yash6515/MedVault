const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  healthId: { type: String, unique: true, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  pin: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  address: { type: String },
  qrCode: { type: String },

  // Medical Profile
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', ''] },
  allergies: [{
    name: String,
    severity: { type: String, enum: ['mild', 'moderate', 'severe', 'life-threatening'] }
  }],
  currentMedications: [{
    name: String,
    dosage: String,
    frequency: String
  }],
  chronicConditions: [{
    name: String,
    status: { type: String, enum: ['controlled', 'uncontrolled'], default: 'controlled' }
  }],
  pastSurgeries: [{
    name: String,
    year: String
  }],
  familyHistory: [{
    relation: String,
    condition: String
  }],

  // Lifestyle
  smoker: { type: Boolean, default: false },
  alcoholUse: { type: String, enum: ['none', 'occasional', 'moderate', 'heavy'], default: 'none' },
  exerciseFrequency: { type: String, enum: ['none', 'light', 'moderate', 'daily'], default: 'none' },
  dietType: { type: String, enum: ['veg', 'non-veg', 'vegan', 'other'], default: 'non-veg' },

  // Emergency Contacts
  emergencyContacts: [{
    name: String,
    phone: String,
    relationship: String
  }],

  // Lab Reports
  labReports: [{
    title: String,
    date: { type: Date, default: Date.now },
    fileData: String,
    fileType: String
  }],

  // AI Predictions
  aiPredictions: {
    lastUpdated: Date,
    riskScores: [{
      condition: String,
      percentage: Number,
      timeframe: String
    }],
    warnings: [String],
    recommendations: [String],
    screeningSuggestions: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
