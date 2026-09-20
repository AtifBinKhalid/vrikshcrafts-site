from __future__ import annotations

from typing import List

import httpx

from .config import env
from .knowledge import UploadedSource, is_valid_uploaded_source


MAX_PERSISTENT_RESPONSE_BYTES = 6_000_000
MAX_PERSISTENT_SOURCES = 50


async def fetch_persistent_sources() -> List[UploadedSource]:
    url = env("KNOWLEDGE_STORE_URL")
    secret = env("PYTHON_API_SHARED_SECRET")
    if not url or not secret:
        return []

    try:
        async with httpx.AsyncClient(timeout=8.0, follow_redirects=False) as client:
            response = await client.get(
                url,
                headers={
                    "Accept": "application/json",
                    "x-vrikshcrafts-proxy-key": secret,
                },
            )
        response.raise_for_status()
        if len(response.content) > MAX_PERSISTENT_RESPONSE_BYTES:
            raise ValueError("Persistent knowledge response exceeded the safe size limit.")
        payload = response.json()
        values = payload.get("sources") if isinstance(payload, dict) else None
        if not isinstance(values, list):
            raise ValueError("Persistent knowledge response has an invalid shape.")
        return [
            source
            for source in values[:MAX_PERSISTENT_SOURCES]
            if is_valid_uploaded_source(source)
        ]
    except (httpx.HTTPError, ValueError, TypeError) as error:
        print(f"[vrikshcrafts] Persistent knowledge sync failed: {error}")
        return []
