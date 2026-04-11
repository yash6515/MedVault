const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { authMiddleware } = require('../middleware/auth');

// Generate AI health predictions
router.post('/predict', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select('-password -pin');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const forceRefresh = req.body.forceRefresh === true;

    // Return cached predictions if available and not force-refreshing (within 24 hours)
    if (!forceRefresh && patient.aiPredictions?.lastUpdated) {
      const hoursSinceUpdate = (Date.now() - new Date(patient.aiPredictions.lastUpdated).getTime()) / (1000 * 60 * 60);
      if (hoursSinceUpdate < 24 && patient.aiPredictions.riskScores?.length > 0) {
        return res.json({
          predictions: {
            riskScores: patient.aiPredictions.riskScores,
            warnings: patient.aiPredictions.warnings,
            recommendations: patient.aiPredictions.recommendations,
            screeningSuggestions: patient.aiPredictions.screeningSuggestions
          },
          cached: true,
          disclaimer: 'This is an AI-based suggestion, not a medical diagnosis. Please consult a doctor.'
        });
      }
    }

    const age = Math.floor((Date.now() - new Date(patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    const prompt = `You are a deterministic medical AI risk analyzer. Analyze this patient profile and return consistent, evidence-based risk predictions.

IMPORTANT RULES:
- Base risk percentages STRICTLY on medical evidence and the patient's actual conditions
- Conditions the patient ALREADY HAS should show HIGH risk (60-85%)
- Family history conditions should show MODERATE risk (30-55%)
- General age/lifestyle risks should show LOW risk (5-25%)
- Always return the SAME conditions for the same patient profile
- Focus ONLY on conditions relevant to this patient's data — do NOT invent unrelated risks
- Use consistent timeframes: "within 2 years", "within 5 years", "within 10 years"

Patient Profile:
- Age: ${age}, Gender: ${patient.gender}
- Blood Group: ${patient.bloodGroup || 'Not specified'}
- Known Allergies: ${patient.allergies?.map(a => `${a.name} (${a.severity})`).join(', ') || 'None'}
- Current Medications: ${patient.currentMedications?.map(m => `${m.name} ${m.dosage} ${m.frequency}`).join(', ') || 'None'}
- Chronic Conditions: ${patient.chronicConditions?.map(c => `${c.name} (${c.status})`).join(', ') || 'None'}
- Past Surgeries: ${patient.pastSurgeries?.map(s => `${s.name} (${s.year})`).join(', ') || 'None'}
- Family History: ${patient.familyHistory?.map(f => `${f.relation}: ${f.condition}`).join(', ') || 'None'}
- Lifestyle: Smoker: ${patient.smoker ? 'Yes' : 'No'}, Alcohol: ${patient.alcoholUse || 'None'}, Exercise: ${patient.exerciseFrequency || 'Not specified'}, Diet: ${patient.dietType || 'Not specified'}

Respond ONLY with valid JSON (no markdown, no code blocks) in this exact format:
{
  "riskScores": [{"condition": "string", "percentage": number, "timeframe": "string"}],
  "warnings": ["string"],
  "recommendations": ["string"],
  "screeningSuggestions": ["string"]
}

Return exactly 4 risk scores, 3 warnings, 4 recommendations, and 3 screening suggestions. All must be directly relevant to this patient's conditions, medications, family history, and lifestyle.`;

    let aiResponse;

    // Try Claude API
    if (process.env.CLAUDE_API_KEY && process.env.CLAUDE_API_KEY !== 'your_claude_api_key_here') {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            temperature: 0,
            messages: [{ role: 'user', content: prompt }]
          })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        const text = data.content[0].text;
        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
        aiResponse = JSON.parse(jsonMatch[1].trim());
      } catch (apiErr) {
        console.log('Claude API failed, using fallback:', apiErr.message);
      }
    }

    // Fallback: generate predictions based on profile data
    if (!aiResponse) {
      aiResponse = generateFallbackPredictions(patient, age);
    }

    patient.aiPredictions = {
      lastUpdated: new Date(),
      ...aiResponse
    };
    await patient.save();

    res.json({
      predictions: aiResponse,
      cached: false,
      disclaimer: 'This is an AI-based suggestion, not a medical diagnosis. Please consult a doctor.'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

function generateFallbackPredictions(patient, age) {
  const riskScores = [];
  const warnings = [];
  const recommendations = [];
  const screeningSuggestions = [];

  const conditions = patient.chronicConditions?.map(c => c.name.toLowerCase()) || [];
  const familyConditions = patient.familyHistory?.map(f => f.condition.toLowerCase()) || [];

  // Diabetes risk
  if (conditions.includes('diabetes') || familyConditions.some(c => c.includes('diabetes'))) {
    riskScores.push({ condition: 'Type 2 Diabetes Complications', percentage: 65, timeframe: 'within 3 years' });
    warnings.push('Your diabetes profile suggests elevated risk for cardiovascular complications');
    recommendations.push('Monitor HbA1c every 3 months and maintain blood sugar below 140 mg/dL');
  }

  // Heart disease risk
  if (patient.smoker || familyConditions.some(c => c.includes('heart')) || age > 45) {
    const risk = (patient.smoker ? 25 : 0) + (age > 45 ? 20 : 0) + (familyConditions.some(c => c.includes('heart')) ? 20 : 0);
    riskScores.push({ condition: 'Cardiovascular Disease', percentage: Math.min(risk + 15, 85), timeframe: 'within 5 years' });
    if (patient.smoker) warnings.push('Smoking significantly increases your cardiovascular risk');
    recommendations.push('Walking 30 min/day could reduce your heart disease risk by 35%');
  }

  // Hypertension
  if (conditions.includes('hypertension') || patient.alcoholUse === 'heavy') {
    riskScores.push({ condition: 'Hypertension Complications', percentage: 55, timeframe: 'within 2 years' });
    recommendations.push('Reduce sodium intake to less than 2300mg/day and monitor BP weekly');
  }

  // General risks based on lifestyle
  if (patient.exerciseFrequency === 'none') {
    riskScores.push({ condition: 'Metabolic Syndrome', percentage: 40, timeframe: 'within 3 years' });
    recommendations.push('Start with 15 minutes of daily walking and gradually increase to 30 minutes');
  }

  if (patient.smoker) {
    riskScores.push({ condition: 'Respiratory Disease', percentage: 50, timeframe: 'within 5 years' });
    recommendations.push('Consider a smoking cessation program - lung function can improve within 2 weeks of quitting');
  }

  // Default entries if profile is sparse
  if (riskScores.length === 0) {
    riskScores.push(
      { condition: 'General Health Risk', percentage: 15, timeframe: 'within 5 years' },
      { condition: 'Lifestyle-related Conditions', percentage: 20, timeframe: 'within 3 years' }
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      'Maintain a balanced diet with plenty of fruits and vegetables',
      'Exercise at least 150 minutes per week',
      'Get 7-8 hours of sleep per night'
    );
  }

  if (warnings.length === 0) {
    warnings.push('Keep your medical profile updated for more accurate predictions');
  }

  // Screening suggestions
  if (age > 40) screeningSuggestions.push('Annual comprehensive blood panel including lipid profile');
  if (age > 45 && patient.gender === 'Male') screeningSuggestions.push('Annual ECG and cardiac stress test');
  if (age > 50) screeningSuggestions.push('Colonoscopy screening every 5 years');
  if (conditions.includes('diabetes')) screeningSuggestions.push('Annual eye examination for diabetic retinopathy');
  if (screeningSuggestions.length === 0) {
    screeningSuggestions.push('Annual health checkup with basic blood work', 'Regular dental and vision checkups');
  }

  return { riskScores, warnings, recommendations, screeningSuggestions };
}

module.exports = router;
