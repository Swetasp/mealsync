import logging
from datetime import datetime
from typing import Dict, Any
from .base_agent import BaseAgent
# optional (only if you use them):
# from models import Family
# from database import FirestoreDB
logger = logging.getLogger(__name__)

class IntakeAgent(BaseAgent):
    def __init__(self):
        super().__init__(agent_id="intake")

        @self.on("start_workflow")
        async def _start(payload: Dict[str, Any]):
            # TODO: create Family in DB, etc.
            return {"status": "started", "received_at": datetime.utcnow().isoformat()}

        @self.on("verify_enrollment")
        async def _verify(payload: Dict[str, Any]):
            return {"status": "verified", "note": "school enrollment assumed for demo"}

        @self.on("get_status")
        async def _status(payload: Dict[str, Any]):
            return {"status": "pending", "programs": [], "sites": [], "next_steps": ["Eligibility check"], "monthly_value": 0}
