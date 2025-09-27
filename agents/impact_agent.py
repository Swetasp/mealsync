# agents/impact_agent.py

from datetime import datetime

class ImpactAgent:
    def __init__(self):
        self.metrics = {
            "families_enrolled": 10,
            "meals_scheduled": 25,
            "meals_picked_up": 18,
        }

    async def process_message(self, message):
        action = message.payload.get("action")
        if action == "generate_metrics":
            return message.__class__(
                id=message.id,
                type=message.type,
                sender="impact",
                receiver=message.sender,
                timestamp=datetime.utcnow().isoformat(),
                payload={
                    "families_enrolled": self.metrics["families_enrolled"],
                    "meals_scheduled": self.metrics["meals_scheduled"],
                    "meals_picked_up": self.metrics["meals_picked_up"],
                    "impact_value": self.metrics["meals_picked_up"] * 5,  # pretend $5/meal
                }
            )
        elif action == "record_enrollment":
            self.metrics["families_enrolled"] += 1
            return message
        elif action == "get_status":
            return message.__class__(
                id=message.id,
                type=message.type,
                sender="impact",
                receiver=message.sender,
                timestamp=datetime.utcnow().isoformat(),
                payload={
                    "status": "tracking",
                    "programs": [],
                    "sites": [],
                    "next_steps": ["Review dashboard for impact"],
                    "monthly_value": 50,
                }
            )
        return None
