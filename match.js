const fs = require('fs');
const path = require('path');

const RULES_PATH = path.join(__dirname, 'data', 'rules.json');

/**
 * Load rules from JSON file into memory
 */
function loadRules() {
  const raw = fs.readFileSync(RULES_PATH, 'utf8');
  return JSON.parse(raw).rules || [];
}

/**
 * Check if a numeric value passes all threshold conditions
 * Example: size >= 100, seats <= 50
 */
function passThresholds(value, thresholds) {
  if (!thresholds || !thresholds.length) return true;
  return thresholds.every(t => {
    if (t.op === '<=') return value <= t.value;
    if (t.op === '>=') return value >= t.value;
    return true; // ignore unsupported operators
  });
}

/**
 * Match business input against rule set
 * Applies threshold checks and tag matching,
 * then sorts results by priority (must > should > nice).
 */
function matchRules(input) {
  const { sizeSqm = 0, seats = 0, features = [] } = input;
  const rules = loadRules();

  const matched = rules.filter(r => {
    const sizeOk = passThresholds(sizeSqm, r.appliesIf.size);
    const seatsOk = passThresholds(seats, r.appliesIf.seats);
    const tagsOk =
      !r.appliesIf.tags.length || r.appliesIf.tags.some(tag => features.includes(tag));
    return sizeOk && seatsOk && tagsOk;
  });

  // Prioritize stronger obligations first
  const priority = { must: 0, should: 1, nice: 2 };
  matched.sort((a, b) => priority[a.priority] - priority[b.priority]);

  return matched;
}

module.exports = { matchRules };
