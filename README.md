Business Licensing Assessment Tool
Overview

This project is a proof-of-concept system designed to help business owners in Israel understand regulatory licensing requirements. It processes raw regulatory documents, matches them against business attributes, and generates clear, customized reports with the assistance of AI.

The project demonstrates end-to-end system design:

Data extraction from regulatory documents

Rule structuring and filtering

A digital questionnaire (frontend)

A matching engine (backend)

AI integration to produce human-readable reports

Features

Data Processing

Extracts rules from a PDF of business regulations.

Converts rules into a structured JSON format.

Supports detection of multi-line rules and rule numbers (e.g., 3.7.1, 4.2.3.1).

Digital Questionnaire

Collects key business attributes:

Size in square meters

Number of seats

Special features (e.g., use of gas, serving alcohol, delivery)

Matching Engine

Matches user inputs against the structured rules.

Filters rules by thresholds (size, occupancy) and tags (e.g., alcohol, gas).

Prioritizes rules based on urgency (must, should, nice).

AI-Generated Report

Uses OpenAI’s API to convert legal/technical requirements into clear, business-friendly guidance.

Organizes the output into categories (business license, sanitation, fire safety, etc.).

Produces personalized reports based on the business profile.

Tech Stack

Frontend: HTML, CSS, Vanilla JavaScript

Backend: Node.js with Express

AI Integration: OpenAI API

Data Processing: pdf-parse for PDF text extraction

Storage: JSON file for processed rules

Project Structure
rest_rules/
│
├── client/                # Frontend (form + report display)
│   ├── index.html
│   ├── styles.css
│   └── main.js
│
├── scripts/               # Data processing scripts
│   └── processRules.js
│
├── server/                # Backend services
│   ├── server.js          # Express API
│   ├── ai.js              # AI integration
│   └── match.js           # Rule matching logic
│
├── data/
│   ├── 18-07-2022_4.2A.pdf  # Source regulations
│   └── rules.json           # Extracted structured rules
│
├── package.json
└── README.md

Installation & Setup
Prerequisites

Node.js (>= 18)

npm

Install dependencies
npm install

Process regulatory data

Convert the PDF into structured JSON:

npm run process

Run the server
npm run dev


The application will be available at:
http://localhost:3000

API Endpoints

GET /api/rules
Returns all processed rules (JSON).

POST /api/evaluate
Input: business details
Output: matched rules + AI-generated report

Example request:

{
  "name": "Beer Garden",
  "sizeSqm": 600,
  "seats": 400,
  "features": ["alcohol", "delivery"]
}

AI Integration

Model: OpenAI GPT-4o mini

Role: Transforms raw legal text into structured, clear, and practical reports.

Prompt Design: Guides the model to output in Hebrew, in plain language, divided into categories.

Deliverables

Working end-to-end system: from PDF processing → rule matching → AI report generation.

Documented repository with clear code separation.

Customizable rules engine that can be extended for more features or other domains.
