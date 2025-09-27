# agents/calendar_agent.py

class CalendarAgent:
    def __init__(self):
        self.events = {}

    async def process_message(self, message):
        action = message.payload.get("action")
        if action in ("schedule_pickup", "suggest_schedule"):
            # Fake calendar event creation
            event_id = f"evt-{message.payload.get('family_id', 'demo')}-123"
            return message.__class__(
                id=message.id,
                type=message.type,
                sender="calendar",
                receiver=message.sender,
                timestamp=message.timestamp,
                payload={
                    "event_id": event_id,
                    "confirmation": "CONFIRM123",
                    "qr_code": None,
                }
            )
        elif action == "get_status":
            return message.__class__(
                id=message.id,
                type=message.type,
                sender="calendar",
                receiver=message.sender,
                timestamp=message.timestamp,
                payload={
                    "status": "scheduled",
                    "programs": [],
                    "sites": [],
                    "next_steps": ["Pickup meal at scheduled time"],
                    "monthly_value": 0,
                }
            )
        return None
