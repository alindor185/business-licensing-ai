require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function generateReport({ business, matchedRules }) {
  const base = `Business details:
Name: ${business.name || "Not provided"}
Size: ${business.sizeSqm} sqm
Seats: ${business.seats}
Features: ${(business.features || []).join(", ") || "None"}
`;

  const bullets = matchedRules
    .map(r => `${r.title} - ${r.description}`)
    .join("\n");

  // Local demo if no API key
  if (!OPENAI_API_KEY) {
    return `No API key configured - demo report only

${base}

Relevant rules:
${bullets}`;
  }

  const { OpenAI } = require("openai");
  const client = new OpenAI({ apiKey: OPENAI_API_KEY });

  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a business licensing consultant in Israel.
Your goal is to produce a friendly and clear report in Hebrew.
Do not use Markdown. Write plain text only.

Structure:
1. Short intro with business name.
2. Clear sections (Business License, Sanitation, Fire Safety, Public Health, Special Requirements).
3. Each section explains meaning for the business in simple language.
4. No quoting law text. Use practical instructions.
5. Use emojis for section titles.
6. End with a short summary of next steps.`
      },
      {
        role: "user",
        content: `Business details:
${base}

Relevant rules:
${bullets}`
      }
    ],
    temperature: 0.4
  });

  return resp.choices[0].message.content.trim();
}

module.exports = { generateReport };
