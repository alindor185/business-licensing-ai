const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { matchRules } = require('./match');
const { generateReport } = require('./ai');

const app = express();
app.use(cors());
app.use(express.json());

// --- Static frontend ---
// Serves the client (HTML/CSS/JS) directly from /client folder
app.use('/', express.static(path.join(__dirname, 'client')));

// --- Rules API ---
// Returns the entire rules dataset for inspection/debugging
app.get('/api/rules', (req, res) => {
  try {
    const data = require('./data/rules.json');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'rules.json missing – run npm run process first' });
  }
});

// --- Evaluation API ---
// Accepts business input, matches against rules, 
// and generates a personalized AI report.
app.post('/api/evaluate', async (req, res) => {
  try {
    const { name, sizeSqm, seats, features } = req.body || {};
    const input = {
      name,
      sizeSqm: Number(sizeSqm) || 0,
      seats: Number(seats) || 0,
      features: Array.isArray(features) ? features : []
    };

    // 1. Match rules by thresholds/tags
    const matched = matchRules(input);

    // 2. Generate natural-language report with OpenAI
    const report = await generateReport({ business: input, matchedRules: matched });

    res.json({ matchedRules: matched, report });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'failed to evaluate' });
  }
});

// --- Server startup ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
