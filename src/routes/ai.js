const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const https = require('https');

// Call Gemini API via REST
async function callGeminiAPI(prompt) {
  const apiKey = process.env.GOOGLE_GENAI_KEY;
  const model = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  };

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 30000
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            reject(new Error(json.error.message || JSON.stringify(json.error)));
          } else if (json.candidates && json.candidates[0] && json.candidates[0].content) {
            const text = json.candidates[0].content.parts[0].text;
            resolve(text);
          } else {
            reject(new Error('Invalid response format from Gemini API'));
          }
        } catch (err) {
          reject(new Error(`Failed to parse response: ${err.message}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('API request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// Analyze device serial number
router.post('/analyze-device', auth,
  body('serialNumber').trim().notEmpty().withMessage('serialNumber required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    try {
      const { serialNumber, brand, model: modelName } = req.body;
      
      const prompt = `Analyze the following device serial number and provide insights about its potential issues, age estimation, and manufacturing details:
- Serial Number: ${serialNumber}
- Brand: ${brand || 'Unknown'}
- Model: ${modelName || 'Unknown'}

Provide a brief technical analysis (2-3 paragraphs) including:
1. Potential manufacturing date / era
2. Common issues for this period/brand
3. Recommended diagnostic checks`;

      console.log(`[AI] Analyzing device: ${brand} ${modelName} (SN: ${serialNumber})`);
      
      const analysis = await callGeminiAPI(prompt);
      
      console.log(`[AI] ✓ Analysis generated successfully via Gemini 2.5 Flash`);
      
      res.json({ analysis, serialNumber, brand, model: modelName });
    } catch (err) {
      console.error(`[AI] ✗ Error:`, err.message);
      res.status(500).json({ error: err.message });
    }
  }
);

// Generate diagnostic report
router.post('/generate-report', auth,
  body('serialNumber').trim().notEmpty().withMessage('serialNumber required'),
  body('issueDescription').trim().notEmpty().withMessage('issueDescription required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    try {
      const { serialNumber, brand, model: modelName, issueDescription, findings } = req.body;
      
      const prompt = `Generate a professional diagnostic report for a computer equipment repair:
- Serial Number: ${serialNumber}
- Brand: ${brand || 'Unknown'}
- Model: ${modelName || 'Unknown'}
- Customer Reported Issue: ${issueDescription}
- Initial Findings: ${findings || 'To be determined'}

Create a structured diagnostic report including:
- Executive Summary
- Root Cause Analysis
- Affected Components
- Recommended Actions
- Estimated Repair Complexity`;

      console.log(`[AI] Generating report for: ${brand} ${modelName} (SN: ${serialNumber})`);
      
      const report = await callGeminiAPI(prompt);
      
      console.log(`[AI] ✓ Report generated successfully via Gemini 2.5 Flash`);
      
      res.json({ report, serialNumber, brand, model: modelName });
    } catch (err) {
      console.error(`[AI] ✗ Error:`, err.message);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
