const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const PDF_PATH = path.join(__dirname, '..', 'data', '18-07-2022_4.2A.pdf');
const OUT_PATH = path.join(__dirname, '..', 'data', 'rules.json');

function cleanLine(line) {
  return line.replace(/\s+/g, ' ').trim();
}

function detectCategory(line) {
  if (/אש|כיבוי|חירום/.test(line)) return 'fire_safety';
  if (/מים|ברז|מתזים|עשן/.test(line)) return 'fire_safety';
  if (/תברואה|מטבח|מזון/.test(line)) return 'sanitation';
  if (/אלכוהול|בר|משקאות משכרים/.test(line)) return 'alcohol';
  if (/גז/.test(line)) return 'gas';
  if (/בשר/.test(line)) return 'meat';
  if (/משלוח/.test(line)) return 'delivery';
  return 'general';
}

function detectPriority(line) {
  if (/חובה|מחויב/.test(line)) return 'must';
  if (/מומלץ|רצוי/.test(line)) return 'should';
  return 'nice';
}

function detectAppliesIf(line) {
  const appliesIf = { size: [], seats: [], tags: [] };
  const normalized = line.replace(/\s+/g, ' ').replace(/מ\s*ר/g, 'מ"ר').trim();

  // Area
  const sizeMatch = normalized.match(/(\d+)\s?מ"ר/);
  if (sizeMatch) {
    const value = parseInt(sizeMatch[1], 10);
    if (/עד|לא יעלה|לא יותר/.test(normalized)) {
      appliesIf.size.push({ op: "<=", value });
    } else if (/מעל|גדול מ/.test(normalized)) {
      appliesIf.size.push({ op: ">", value });
    } else {
      appliesIf.size.push({ op: ">=", value });
    }
  }

  // Seats / occupancy
  const seatsMatch = normalized.match(/(\d+)\s?(?:מקומות|ישיבה|אנשים|איש|קהל)/);
  if (seatsMatch) {
    const value = parseInt(seatsMatch[1], 10);
    if (/עד|לא יעלה|לא יותר/.test(normalized)) {
      appliesIf.seats.push({ op: "<=", value });
    } else if (/מעל|גדול מ/.test(normalized)) {
      appliesIf.seats.push({ op: ">", value });
    } else {
      appliesIf.seats.push({ op: ">=", value });
    }
  }

  // Tags
  if (/אלכוהול|בר|משקאות משכרים/.test(normalized)) appliesIf.tags.push("alcohol");
  if (/גז/.test(normalized)) appliesIf.tags.push("gas");
  if (/בשר/.test(normalized)) appliesIf.tags.push("meat");
  if (/משלוח/.test(normalized)) appliesIf.tags.push("delivery");
  if (/אירוע|כיפת השמיים/.test(normalized)) appliesIf.tags.push("outdoor");

  return appliesIf;
}

// Keep only relevant rules
function isRelevant(line) {
  return (
    /(\d+)\s?(?:מ"ר|מקומות|ישיבה|אנשים|איש|קהל)/.test(line) ||
    /אלכוהול|משקאות משכרים|בר/.test(line) ||
    /גז/.test(line) ||
    /בשר/.test(line) ||
    /משלוח/.test(line)
  );
}

async function main() {
  try {
    const buffer = fs.readFileSync(PDF_PATH);
    const data = await pdf(buffer);

    const lines = data.text
      .replace(/\r/g, '')
      .split('\n')
      .map(cleanLine)
      .filter(Boolean);

    const rules = [];

    lines.forEach((line, i) => {
      if (!isRelevant(line)) return;

      rules.push({
        id: `rule-${i + 1}`,
        description: line,
        category: detectCategory(line),
        appliesIf: detectAppliesIf(line),
        priority: detectPriority(line)
      });
    });

    const output = { updatedAt: new Date().toISOString(), rules };
    fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), 'utf8');
    console.log(`✅ rules.json created with ${rules.length} focused rules`);
  } catch (err) {
    console.error('❌ Error processing PDF:', err.message);
  }
}

main();
