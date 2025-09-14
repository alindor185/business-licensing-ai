# Business Licensing Assessment Tool

## Overview

This project is a proof-of-concept system designed to help business owners in Israel understand regulatory licensing requirements. It processes raw regulatory documents, matches them against business attributes, and generates clear, customized reports with the assistance of AI.

The project demonstrates **end-to-end system design**:
- Data extraction from regulatory documents
- Rule structuring and filtering
- A digital questionnaire (frontend)
- A matching engine (backend)
- AI integration to produce human-readable reports

## Features

### 1. Data Processing
- Extracts rules from a PDF of business regulations
- Converts rules into a structured JSON format
- Supports detection of multi-line rules and rule numbers (e.g., `3.7.1`, `4.2.3.1`)

### 2. Digital Questionnaire
Collects key business attributes:
- Size in square meters
- Number of seats
- Special features (e.g., use of gas, serving alcohol, delivery)

### 3. Matching Engine
- Matches user inputs against the structured rules
- Filters rules by thresholds (size, occupancy) and tags (e.g., alcohol, gas)
- Prioritizes rules based on urgency (`must`, `should`, `nice`)

### 4. AI-Generated Report
- Uses OpenAI's API to convert legal/technical requirements into clear, business-friendly guidance
- Organizes the output into categories (business license, sanitation, fire safety, etc.)
- Produces personalized reports based on the business profile

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js with Express
- **AI Integration:** OpenAI API
- **Data Processing:** `pdf-parse` for PDF text extraction
- **Storage:** JSON file for processed rules

## Project Structure

```
rest_rules/
│
├── client/                 # Frontend (form + report display)
│   ├── index.html
│   ├── styles.css
│   └── main.js
│
├── scripts/                # Data processing scripts
│   └── processRules.js
│
├── server/                 # Backend services
│   ├── server.js           # Express API
│   ├── ai.js               # AI integration
│   └── match.js            # Rule matching logic
│
├── data/
│   ├── 18-07-2022_4.2A.pdf # Source regulations
│   └── rules.json          # Extracted structured rules
│
├── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (>= 18)
- npm

### Install dependencies
```bash
npm install
```

### Process regulatory data
Convert the PDF into structured JSON:
```bash
npm run process
```

**Note:** Make sure to place your regulatory PDF file in the `data/` folder before running this command. The script will process the PDF and generate a `rules.json` file in the same directory.

### Run the server
```bash
npm run dev
```

The application will be available at: http://localhost:3000

## Configuration

### Environment Variables
This project integrates with the OpenAI API to generate customized reports.  
You must configure the following environment variables:

1. Create a file named `.env` in the project root.
2. Add the required variables:

```
OPENAI_API_KEY=your_api_key_here
PORT=3000
```

3. Restart the server after setting the variables.

**Notes:**
- `OPENAI_API_KEY`: Required for AI-generated reports
- `PORT`: Server port (optional, defaults to 3000 if not specified)

⚠️ If no API key is provided, the system runs in **demo mode** and returns rule matches without AI explanations.

## API Endpoints

### `GET /api/rules`
Returns all processed rules (JSON).

### `POST /api/evaluate`
- **Input:** business details
- **Output:** matched rules + AI-generated report

**Example request:**
```json
{
  "name": "Beer Garden",
  "sizeSqm": 600,
  "seats": 400,
  "features": ["alcohol", "delivery"]
}
```

## AI Integration

- **Model:** OpenAI GPT-4o mini
- **Role:** Transforms raw legal text into structured, clear, and practical reports
- **Prompt Design:** Guides the model to output in Hebrew, in plain language, divided into categories

## Deliverables

- Working end-to-end system: from PDF processing → rule matching → AI report generation
- Documented repository with clear code separation
- Customizable rules engine that can be extended for more features or other domains
  <img width="1091" height="649" alt="Screenshot 2025-09-14 105924" src="https://github.com/user-attachments/assets/e9f02d92-8bf7-4602-af02-0817ce19a6cb" />
<img width="801" height="915" alt="Screenshot 2025-09-14 103924" src="https://github.com/user-attachments/assets/f669af5f-df3e-400a-85b8-a6a0a11857ec" />
