# notifications.py
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        self.sent = []

    async def initialize(self):
        """Initialize notification service (stub)."""
        logger.info("Notification service initialized.")

    async def send_welcome(self, family_id: str):
        """Send a welcome message to a new family."""
        message = {
            "type": "welcome",
            "family_id": family_id,
            "timestamp": datetime.utcnow().isoformat(),
        }
        self.sent.append(message)
        logger.info(f"Welcome notification sent: {message}")
        return True

    async def send_pickup_reminder(self, family_id: str, site_id: str, pickup_time: str):
        """Send a reminder for meal pickup."""
        message = {
            "type": "pickup_reminder",
            "family_id": family_id,
            "site_id": site_id,
            "pickup_time": pickup_time,
            "timestamp": datetime.utcnow().isoformat(),
        }
        self.sent.append(message)
        logger.info(f"Pickup reminder sent: {message}")
        return True
