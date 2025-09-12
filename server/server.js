const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { matchRules } = require('./match');
const { generateReport } = require('./ai');

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend from ../client (go up one level from /server)
app.use('/', express.static(path.join(__dirname, '../client')));

// API: return all rules
app.get('/api/rules', (req, res) => {
  try {
    const data = require('../data/rules.json');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'rules.json missing – run npm run process first' });
  }
});

// API: evaluate business input → matched rules + AI report
app.post('/api/evaluate', async (req, res) => {
  try {
    const { name, sizeSqm, seats, features } = req.body || {};
    const input = {
      name,
      sizeSqm: Number(sizeSqm) || 0,
      seats: Number(seats) || 0,
      features: Array.isArray(features) ? features : []
    };

    const matched = matchRules(input);
    const report = await generateReport({ business: input, matchedRules: matched });

    res.json({ matchedRules: matched, report });
  } catch (e) {
    console.error("Error in /api/evaluate:", e);
    res.status(500).json({ error: e.message || 'failed to evaluate' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
