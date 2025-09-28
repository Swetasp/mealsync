from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from fastapi import Depends, Header

from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
import asyncio
import os
import logging
from google.cloud import firestore
from google.cloud import secretmanager
import google.auth

from models import Family, MealSite, Application, Notification
from database import FirestoreDB
from notifications import NotificationService
from agents import (
    IntakeAgent, EligibilityAgent, PrefillAgent,
    LocatorAgent, CalendarAgent, ImpactAgent
)
from a2a_protocol import A2ACoordinator, MessageType

import firebase_admin
from firebase_admin import auth as fb_auth, credentials

# Initialize Admin SDK (ADC on Cloud Run; locally you can set GOOGLE_APPLICATION_CREDENTIALS)
if not firebase_admin._apps:
    try:
        firebase_admin.initialize_app()  # uses ADC
    except Exception:
        # Fallback if you want to use a local service account file:
        sa_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        if sa_path and os.path.exists(sa_path):
            firebase_admin.initialize_app(credentials.Certificate(sa_path))
        else:
            firebase_admin.initialize_app()

async def get_current_user(authorization: str = Header(None)):
    """
    Expects Authorization: Bearer <FirebaseIDToken>
    Returns Firebase decoded token (dict) or raises 401.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1]
    try:
        decoded = fb_auth.verify_id_token(token)
        return decoded  # contains uid, email, etc.
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
    
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="SchoolMeals A2A",
    description="Maximizing meal access, reducing stigma",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Services
db = FirestoreDB()
notification_service = NotificationService()
a2a_coordinator = A2ACoordinator()

# Agents
intake_agent = IntakeAgent()
eligibility_agent = EligibilityAgent()
prefill_agent = PrefillAgent()
locator_agent = LocatorAgent()
calendar_agent = CalendarAgent()
impact_agent = ImpactAgent()

# Register agents
a2a_coordinator.register_agent("intake", intake_agent)
a2a_coordinator.register_agent("eligibility", eligibility_agent)
a2a_coordinator.register_agent("prefill", prefill_agent)
a2a_coordinator.register_agent("locator", locator_agent)
a2a_coordinator.register_agent("calendar", calendar_agent)
a2a_coordinator.register_agent("impact", impact_agent)

# ----- Models (requests/responses) -----
class IntakeRequest(BaseModel):
    address: str
    school_name: str
    family_size: int
    contact_email: str
    contact_phone: Optional[str]
    preferred_language: str = "en"
    children_ages: List[int]

class EligibilityCheckRequest(BaseModel):
    family_id: str
    household_income: Optional[float]
    snap_recipient: bool = False
    tanf_recipient: bool = False
    wic_recipient: bool = False

class ApplicationStatusResponse(BaseModel):
    family_id: str
    status: str  # pending, approved, needs_info
    eligible_programs: List[str]
    nearest_sites: List[Dict]
    next_steps: List[str]
    estimated_benefit_value: float

# ----- API Endpoints (keep these BEFORE mounting static) -----

@app.post("/api/intake")
async def start_intake(request: IntakeRequest, background_tasks: BackgroundTasks):
    try:
        family = Family(
            address=request.address,
            school_name=request.school_name,
            family_size=request.family_size,
            contact_email=request.contact_email,
            contact_phone=request.contact_phone,
            preferred_language=request.preferred_language,
            children_ages=request.children_ages,
            created_at=datetime.utcnow()
        )
        family_id = await db.create_family(family)

        workflow_message = {
            "action": "start_workflow",
            "family_id": family_id,
            "data": request.dict()
        }

        await a2a_coordinator.send_message(
            sender="api",
            receiver="intake",
            message_type=MessageType.REQUEST,
            payload=workflow_message
        )

        background_tasks.add_task(process_intake_workflow, family_id, request.dict())

        return {
            "success": True,
            "family_id": family_id,
            "message": "Application started successfully",
            "next_steps": [
                "Verifying school enrollment",
                "Checking eligibility for programs",
                "Finding nearby meal sites"
            ]
        }
    except Exception as e:
        logger.error(f"Intake error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/eligibility/check")
async def check_eligibility(request: EligibilityCheckRequest):
    try:
        eligibility_message = {
            "action": "check_eligibility",
            "family_id": request.family_id,
            "income_data": {
                "household_income": request.household_income,
                "snap": request.snap_recipient,
                "tanf": request.tanf_recipient,
                "wic": request.wic_recipient
            }
        }

        response = await a2a_coordinator.send_message(
            sender="api",
            receiver="eligibility",
            message_type=MessageType.REQUEST,
            payload=eligibility_message
        )

        explanation = response.payload.get("explanation", {})
        eligible_programs = response.payload.get("eligible_programs", [])

        return {
            "eligible": len(eligible_programs) > 0,
            "programs": eligible_programs,
            "explanation": explanation,
            "confidence": response.payload.get("confidence", 0.95),
            "documentation_needed": response.payload.get("documentation_needed", [])
        }
    except Exception as e:
        logger.error(f"Eligibility check error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sites/nearby")
async def find_nearby_sites(
    latitude: float,
    longitude: float,
    radius_miles: float = 5.0,
    meal_type: Optional[str] = None
):
    try:
        locator_message = {
            "action": "find_sites",
            "location": {"lat": latitude, "lng": longitude},
            "radius_miles": radius_miles,
            "filters": {"meal_type": meal_type, "open_now": True}
        }

        response = await a2a_coordinator.send_message(
            sender="api",
            receiver="locator",
            message_type=MessageType.REQUEST,
            payload=locator_message
        )

        sites = response.payload.get("sites", [])
        for site in sites:
            site["current_wait_time"] = await get_site_wait_time(site["id"])
            site["meals_available"] = await get_meals_available(site["id"])

        return {
            "sites": sites,
            "total_found": len(sites),
            "search_radius": radius_miles,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Site locator error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/calendar/schedule")
async def schedule_pickup(
    family_id: str,
    site_id: str,
    pickup_date: str,
    meal_type: str = "all"
):
    try:
        calendar_message = {
            "action": "schedule_pickup",
            "family_id": family_id,
            "site_id": site_id,
            "pickup_date": pickup_date,
            "meal_type": meal_type
        }

        response = await a2a_coordinator.send_message(
            sender="api",
            receiver="calendar",
            message_type=MessageType.REQUEST,
            payload=calendar_message
        )

        await notification_service.send_pickup_reminder(
            family_id=family_id,
            site_id=site_id,
            pickup_time=pickup_date
        )

        return {
            "success": True,
            "calendar_event_id": response.payload.get("event_id"),
            "confirmation_number": response.payload.get("confirmation"),
            "reminder_set": True,
            "qr_code": response.payload.get("qr_code")
        }
    except Exception as e:
        logger.error(f"Scheduling error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/impact/dashboard")
async def impact_dashboard():
    try:
        impact_message = {"action": "generate_metrics", "period": "current_month"}
        response = await a2a_coordinator.send_message(
            sender="api",
            receiver="impact",
            message_type=MessageType.REQUEST,
            payload=impact_message
        )
        return response.payload
    except Exception as e:
        logger.error(f"Impact dashboard error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/application/status/{family_id}")
async def get_application_status(family_id: str):
    try:
        family = await db.get_family(family_id)
        if not family:
            raise HTTPException(status_code=404, detail="Family not found")

        status_data = await a2a_coordinator.get_workflow_status(family_id)

        return ApplicationStatusResponse(
            family_id=family_id,
            status=status_data["status"],
            eligible_programs=status_data["programs"],
            nearest_sites=status_data["sites"][:5],
            next_steps=status_data["next_steps"],
            estimated_benefit_value=status_data["monthly_value"]
        )
    except Exception as e:
        logger.error(f"Status check error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ----- Utility / health -----

# app.mount("/", StaticFiles(directory="web", html=True), name="static")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Background workflow
async def process_intake_workflow(family_id: str, intake_data: dict):
    try:
        await a2a_coordinator.send_message(
            sender="workflow",
            receiver="intake",
            message_type=MessageType.REQUEST,
            payload={"action": "verify_enrollment", "family_id": family_id}
        )
        await a2a_coordinator.send_message(
            sender="workflow",
            receiver="eligibility",
            message_type=MessageType.REQUEST,
            payload={"action": "auto_check", "family_id": family_id}
        )
        await a2a_coordinator.send_message(
            sender="workflow",
            receiver="prefill",
            message_type=MessageType.REQUEST,
            payload={"action": "prefill_application", "family_id": family_id}
        )
        await a2a_coordinator.send_message(
            sender="workflow",
            receiver="locator",
            message_type=MessageType.REQUEST,
            payload={"action": "find_best_sites", "family_id": family_id}
        )
        await a2a_coordinator.send_message(
            sender="workflow",
            receiver="calendar",
            message_type=MessageType.REQUEST,
            payload={"action": "suggest_schedule", "family_id": family_id}
        )
        await a2a_coordinator.send_message(
            sender="workflow",
            receiver="impact",
            message_type=MessageType.REQUEST,
            payload={"action": "record_enrollment", "family_id": family_id}
        )
        await notification_service.send_welcome(family_id)
    except Exception as e:
        logger.error(f"Workflow processing error: {e}")
        await db.update_family_status(family_id, "error", str(e))

async def get_site_wait_time(site_id: str) -> int:
    return 5

async def get_meals_available(site_id: str) -> dict:
    return {"breakfast": 150, "lunch": 200, "supper": 100, "snacks": 300}

# Startup
@app.on_event("startup")
async def startup_event():
    logger.info("Starting SchoolMeals A2A system...")
    asyncio.create_task(a2a_coordinator.start())
    await db.initialize()
    await notification_service.initialize()
    logger.info("SchoolMeals A2A system started successfully")

# ---------- Mount static site LAST ----------
# This serves files from ./web and falls back to index.html (SPA)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))           # …/mealSync/mealsync
WEB_DIR  = os.path.join(BASE_DIR, "web")   
app.mount("/", StaticFiles(directory="web", html=True), name="web")

@app.get("/api/me")
async def who_am_i(user=Depends(get_current_user)):
    return {
        "uid": user.get("uid"),
        "email": user.get("email"),
        "name": user.get("name"),
        "picture": user.get("picture"),
        "provider": user.get("firebase", {}).get("sign_in_provider")
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
