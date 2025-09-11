# Business Licensing AI 🏢🤖

An AI-powered assistant that helps business owners in Israel understand the regulatory licensing requirements for their business.  
This project was built as a **home exam / interview project**, demonstrating full-stack development, data processing, and AI integration.  

---

## ✨ Features
- 📄 **PDF Processing**: Extracts raw regulatory text from official PDFs and structures it into JSON.  
- 🔎 **Rule Matching Engine**: Matches business details (size, seats, features) to relevant licensing requirements.  
- 🤖 **AI Report Generation**: Uses OpenAI GPT to translate legal/regulatory language into **clear, friendly Hebrew reports**.  
- 💻 **Modern Frontend**: Simple, flat design UI with typewriter animation for results.  
- 🗂 **End-to-End Architecture**: Backend (Node.js + Express), AI integration, and frontend client.  

---

## 🛠 Tech Stack
- **Backend**: Node.js + Express  
- **AI Integration**: OpenAI GPT API  
- **Data Processing**: `pdf-parse`, custom scripts to build `rules.json`  
- **Frontend**: HTML, CSS, Vanilla JS  
- **Other**: dotenv, cors  

---

## 📂 Project Structure
```plaintext
rest_rules/
├── ai.js                  # AI integration with OpenAI
├── match.js               # Rule matching engine
├── server.js              # Express server and API endpoints
├── scripts/
│   └── processRules.js    # PDF → JSON rules processor
├── data/
│   ├── 18-07-2022_4.2A.pdf # Example input PDF (ignored by git)
│   ├── rules.json         # Generated structured rules (ignored by git)
│   └── .gitkeep           # Keeps data folder in repo
├── client/
│   ├── index.html         # UI
│   ├── styles.css         # Modern flat design
│   └── main.js            # Form handling + typewriter effect
├── package.json
└── README.md
🚀 Getting Started

Follow these steps to run the project locally:

1. Clone the repository
git clone https://github.com/alindor185/business-licensing-ai.git
cd business-licensing-ai

2. Install dependencies
npm install

3. Setup environment variables

Create a .env file in the project root and add your OpenAI API key:

OPENAI_API_KEY=your_api_key_here
PORT=3000


⚠️ .env is ignored by git to keep secrets safe.

4. Process the PDF rules

Run the script to extract and structure rules from the provided PDF:

npm run process


This generates data/rules.json.

5. Start the development server
npm run dev


You should see:

✅ Server running on http://localhost:3000

6. Open the app

Navigate to http://localhost:3000
 in your browser.

💡 Usage

Open the app in your browser.

Fill in the business details:

Name

Size (sqm)

Seats

Features (gas, meat, delivery, etc.)

Click "צור דוח" → get a personalized AI-generated licensing report in clear Hebrew.

🔧 Example Output
דוח רישוי לעסק "ביר גארדן"

🍽 רישוי עסק:
כדי לפתוח את העסק "ביר גארדן", עליך להגיש בקשה לרשות המקומית...

🥩 דרישות מיוחדות לבשר:
כיוון שהעסק מגיש בשר, עליך לוודא שהבשר מגיע ממקור מורשה...

📐 Architecture

Flow:

scripts/processRules.js → Extracts and structures rules from PDFs.

match.js → Matches user input against rules.

ai.js → Calls OpenAI GPT to generate friendly report.

server.js → API layer connecting frontend, matching engine, and AI.

client/ → UI for collecting inputs and displaying reports.

📸 Screenshots

(Add screenshots of the form and a sample report here!)

📈 Future Improvements

🌍 Support more languages and regions.

📊 Add dashboard for compliance tracking.

🔎 More advanced NLP-based rule extraction.

🖥 Improved frontend with React/Vue.

👩‍💻 Author

Alin Dor
B.Sc. Computer Science | Bar-Ilan University, 2025
LinkedIn
 | GitHub
