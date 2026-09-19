from __future__ import annotations

import hashlib
import hmac
import time
from typing import Optional
from urllib.parse import urlparse

from fastapi import Request

from .config import KNOWLEDGE_SESSION_COOKIE, KNOWLEDGE_SESSION_SECONDS, env


def _admin_token() -> str:
    return env("KNOWLEDGE_ADMIN_TOKEN")


def is_admin_configured() -> bool:
    return len(_admin_token()) >= 16


def is_valid_admin_token(candidate: str) -> bool:
    return is_admin_configured() and hmac.compare_digest(candidate, _admin_token())


def is_trusted_proxy_request(request: Request) -> bool:
    shared_secret = env("PYTHON_API_SHARED_SECRET")
    if not shared_secret:
        return env("APP_ENV", "development").casefold() != "production"
    provided = request.headers.get("x-vrikshcrafts-proxy-key", "")
    return hmac.compare_digest(provided, shared_secret)


def _sign(expires_at: str) -> str:
    return hmac.new(
        _admin_token().encode("utf-8"),
        f"knowledge-admin:{expires_at}".encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def create_admin_session() -> str:
    expires_at = str(int(time.time()) + KNOWLEDGE_SESSION_SECONDS)
    return f"{expires_at}.{_sign(expires_at)}"


def is_admin_request(request: Request) -> bool:
    if not is_admin_configured():
        return False
    value = request.cookies.get(KNOWLEDGE_SESSION_COOKIE, "")
    try:
        expires_at, signature = value.split(".", 1)
        if not expires_at.isdigit() or int(expires_at) <= int(time.time()):
            return False
        return hmac.compare_digest(signature, _sign(expires_at))
    except ValueError:
        return False


def forwarded_host(request: Request) -> str:
    return request.headers.get("x-forwarded-host") or request.headers.get("host", "")


def is_same_origin(request: Request, *, allow_missing: bool = False) -> bool:
    origin = request.headers.get("origin")
    host = forwarded_host(request)
    if not origin or not host:
        return allow_missing
    try:
        return urlparse(origin).netloc.casefold() == host.casefold()
    except ValueError:
        return False
