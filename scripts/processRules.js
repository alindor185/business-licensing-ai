const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

// Paths for input PDF and output JSON
const PDF_PATH = path.join(__dirname, '..', 'data', '18-07-2022_4.2A.pdf');
const OUT_PATH = path.join(__dirname, '..', 'data', 'rules.json');

// Normalize whitespace and trim a line
function cleanLine(line) {
  return line.replace(/\s+/g, ' ').trim();
}

// Simple keyword-based category detection
function detectCategory(line) {
  if (/אש|כיבוי|חירום/.test(line)) return 'safety';
  if (/גז/.test(line)) return 'safety';
  if (/תברואה|מזון|בשר|מטבח/.test(line)) return 'sanitation';
  if (/משטרה|אישור|רישוי/.test(line)) return 'licensing';
  if (/משלוח/.test(line)) return 'delivery';
  return 'general';
}

// Priority assignment based on language cues
function detectPriority(line) {
  if (/חובה|מחויב/.test(line)) return 'must';
  if (/מומלץ|רצוי/.test(line)) return 'should';
  return 'nice';
}

async function main() {
  try {
    // Parse PDF into raw text
    const buffer = fs.readFileSync(PDF_PATH);
    const data = await pdf(buffer);

    // Split into lines and clean
    const text = data.text.replace(/\r/g, '').trim();
    const lines = text.split('\n').map(cleanLine).filter(Boolean);

    const categories = {};

    // Iterate over lines and build structured rules
    lines.forEach((line, i) => {
      if (/^\d+(\.\d+)*\s/.test(line) || line.length > 20) {
        const category = detectCategory(line);
        const priority = detectPriority(line);

        if (!categories[category]) categories[category] = [];

        categories[category].push({
          id: `rule-${i + 1}`,
          title: line.split(':')[0] || `דרישה ${i + 1}`,
          description: line,
          appliesIf: { size: [], seats: [], tags: [] }, // placeholder for matching logic
          priority,
          legalRef: line.match(/^\d+(\.\d+)*/) ? line.match(/^\d+(\.\d+)*/)[0] : null
        });
      }
    });

    // Save structured rules into JSON
    const output = {
      updatedAt: new Date().toISOString(),
      categories
    };

    fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), 'utf8');
    console.log(
      `✅ rules.json created with ${Object.values(categories).flat().length} rules, divided into ${Object.keys(categories).length} categories`
    );
  } catch (err) {
    console.error('❌ Error processing PDF:', err.message);
  }
}

main();
