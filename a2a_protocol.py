import json
import uuid
import asyncio
from datetime import datetime
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict
from enum import Enum
import logging
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)

class MessageType(Enum):
    REQUEST = "request"
    RESPONSE = "response"
    NOTIFICATION = "notification"
    ERROR = "error"
    BROADCAST = "broadcast"

class Priority(Enum):
    LOW = 1
    NORMAL = 2
    HIGH = 3
    CRITICAL = 4

@dataclass
class A2AMessage:
    """Core A2A message structure."""
    id: str
    type: MessageType
    sender: str
    receiver: str
    timestamp: str
    payload: Dict[Any, Any]
    priority: Priority = Priority.NORMAL
    correlation_id: Optional[str] = None
    ttl: Optional[int] = None  # Time to live in seconds
    
    def to_json(self) -> str:
        return json.dumps(asdict(self), default=str)
    
    @classmethod
    def from_json(cls, json_str: str) -> 'A2AMessage':
        data = json.loads(json_str)
        data['type'] = MessageType(data['type'])
        data['priority'] = Priority(data['priority'])
        return cls(**data)

class A2AAgent(ABC):
    """Base class for all A2A agents."""
    
    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.message_queue = asyncio.Queue()
        self.handlers = {}
        self.metrics = {
            "messages_processed": 0,
            "errors": 0,
            "avg_processing_time": 0
        }
    
    @abstractmethod
    async def process_message(self, message: A2AMessage) -> Optional[A2AMessage]:
        """Process incoming message and return response if needed."""
        pass
    
    async def send_message(self, receiver: str, payload: Dict, 
                          message_type: MessageType = MessageType.REQUEST,
                          priority: Priority = Priority.NORMAL) -> A2AMessage:
        """Send a message to another agent."""
        message = A2AMessage(
            id=str(uuid.uuid4()),
            type=message_type,
            sender=self.agent_id,
            receiver=receiver,
            timestamp=datetime.utcnow().isoformat(),
            payload=payload,
            priority=priority
        )
        return message
    
    def register_handler(self, action: str, handler):
        """Register a handler for a specific action."""
        self.handlers[action] = handler
    
    async def handle_action(self, action: str, data: Dict) -> Dict:
        """Handle a specific action with registered handler."""
        if action in self.handlers:
            return await self.handlers[action](data)
        else:
            raise ValueError(f"No handler for action: {action}")
    
    def update_metrics(self, processing_time: float, error: bool = False):
        """Update agent metrics."""
        self.metrics["messages_processed"] += 1
        if error:
            self.metrics["errors"] += 1
        
        # Update average processing time
        n = self.metrics["messages_processed"]
        avg = self.metrics["avg_processing_time"]
        self.metrics["avg_processing_time"] = (avg * (n-1) + processing_time) / n

class A2ACoordinator:
    """Central coordinator for A2A message routing."""
    
    def __init__(self):
        self.agents: Dict[str, A2AAgent] = {}
        self.message_log: List[A2AMessage] = []
        self.workflows: Dict[str, Dict] = {}
        self.running = False
    
    def register_agent(self, agent_id: str, agent: A2AAgent):
        """Register an agent with the coordinator."""
        self.agents[agent_id] = agent
        logger.info(f"Registered agent: {agent_id}")
    
    async def send_message(self, sender: str, receiver: str, 
                          message_type: MessageType, payload: Dict) -> A2AMessage:
        """Route a message between agents."""
        message = A2AMessage(
            id=str(uuid.uuid4()),
            type=message_type,
            sender=sender,
            receiver=receiver,
            timestamp=datetime.utcnow().isoformat(),
            payload=payload
        )
        
        # Log message
        self.message_log.append(message)
        
        # Route to receiver
        if receiver in self.agents:
            response = await self.agents[receiver].process_message(message)
            if response:
                self.message_log.append(response)
            return response or message
        else:
            logger.error(f"Unknown receiver: {receiver}")
            return message
    
    async def broadcast_message(self, sender: str, payload: Dict, 
                               exclude: List[str] = None):
        """Broadcast a message to all agents."""
        exclude = exclude or []
        tasks = []
        
        for agent_id, agent in self.agents.items():
            if agent_id not in exclude and agent_id != sender:
                message = A2AMessage(
                    id=str(uuid.uuid4()),
                    type=MessageType.BROADCAST,
                    sender=sender,
                    receiver=agent_id,
                    timestamp=datetime.utcnow().isoformat(),
                    payload=payload
                )
                tasks.append(agent.process_message(message))
        
        await asyncio.gather(*tasks)
    
    async def get_workflow_status(self, workflow_id: str) -> Dict:
        """Get status of a workflow across all agents."""
        status = {
            "workflow_id": workflow_id,
            "status": "unknown",
            "programs": [],
            "sites": [],
            "next_steps": [],
            "monthly_value": 0
        }
        
        # Query each agent for workflow status
        for agent_id, agent in self.agents.items():
            try:
                response = await self.send_message(
                    sender="coordinator",
                    receiver=agent_id,
                    message_type=MessageType.REQUEST,
                    payload={
                        "action": "get_status",
                        "workflow_id": workflow_id
                    }
                )
                
                if response and response.payload:
                    # Merge status data
                    if "status" in response.payload:
                        status["status"] = response.payload["status"]
                    if "programs" in response.payload:
                        status["programs"].extend(response.payload["programs"])
                    if "sites" in response.payload:
                        status["sites"].extend(response.payload["sites"])
                    if "next_steps" in response.payload:
                        status["next_steps"].extend(response.payload["next_steps"])
                    if "monthly_value" in response.payload:
                        status["monthly_value"] += response.payload["monthly_value"]
                        
            except Exception as e:
                logger.error(f"Error getting status from {agent_id}: {e}")
        
        return status
    
    async def start(self):
        """Start the coordinator."""
        self.running = True
        logger.info("A2A Coordinator started")
        
        # Start message processing loop
        while self.running:
            await asyncio.sleep(1)
            # Process any pending messages
            # In production, this would handle message queuing and routing
    
    async def stop(self):
        """Stop the coordinator."""
        self.running = False
        logger.info("A2A Coordinator stopped")
    
    def get_metrics(self) -> Dict:
        """Get metrics from all agents."""
        metrics = {}
        for agent_id, agent in self.agents.items():
            metrics[agent_id] = agent.metrics
        metrics["total_messages"] = len(self.message_log)
        return metrics

# Specialized Message Types

@dataclass(kw_only=True)
class EligibilityRequest(A2AMessage):
    """Specialized message for eligibility checks."""
    family_id: str
    income_data: Dict
    program_preferences: List[str]

@dataclass(kw_only=True)
class SiteLocationRequest(A2AMessage):
    """Specialized message for site location requests."""
    location: Dict
    radius: float
    meal_types: List[str]
    accessibility_needs: List[str]

@dataclass(kw_only=True)
class NotificationRequest(A2AMessage):
    """Specialized message for notification requests."""
    recipient_id: str
    notification_type: str
    channels: List[str]  # email, sms, push
    content: Dict
    schedule_time: Optional[str] = None

