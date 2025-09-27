# agents/base_agent.py
import asyncio
from typing import Dict, Callable, Awaitable, Optional

class BaseAgent:
    """
    Lightweight base class so agents can register simple async handlers.
    Your A2ACoordinator calls agent.process_message(message), so we
    translate that into handler calls based on payload["action"].
    """
    def __init__(self, agent_id: str = "agent"):
        self.agent_id = agent_id
        self._handlers: Dict[str, Callable[[dict], Awaitable[dict]]] = {}

    def on(self, action: str):
        def deco(fn):
            self._handlers[action] = fn
            return fn
        return deco

    async def handle(self, payload: dict) -> dict:
        action = payload.get("action")
        fn = self._handlers.get(action)
        if fn is None:
            # default no-op so service doesn’t crash
            return {"ok": True, "note": f"No handler for action '{action}'"}
        return await fn(payload)

    async def process_message(self, message) -> Optional[object]:
        """
        Called by A2ACoordinator. Expects `message.payload`.
        Returns a message-like object or None; we mirror the incoming message
        shape with a new payload so the coordinator can append to its log.
        """
        result = await self.handle(message.payload or {})
        # build a shallow response of the same class as incoming message
        resp = message.__class__(
            id=message.id,
            type=message.type,
            sender=self.agent_id,
            receiver=message.sender,
            timestamp=message.timestamp,
            payload=result,
            priority=getattr(message, "priority", None),
            correlation_id=getattr(message, "correlation_id", None),
            ttl=getattr(message, "ttl", None),
        )
        return resp
