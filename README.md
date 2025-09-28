# MealSync

**Maximize meal access, reduce stigma.**  
MealSync is an AI-powered system built on Google Cloud that helps families connect with free & reduced school meals. It explains eligibility in plain language, finds nearby pickup sites, and syncs reminders straight into calendars — so no child goes hungry.

---

## Features
- **Eligibility Explainer (Gemini)** – turns program rules into simple guidance.  
- **Meal Site Locator (Maps)** – finds nearby schools & community pickup sites.  
- **Smart Scheduling (Calendar)** – adds recurring pickup events.  
- **Gentle Reminders (FCM/Gmail)** – email or push alerts for pickups.  
- **Impact Tracking** – meals secured, reminders sent, sites used.  

---

## Architecture
mealsync/ # Backend (FastAPI + Google Cloud)
│── main.py # FastAPI entry point
│── agents/ # AI & workflow agents
│── web/ # Static web build served by FastAPI
│── requirements.txt # Backend dependencies
│
└── mealsync-ui/ # Frontend (React + Vite + Tailwind + Firebase)
│── src/ # React source code
│── public/ # Static assets
│── package.json # Frontend dependencies


---

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS, Firebase Auth  
- **Backend:** FastAPI, Python, Firestore, A2A protocol  
- **Cloud:** Google Cloud Run, Firestore, Vertex AI (Gemini), Firebase Cloud Messaging  
- **APIs:** Google Maps API, Google Calendar API, Gmail API  

---

## Quickstart

### Backend (FastAPI)
```bash
cd mealsync
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8080


Backend will be live at:
👉 http://localhost:8080

Health check:

curl http://localhost:8080/health

Frontend (React + Vite)
cd mealsync-ui
npm install
npm run dev


Frontend will be live at:
👉 http://localhost:8080

Production build:

npm run build


The compiled frontend will be placed in /mealsync-ui/dist.
You can copy this into /mealsync/web/ to serve via FastAPI.

## Deployment

Backend: Deploy mealsync on Google Cloud Run.

Frontend: Deploy on Google Cloud Run.

https://mealsync-175402345633.us-central1.run.app

Database: Google Firestore for user + meals data.

AI: Gemini (Vertex AI) for eligibility explanation.