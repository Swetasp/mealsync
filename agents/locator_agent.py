# agents/locator_agent.py
import os
import logging
from typing import Dict, Any, List
from .base_agent import BaseAgent

logger = logging.getLogger(__name__)

class LocatorAgent(BaseAgent):
    def __init__(self):
        super().__init__(agent_id="locator")
        # keep in sync with your deploy flag: --set-secrets MAPS_API_KEY=...
        self.maps_api_key = os.getenv("MAPS_API_KEY")  # not GOOGLE_MAPS_API_KEY

        @self.on("find_sites")
        async def _find(payload: Dict[str, Any]):
            # you can warn if key is missing, but don't crash
            if not self.maps_api_key:
                logger.warning("MAPS_API_KEY not set; returning demo site list")

            loc = payload.get("location", {})
            sites: List[Dict[str, Any]] = [{
                "id": "site-001", "name": "Lincoln Cafeteria",
                "address": "123 Main St", "phone": "(555) 111-2222",
                "distance_miles": 1.2, "meal_types": ["breakfast", "lunch"],
                "accessibility": ["wheelchair", "parking"]
            }]
            return {"sites": sites}

        @self.on("find_best_sites")
        async def _best(payload: Dict[str, Any]):
            return await _find(payload)

        @self.on("get_status")
        async def _status(payload: Dict[str, Any]):
            return {"status": "located", "programs": [], "sites": [], "next_steps": ["Schedule pickup"], "monthly_value": 0}
