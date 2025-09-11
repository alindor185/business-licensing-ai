# Business Licensing AI 

An AI-powered assistant that helps business owners in Israel understand the regulatory licensing requirements for their business.  
This project was built as a **home exam / interview project**, demonstrating full-stack development, data processing, and AI integration.  

---

## ✨ Features
-  **PDF Processing**: Extracts raw regulatory text from official PDFs and structures it into JSON.  
-  **Rule Matching Engine**: Matches business details (size, seats, features) to relevant licensing requirements.  
-  **AI Report Generation**: Uses OpenAI GPT to translate legal/regulatory language into **clear, friendly Hebrew reports**.  
-  **Modern Frontend**: Simple, flat design UI with typewriter animation for results.  
-  **End-to-End Architecture**: Backend (Node.js + Express), AI integration, and frontend client.  

---

## 🛠 Tech Stack
- **Backend**: Node.js + Express  
- **AI Integration**: OpenAI GPT API  
- **Data Processing**: `pdf-parse`, custom scripts to build `rules.json`  
- **Frontend**: HTML, CSS, Vanilla JS  
- **Other**: dotenv, cors  

---

## 📂 Project Structure
rest_rules/
├── ai.js # AI integration with OpenAI
├── match.js # Rule matching engine
├── server.js # Express server and API endpoints
├── scripts/
│ └── processRules.js # PDF → JSON rules processor
├── data/
│ ├── 18-07-2022_4.2A.pdf # Example input PDF (ignored by git)
│ ├── rules.json # Generated structured rules (ignored by git)
│ └── .gitkeep # Keeps data folder in repo
├── client/
│ ├── index.html # UI
│ ├── styles.css # Modern flat design
│ └── main.js # Form handling + typewriter effect
├── package.json
└── README.md

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/alindor185/business-licensing-ai.git
cd business-licensing-ai
2. Install dependencies
npm install
3. Environment setup

Create a .env file in the root:
OPENAI_API_KEY=your_api_key_here
PORT=3000
4. Process the PDF rules

Run the script to generate structured rules from the provided PDF:

npm run process
5. Start the server
npm run dev
Server will run at: http://localhost:3000

