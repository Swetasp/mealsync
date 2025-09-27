import os
import logging
from typing import Dict, Any
from .base_agent import BaseAgent

try:
    import google.generativeai as genai  # requires google-generativeai in requirements.txt
except Exception:
    genai = None

logger = logging.getLogger(__name__)

class EligibilityAgent(BaseAgent):
    def __init__(self):
        super().__init__(agent_id="eligibility")
        self._setup_gemini()
        # ... your handlers ...

    def _setup_gemini(self):
        # Prefer GOOGLE_GENAI_API_KEY (matches your Cloud Run secret), fallback to GEMINI_API_KEY for local dev
        key = os.getenv("GOOGLE_GENAI_API_KEY") or os.getenv("GEMINI_API_KEY")
        if genai and key:
            try:
                genai.configure(api_key=key)
                logger.info("Gemini configured")
            except Exception as e:
                logger.warning("Gemini config skipped: %s", e)
