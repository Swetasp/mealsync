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

## Flow
`Intake (address + school)` → `Eligibility Explainer (Gemini)` → `Locator (Maps)` → `Calendar (pickup windows)` → `Push (reminders)` → `Impact (meals secured)`

---

## Tech Stack
- **Google Cloud Run** – serverless microservices  
- **Firestore** – family profiles, sites, reminders  
- **Vertex AI (Gemini)** – plain-language eligibility checks  
- **Google Maps API** – geocoding + site lookup  
- **Google Calendar & Gmail APIs** – scheduling + confirmations  
- **Firebase Cloud Messaging (FCM)** – push notifications  

---

## Quickstart
1. Clone the repo  
   ```bash
   git clone https://github.com/your-org/mealsync.git
   cd mealsync
