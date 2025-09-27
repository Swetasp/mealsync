from typing import Optional, Dict, Any
from models import Family

class FirestoreDB:
    async def initialize(self):
        # wire real Firestore later
        pass

    async def create_family(self, family: Family) -> str:
        # return a fake id for now; replace with Firestore add()
        return "demo-family-id"

    async def get_family(self, family_id: str) -> Optional[Dict[str, Any]]:
        return {"id": family_id, "status": "pending"}

    async def update_family_status(self, family_id: str, status: str, error: str = ""):
        pass
