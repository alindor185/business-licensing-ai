const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const PDF_PATH = path.join(__dirname, '..', 'data', '18-07-2022_4.2A.pdf');
const OUT_PATH = path.join(__dirname, '..', 'data', 'rules.json');
const ruleRegex = /^([34](?:\.\d+){2,3})/;

async function main() {
  try {
    const buffer = fs.readFileSync(PDF_PATH);
    const data = await pdf(buffer);

    const lines = data.text
      .replace(/\r/g, "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const rules = {};
    let currentKey = null;
    let currentText = "";

    for (const line of lines) {
      const match = line.match(ruleRegex);

      if (match) {
        if (currentKey) {
          rules[currentKey] = currentText.trim();
        }
        currentKey = match[1];
        currentText = line.replace(ruleRegex, "").trim();
      } else if (currentKey) {
        currentText += " " + line;
      }
    }
    if (currentKey) {
      rules[currentKey] = currentText.trim();
    }

    fs.writeFileSync(OUT_PATH, JSON.stringify(rules, null, 2), "utf8");
    console.log(`Extracted ${Object.keys(rules).length} rules → saved to ${OUT_PATH}`);
  } catch (err) {
    console.error("Error processing PDF:", err.message);
  }
}

main();
