const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { authMiddleware } = require('../middleware/auth');
const pdfParse = require('pdf-parse');

// Extract text from uploaded PDF (base64)
router.post('/parse-document', authMiddleware, async (req, res) => {
  try {
    const { fileData, fileType } = req.body;

    if (!fileData) {
      return res.status(400).json({ message: 'No file data provided' });
    }

    let extractedText = '';

    if (fileType === 'application/pdf') {
      // Extract base64 data (remove data URI prefix)
      const base64Data = fileData.replace(/^data:application\/pdf;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (fileType?.startsWith('image/')) {
      // For images, use Claude's vision to extract text
      if (process.env.CLAUDE_API_KEY && process.env.CLAUDE_API_KEY !== 'your_claude_api_key_here') {
        try {
          const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
          const mediaType = fileType || 'image/jpeg';

          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.CLAUDE_API_KEY,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 2000,
              messages: [{
                role: 'user',
                content: [
                  {
                    type: 'image',
                    source: { type: 'base64', media_type: mediaType, data: base64Data }
                  },
                  {
                    type: 'text',
                    text: 'Extract ALL text from this medical document/prescription image. Include medicine names, dosages, diagnoses, doctor notes, dates, and any other medical information. Return only the extracted text, nothing else.'
                  }
                ]
              }]
            })
          });
          const data = await response.json();
          if (data.error) throw new Error(data.error.message);
          extractedText = data.content[0].text;
        } catch (apiErr) {
          console.log('Image OCR via Claude failed:', apiErr.message);
          return res.status(400).json({ message: 'Could not extract text from image. Please try a clearer image or PDF.' });
        }
      } else {
        return res.status(400).json({ message: 'Image processing requires API key configuration' });
      }
    } else {
      return res.status(400).json({ message: 'Unsupported file type. Use PDF or image files.' });
    }

    if (!extractedText || extractedText.trim().length < 5) {
      return res.status(400).json({ message: 'No readable text found in document' });
    }

    res.json({ text: extractedText, fileType });
  } catch (err) {
    res.status(500).json({ message: 'Document parsing failed', error: err.message });
  }
});

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
        // Robust JSON extraction: try code blocks first, then raw JSON object
        let jsonStr = text;
        const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
          jsonStr = codeBlockMatch[1].trim();
        } else {
          // Try to find a JSON object in the response
          const objMatch = text.match(/\{[\s\S]*\}/);
          if (objMatch) jsonStr = objMatch[0];
        }
        aiResponse = JSON.parse(jsonStr.trim());
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

// Extract structured medical data from uploaded document text
router.post('/extract-medical', authMiddleware, async (req, res) => {
  try {
    const { text, fileType } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ message: 'No readable text found in the document' });
    }

    const prompt = `You are a medical document parser. Extract structured medical data from the following text.

The text was extracted from a ${fileType || 'medical document'}.

TEXT:
"""
${text.slice(0, 4000)}
"""

Extract and return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "allergies": [{"name": "string", "severity": "mild|moderate|severe|life-threatening"}],
  "currentMedications": [{"name": "string", "dosage": "string", "frequency": "string"}],
  "chronicConditions": [{"name": "string", "status": "controlled|uncontrolled"}],
  "pastSurgeries": [{"name": "string", "year": "string"}],
  "familyHistory": [{"relation": "string", "condition": "string"}],
  "notes": "string with any other relevant medical information"
}

Rules:
- Only include data that is clearly mentioned in the text
- Leave arrays empty [] if no relevant data found
- For medications, try to extract dosage and frequency if available
- For allergies, default severity to "moderate" if not specified
- For conditions, default status to "controlled" if not specified
- notes should contain any other relevant medical info not captured above`;

    let aiResponse;

    // Use Claude API for extraction
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
            max_tokens: 1500,
            temperature: 0,
            messages: [{ role: 'user', content: prompt }]
          })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        const responseText = data.content[0].text;
        // Robust JSON extraction
        let jsonStr = responseText;
        const codeBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
          jsonStr = codeBlockMatch[1].trim();
        } else {
          const objMatch = responseText.match(/\{[\s\S]*\}/);
          if (objMatch) jsonStr = objMatch[0];
        }
        aiResponse = JSON.parse(jsonStr.trim());
      } catch (apiErr) {
        console.log('Claude API extraction failed:', apiErr.message);
      }
    }

    // Fallback: basic keyword extraction
    if (!aiResponse) {
      aiResponse = extractBasicMedicalData(text);
    }

    res.json({
      extracted: aiResponse,
      source: 'ai',
      message: 'Medical data extracted successfully'
    });
  } catch (err) {
    res.status(500).json({ message: 'Extraction failed', error: err.message });
  }
});

// Basic keyword-based extraction fallback
function extractBasicMedicalData(text) {
  const lower = text.toLowerCase();
  const result = {
    allergies: [],
    currentMedications: [],
    chronicConditions: [],
    pastSurgeries: [],
    familyHistory: [],
    notes: ''
  };

  // Common allergy keywords
  const allergyKeywords = ['allergy', 'allergic', 'allergen', 'hypersensitivity'];
  const commonAllergens = ['penicillin', 'aspirin', 'sulfa', 'ibuprofen', 'latex', 'peanut', 'codeine', 'amoxicillin'];
  commonAllergens.forEach(a => {
    if (lower.includes(a)) {
      result.allergies.push({ name: a.charAt(0).toUpperCase() + a.slice(1), severity: 'moderate' });
    }
  });

  // Common medications - look for dosage patterns like "500mg", "10mg"
  const medPattern = /(\w+)\s+(\d+\s*(?:mg|ml|mcg|g))/gi;
  let match;
  while ((match = medPattern.exec(text)) !== null) {
    result.currentMedications.push({
      name: match[1],
      dosage: match[2],
      frequency: 'as prescribed'
    });
  }

  // Common conditions
  const conditions = ['diabetes', 'hypertension', 'asthma', 'thyroid', 'arthritis', 'cholesterol', 'heart disease', 'copd', 'anemia'];
  conditions.forEach(c => {
    if (lower.includes(c)) {
      result.chronicConditions.push({ name: c.charAt(0).toUpperCase() + c.slice(1), status: 'controlled' });
    }
  });

  // Surgery keywords
  const surgeryKeywords = ['surgery', 'operation', 'appendectomy', 'bypass', 'transplant', 'removal', 'cesarean'];
  surgeryKeywords.forEach(s => {
    if (lower.includes(s)) {
      const yearMatch = text.match(new RegExp(s + '.*?(\\d{4})', 'i'));
      result.pastSurgeries.push({ name: s.charAt(0).toUpperCase() + s.slice(1), year: yearMatch?.[1] || '' });
    }
  });

  result.notes = text.slice(0, 500);
  return result;
}

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
