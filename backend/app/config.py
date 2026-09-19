from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv


PROJECT_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(PROJECT_ROOT / ".env.local", override=False)

KNOWLEDGE_FILE = PROJECT_ROOT / "knowledge" / "vrikshcrafts-rag-knowledge-base.md"
UPLOAD_DIRECTORY = PROJECT_ROOT / "knowledge" / "uploads"

KNOWLEDGE_SESSION_COOKIE = "vrikshcrafts_knowledge_admin"
KNOWLEDGE_SESSION_SECONDS = 8 * 60 * 60

MAX_KNOWLEDGE_FILE_BYTES = 5_000_000
MAX_DOCUMENT_CHARACTERS = 200_000
MAX_PDF_PAGES = 75
EXTRACTION_TIMEOUT_SECONDS = 12


def env(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def is_production() -> bool:
    return env("APP_ENV", "development").lower() == "production"
