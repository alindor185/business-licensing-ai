require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function generateReport({ business, matchedRules }) {
  // Basic business details (will appear at the beginning of the report)
  const base = `Business details:
Name: ${business.name || "Not provided"}
Size: ${business.sizeSqm} sqm
Seats: ${business.seats}
Features: ${(business.features || []).join(", ") || "None"}
`;

  // Collected list of matched rules
  const bullets = matchedRules
    .map(r => `${r.title} - ${r.description}`)
    .join("\n");

  // Demo mode (if no API key provided)
  if (!OPENAI_API_KEY) {
    return `No API key configured - demo report only

${base}

Relevant rules:
${bullets}`;
  }

  const { OpenAI } = require("openai");
  const client = new OpenAI({ apiKey: OPENAI_API_KEY });

  // Ask the model to generate the report
  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini", // small and fast model
    messages: [
      {
        role: "system",
        // System instructions: write in Hebrew, clear and practical, with a light "legal language" tone
        content: `You are a business licensing consultant in Israel.
Your goal is to produce a report in Hebrew for a business owner, clear and practical, with a slight official "law language" flavor.
Do not use Markdown. Write plain text only.

Guidelines:
1. Start with a short introduction including the business name.
2. Organize content by topics: 📜 Business License, 🧼 Sanitation, 🔥 Fire Safety, 🏥 Public Health, ⚖️ Special Requirements.
3. For each topic:
   - State obligations clearly ("חובה", "על בעל העסק", "נדרש").
   - Add recommendations (מומלץ) if applicable.
   - Keep language formal but understandable for non-lawyers.
4. Prefer short bullet-style clauses over long paragraphs.
5. End with a summary of next steps and a short clarification about possible consequences if rules are not followed.`
      },
      {
        role: "user",
        // User message: pass business details and the relevant rules
        content: `Business details:
${base}

Relevant rules:
${bullets}`
      }
    ],
    temperature: 0.6 // add a bit more variation to wording
  });

  // Return the generated text
  return resp.choices[0].message.content.trim();
}

module.exports = { generateReport };
