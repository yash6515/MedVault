const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
require('dotenv').config();

const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Visit = require('./models/Visit');
const AccessLog = require('./models/AccessLog');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Patient.deleteMany({});
  await Doctor.deleteMany({});
  await Visit.deleteMany({});
  await AccessLog.deleteMany({});
  console.log('Cleared existing data');

  const hashedPassword = await bcrypt.hash('password123', 10);
  const hashedPin = await bcrypt.hash('1234', 10);

  // ── Patients ──────────────────────────────────────────────
  const patients = [
    {
      healthId: 'MV-4829-7156',
      fullName: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 9876543210',
      password: hashedPassword,
      pin: hashedPin,
      dateOfBirth: new Date('1992-05-14'),
      gender: 'Female',
      address: '42 MG Road, Bangalore 560001',
      bloodGroup: 'B+',
      allergies: [
        { name: 'Penicillin', severity: 'severe' },
        { name: 'Sulfa Drugs', severity: 'moderate' }
      ],
      currentMedications: [
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
        { name: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily' }
      ],
      chronicConditions: [
        { name: 'Type 2 Diabetes', status: 'controlled' },
        { name: 'Hyperlipidemia', status: 'controlled' }
      ],
      pastSurgeries: [
        { name: 'Appendectomy', year: '2019' }
      ],
      familyHistory: [
        { relation: 'Father', condition: 'Heart Disease' },
        { relation: 'Mother', condition: 'Type 2 Diabetes' },
        { relation: 'Grandfather', condition: 'Hypertension' }
      ],
      smoker: false,
      alcoholUse: 'none',
      exerciseFrequency: 'light',
      dietType: 'veg',
      emergencyContacts: [
        { name: 'Rahul Sharma', phone: '+91 9876543211', relationship: 'Spouse' },
        { name: 'Meera Sharma', phone: '+91 9876543212', relationship: 'Mother' }
      ],
      aiPredictions: {
        lastUpdated: new Date(),
        riskScores: [
          { condition: 'Cardiovascular Disease', percentage: 68, timeframe: 'within 5 years' },
          { condition: 'Type 2 Diabetes Complications', percentage: 55, timeframe: 'within 3 years' },
          { condition: 'Diabetic Retinopathy', percentage: 30, timeframe: 'within 5 years' }
        ],
        warnings: [
          'Family history of heart disease combined with diabetes increases cardiovascular risk significantly',
          'Sedentary lifestyle with light exercise may accelerate diabetes complications'
        ],
        recommendations: [
          'Walking 30 min/day could reduce your heart disease risk by 35%',
          'Monitor HbA1c every 3 months and maintain blood sugar below 140 mg/dL',
          'Include more fiber-rich foods to help manage blood sugar levels',
          'Consider annual cardiac screening given family history'
        ],
        screeningSuggestions: [
          'Annual ECG and lipid profile',
          'HbA1c test every 3 months',
          'Annual eye examination for diabetic retinopathy'
        ]
      }
    },
    {
      healthId: 'MV-3517-8294',
      fullName: 'Arjun Patel',
      email: 'arjun@example.com',
      phone: '+91 9123456780',
      password: hashedPassword,
      pin: hashedPin,
      dateOfBirth: new Date('1985-11-22'),
      gender: 'Male',
      address: '15 Nehru Nagar, Mumbai 400001',
      bloodGroup: 'O+',
      allergies: [
        { name: 'Aspirin', severity: 'life-threatening' }
      ],
      currentMedications: [
        { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' },
        { name: 'Losartan', dosage: '50mg', frequency: 'Once daily' }
      ],
      chronicConditions: [
        { name: 'Hypertension', status: 'controlled' },
        { name: 'Asthma', status: 'controlled' }
      ],
      pastSurgeries: [
        { name: 'Knee Arthroscopy', year: '2021' },
        { name: 'Tonsillectomy', year: '2005' }
      ],
      familyHistory: [
        { relation: 'Father', condition: 'Hypertension' },
        { relation: 'Mother', condition: 'Thyroid Disorder' }
      ],
      smoker: true,
      alcoholUse: 'moderate',
      exerciseFrequency: 'none',
      dietType: 'non-veg',
      emergencyContacts: [
        { name: 'Sneha Patel', phone: '+91 9123456781', relationship: 'Wife' },
        { name: 'Vikram Patel', phone: '+91 9123456782', relationship: 'Brother' }
      ],
      aiPredictions: {
        lastUpdated: new Date(),
        riskScores: [
          { condition: 'Cardiovascular Disease', percentage: 78, timeframe: 'within 3 years' },
          { condition: 'COPD / Respiratory Disease', percentage: 62, timeframe: 'within 5 years' },
          { condition: 'Stroke', percentage: 45, timeframe: 'within 5 years' },
          { condition: 'Metabolic Syndrome', percentage: 52, timeframe: 'within 2 years' }
        ],
        warnings: [
          'Smoking with hypertension creates a critically elevated cardiovascular risk',
          'Aspirin allergy (life-threatening) - ensure all treating physicians are aware',
          'Sedentary lifestyle with moderate alcohol use compounds hypertension risk'
        ],
        recommendations: [
          'Quit smoking immediately - lung function can improve within 2 weeks',
          'Reduce alcohol consumption to occasional or none',
          'Start with 15 minutes of daily walking and gradually increase',
          'Monitor blood pressure daily and maintain below 130/80 mmHg',
          'Reduce sodium intake to less than 2300mg/day'
        ],
        screeningSuggestions: [
          'Annual ECG and cardiac stress test',
          'Pulmonary function test every 6 months',
          'Annual comprehensive blood panel including lipid profile',
          'Kidney function test annually due to hypertension medications'
        ]
      }
    },
    {
      healthId: 'MV-6201-4438',
      fullName: 'Kavitha Reddy',
      email: 'kavitha@example.com',
      phone: '+91 9988776655',
      password: hashedPassword,
      pin: hashedPin,
      dateOfBirth: new Date('1998-03-08'),
      gender: 'Female',
      address: '78 Anna Salai, Chennai 600002',
      bloodGroup: 'A+',
      allergies: [],
      currentMedications: [
        { name: 'Levothyroxine', dosage: '50mcg', frequency: 'Once daily (morning)' }
      ],
      chronicConditions: [
        { name: 'Hypothyroidism', status: 'controlled' }
      ],
      pastSurgeries: [],
      familyHistory: [
        { relation: 'Mother', condition: 'Hypothyroidism' },
        { relation: 'Grandmother', condition: 'Osteoporosis' }
      ],
      smoker: false,
      alcoholUse: 'occasional',
      exerciseFrequency: 'moderate',
      dietType: 'non-veg',
      emergencyContacts: [
        { name: 'Ramesh Reddy', phone: '+91 9988776656', relationship: 'Father' },
        { name: 'Anita Reddy', phone: '+91 9988776657', relationship: 'Mother' }
      ]
    }
  ];

  // Generate QR codes and save patients
  const savedPatients = [];
  for (const p of patients) {
    p.qrCode = await QRCode.toDataURL(p.healthId);
    const saved = await new Patient(p).save();
    savedPatients.push(saved);
    console.log(`Created patient: ${p.fullName} (${p.healthId})`);
  }

  // ── Doctors ───────────────────────────────────────────────
  const doctors = [
    {
      fullName: 'Dr. Anil Mehta',
      email: 'dr.mehta@example.com',
      password: hashedPassword,
      phone: '+91 8000100200',
      hospitalName: 'Apollo Hospital',
      registrationNumber: 'NMC-2015-48291',
      specialization: 'General Physician'
    },
    {
      fullName: 'Dr. Sunita Rao',
      email: 'dr.rao@example.com',
      password: hashedPassword,
      phone: '+91 8000100300',
      hospitalName: 'Fortis Hospital',
      registrationNumber: 'KMC-2012-73654',
      specialization: 'Cardiologist'
    },
    {
      fullName: 'Dr. Rajesh Kumar',
      email: 'dr.kumar@example.com',
      password: hashedPassword,
      phone: '+91 8000100400',
      hospitalName: 'Max Healthcare',
      registrationNumber: 'DMC-2018-55102',
      specialization: 'Endocrinologist'
    }
  ];

  const savedDoctors = [];
  for (const d of doctors) {
    const saved = await new Doctor(d).save();
    savedDoctors.push(saved);
    console.log(`Created doctor: ${d.fullName} (${d.hospitalName})`);
  }

  // ── Visits ────────────────────────────────────────────────
  const visits = [
    {
      patientId: savedPatients[0]._id,
      doctorId: savedDoctors[0]._id,
      doctorName: 'Dr. Anil Mehta',
      hospitalName: 'Apollo Hospital',
      diagnosis: 'Routine diabetes checkup - blood sugar levels stable',
      prescriptions: [
        { medicine: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '3 months' },
        { medicine: 'Vitamin D3', dosage: '60000 IU', frequency: 'Once weekly', duration: '8 weeks' }
      ],
      notes: 'HbA1c at 6.8%, well controlled. Continue current medications. Advised daily walking.',
      followUpDate: new Date('2026-07-15'),
      labRecommendations: ['HbA1c after 3 months', 'Lipid profile'],
      timestamp: new Date('2026-04-10T14:30:00')
    },
    {
      patientId: savedPatients[0]._id,
      doctorId: savedDoctors[1]._id,
      doctorName: 'Dr. Sunita Rao',
      hospitalName: 'Fortis Hospital',
      diagnosis: 'Cardiac evaluation - mild left ventricular hypertrophy noted',
      prescriptions: [
        { medicine: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily at bedtime', duration: '6 months' }
      ],
      notes: 'ECG shows minor LVH. Lipid levels borderline high. Started statin therapy. Avoid high-fat foods.',
      followUpDate: new Date('2026-10-10'),
      labRecommendations: ['Echocardiogram in 6 months', 'Repeat lipid panel in 3 months'],
      timestamp: new Date('2026-03-20T10:00:00')
    },
    {
      patientId: savedPatients[1]._id,
      doctorId: savedDoctors[0]._id,
      doctorName: 'Dr. Anil Mehta',
      hospitalName: 'Apollo Hospital',
      diagnosis: 'Upper respiratory infection with mild asthma exacerbation',
      prescriptions: [
        { medicine: 'Azithromycin', dosage: '500mg', frequency: 'Once daily', duration: '5 days' },
        { medicine: 'Montelukast', dosage: '10mg', frequency: 'Once daily', duration: '2 weeks' },
        { medicine: 'Salbutamol Inhaler', dosage: '2 puffs', frequency: 'As needed', duration: 'Ongoing' }
      ],
      notes: 'Patient presenting with cough, mild wheezing. NOTE: ASPIRIN ALLERGY (LIFE-THREATENING) - avoid all NSAIDs. Used paracetamol for fever.',
      followUpDate: new Date('2026-04-25'),
      labRecommendations: ['Chest X-ray if symptoms persist', 'Pulmonary function test'],
      timestamp: new Date('2026-04-08T16:45:00')
    },
    {
      patientId: savedPatients[1]._id,
      doctorId: savedDoctors[1]._id,
      doctorName: 'Dr. Sunita Rao',
      hospitalName: 'Fortis Hospital',
      diagnosis: 'Hypertension follow-up - BP 142/88, slightly elevated',
      prescriptions: [
        { medicine: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: 'Ongoing' },
        { medicine: 'Losartan', dosage: '50mg', frequency: 'Once daily', duration: 'Ongoing' }
      ],
      notes: 'BP slightly above target. Strongly advised smoking cessation. Referred to smoking cessation clinic. Reduce salt intake.',
      followUpDate: new Date('2026-05-20'),
      labRecommendations: ['Renal function panel', '24-hour ambulatory BP monitoring'],
      timestamp: new Date('2026-02-14T11:15:00')
    },
    {
      patientId: savedPatients[2]._id,
      doctorId: savedDoctors[2]._id,
      doctorName: 'Dr. Rajesh Kumar',
      hospitalName: 'Max Healthcare',
      diagnosis: 'Hypothyroidism management - TSH levels normalized',
      prescriptions: [
        { medicine: 'Levothyroxine', dosage: '50mcg', frequency: 'Once daily (morning, empty stomach)', duration: '6 months' }
      ],
      notes: 'TSH at 3.2 mIU/L (normal range). Weight stable. Continue current dose. Take medication 30 min before breakfast.',
      followUpDate: new Date('2026-10-08'),
      labRecommendations: ['TSH and Free T4 after 6 months'],
      timestamp: new Date('2026-04-05T09:30:00')
    }
  ];

  for (const v of visits) {
    await new Visit(v).save();
  }
  console.log(`Created ${visits.length} visits`);

  // ── Access Logs ───────────────────────────────────────────
  const accessLogs = [
    {
      patientId: savedPatients[0]._id,
      doctorId: savedDoctors[0]._id,
      doctorName: 'Dr. Anil Mehta',
      hospitalName: 'Apollo Hospital',
      accessType: 'full',
      actionsPerformed: ['Viewed full medical record', 'Added prescription/visit notes'],
      timestamp: new Date('2026-04-10T14:30:00')
    },
    {
      patientId: savedPatients[0]._id,
      doctorId: savedDoctors[1]._id,
      doctorName: 'Dr. Sunita Rao',
      hospitalName: 'Fortis Hospital',
      accessType: 'full',
      actionsPerformed: ['Viewed full medical record', 'Added prescription/visit notes'],
      timestamp: new Date('2026-03-20T10:00:00')
    },
    {
      patientId: savedPatients[1]._id,
      doctorId: savedDoctors[0]._id,
      doctorName: 'Dr. Anil Mehta',
      hospitalName: 'Apollo Hospital',
      accessType: 'full',
      actionsPerformed: ['Viewed full medical record', 'Added prescription/visit notes'],
      timestamp: new Date('2026-04-08T16:45:00')
    },
    {
      patientId: savedPatients[1]._id,
      doctorId: savedDoctors[1]._id,
      doctorName: 'Dr. Sunita Rao',
      hospitalName: 'Fortis Hospital',
      accessType: 'emergency',
      actionsPerformed: ['Emergency access - limited data'],
      timestamp: new Date('2026-01-22T02:30:00')
    },
    {
      patientId: savedPatients[1]._id,
      doctorId: savedDoctors[1]._id,
      doctorName: 'Dr. Sunita Rao',
      hospitalName: 'Fortis Hospital',
      accessType: 'full',
      actionsPerformed: ['Viewed full medical record', 'Added prescription/visit notes'],
      timestamp: new Date('2026-02-14T11:15:00')
    },
    {
      patientId: savedPatients[2]._id,
      doctorId: savedDoctors[2]._id,
      doctorName: 'Dr. Rajesh Kumar',
      hospitalName: 'Max Healthcare',
      accessType: 'full',
      actionsPerformed: ['Viewed full medical record', 'Added prescription/visit notes'],
      timestamp: new Date('2026-04-05T09:30:00')
    }
  ];

  for (const log of accessLogs) {
    await new AccessLog(log).save();
  }
  console.log(`Created ${accessLogs.length} access logs`);

  // ── Summary ───────────────────────────────────────────────
  console.log('\n========== SEED COMPLETE ==========');
  console.log('\nPatient Logins (password: password123, PIN: 1234):');
  console.log('  1. priya@example.com   | Health ID: MV-4829-7156');
  console.log('  2. arjun@example.com   | Health ID: MV-3517-8294');
  console.log('  3. kavitha@example.com | Health ID: MV-6201-4438');
  console.log('\nDoctor Logins (password: password123):');
  console.log('  1. dr.mehta@example.com  | Apollo Hospital');
  console.log('  2. dr.rao@example.com    | Fortis Hospital');
  console.log('  3. dr.kumar@example.com  | Max Healthcare');
  console.log('===================================\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
