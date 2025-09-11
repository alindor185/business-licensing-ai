require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * generateReport
 * Uses business details and matched regulatory rules to produce
 * a human-friendly report in Hebrew. If no API key is available,
 * falls back to a local demo output.
 */
async function generateReport({ business, matchedRules }) {
  // Base info about the business
  const base = `פרטי העסק:
שם: ${business.name || "לא צוין"}
גודל: ${business.sizeSqm} מ"ר
מספר מקומות ישיבה: ${business.seats}
מאפיינים: ${(business.features || []).join(", ") || "ללא"}
`;

  // Collect rules into a simple text block for the model
  const bullets = matchedRules.map(r => `${r.title} - ${r.description}`).join("\n");

  // Fallback if no OpenAI API key is configured
  if (!OPENAI_API_KEY) {
    return `⚠️ אין מפתח API פעיל - מוצג דוח דמו מקומי

${base}

דרישות רלוונטיות:
${bullets}`;
  }

  // Initialize OpenAI client
  const { OpenAI } = require("openai");
  const client = new OpenAI({ apiKey: OPENAI_API_KEY });

  // Prompt engineering: instruct model to act as a licensing consultant
  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `אתה יועץ רישוי עסקים בישראל.
המטרה שלך היא להפיק דוח ידידותי, קריא ופשוט בעברית לבעל העסק.
אל תשתמש ב-Markdown, לא כוכביות ולא סולמיות (#).
כתוב טקסט רגיל בלבד.

מבנה הדוח:
1. פתיחה קצרה וברורה עם שם העסק והקשר כללי.
2. חלוקה לנושאים ברורים (למשל: רישוי עסק, תברואה, בטיחות אש, בריאות הציבור, דרישות מיוחדות).
3. בכל נושא – תסביר מה המשמעות לעסק הזה בשפה פשוטה וידידותית.
4. הימנע מלצטט סעיפי חוק יבשים. במקום זאת, נסח כהנחיות פרקטיות: "אתה צריך לוודא ש...", "מומלץ לעשות...".
5. השתמש באימוג'ים לכל כותרת .
6. סיים עם סיכום קצר וברור: מה הצעדים המרכזיים שעל בעל העסק לעשות עכשיו.`
      },
      {
        role: "user",
        content: `פרטי העסק:
${base}

חוקים רלוונטיים:
${bullets}`
      }
    ],
    temperature: 0.4
  });

  // Return the generated plain-text report
  return resp.choices[0].message.content.trim();
}

module.exports = { generateReport };
