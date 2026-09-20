from __future__ import annotations

import asyncio
import re
import threading
import time
import unicodedata
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple
from urllib.parse import urlparse

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.datastructures import UploadFile

from .answering import (
    build_retrieval_query,
    conversational_reply,
    local_answer,
    suggested_follow_ups,
)
from .chunking import chunk_knowledge_text
from .contact import deliver_contact_email, validate_contact_payload
from .config import (
    KNOWLEDGE_SESSION_COOKIE,
    KNOWLEDGE_SESSION_SECONDS,
    MAX_KNOWLEDGE_FILE_BYTES,
    env,
    is_production,
)
from .documents import extract_file, is_supported_file
from .knowledge import (
    delete_uploaded_source,
    get_knowledge_snapshot,
    list_uploaded_sources,
    load_core_knowledge,
    save_uploaded_source,
)
from .openrouter import generate_grounded_answer, is_configured as is_openrouter_configured
from .persistent_knowledge import fetch_persistent_sources
from .retrieval import retrieve_knowledge
from .security import (
    create_admin_session,
    is_admin_configured,
    is_admin_request,
    is_same_origin,
    is_trusted_proxy_request,
    is_valid_admin_token,
)


app = FastAPI(
    title="vrikshcrafts AI service",
    version="1.0.0",
    docs_url=None if is_production() else "/docs",
    redoc_url=None,
)

MAX_BODY_BYTES = 12_000
MAX_CONTACT_BODY_BYTES = 20_000
RATE_LIMIT_WINDOW_SECONDS = 15 * 60
RATE_LIMIT_MAX_REQUESTS = 12
CONTACT_RATE_LIMIT_MAX_REQUESTS = 5
DEFAULT_DAILY_MODEL_LIMIT = 45
MAX_TITLE_LENGTH = 120
MAX_KEYWORDS_LENGTH = 500

_rate_limits: Dict[str, Tuple[int, float]] = {}
_contact_rate_limits: Dict[str, Tuple[int, float]] = {}
_daily_model_usage: Dict[str, object] = {"date": "", "count": 0}
_state_lock = threading.Lock()


def json_response(body: Dict[str, object], status: int = 200, headers: Optional[Dict[str, str]] = None) -> JSONResponse:
    response_headers = {"Cache-Control": "no-store", **(headers or {})}
    return JSONResponse(body, status_code=status, headers=response_headers)


def _client_address(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "").split(",")[0].strip()
    return forwarded or request.headers.get("x-real-ip") or (request.client.host if request.client else "unknown")


def _check_rate_limit(
    store: Dict[str, Tuple[int, float]], key: str, maximum: int
) -> Tuple[bool, int]:
    now = time.time()
    with _state_lock:
        count, reset_at = store.get(key, (0, now + RATE_LIMIT_WINDOW_SECONDS))
        if reset_at <= now:
            count, reset_at = 0, now + RATE_LIMIT_WINDOW_SECONDS
        count += 1
        store[key] = (count, reset_at)
    return count > maximum, max(1, int(reset_at - now + 0.999))


def _declared_content_length(request: Request) -> int:
    try:
        return max(0, int(request.headers.get("content-length") or 0))
    except ValueError:
        return 0


def _has_daily_model_capacity() -> bool:
    today = datetime.now(timezone.utc).date().isoformat()
    try:
        configured = int(env("OPENROUTER_DAILY_REQUEST_LIMIT", str(DEFAULT_DAILY_MODEL_LIMIT)))
        limit = configured if configured > 0 else DEFAULT_DAILY_MODEL_LIMIT
    except ValueError:
        limit = DEFAULT_DAILY_MODEL_LIMIT
    with _state_lock:
        if _daily_model_usage["date"] != today:
            _daily_model_usage.update({"date": today, "count": 0})
        if int(_daily_model_usage["count"]) >= limit:
            return False
        _daily_model_usage["count"] = int(_daily_model_usage["count"]) + 1
    return True


def _read_text(value: object) -> str:
    return value.strip() if isinstance(value, str) else ""


def _valid_visitor_name(name: str) -> bool:
    if not name or len(name) > 40 or not name[0].isalpha():
        return False
    return all(
        character.isalpha()
        or unicodedata.category(character).startswith("M")
        or character in "' -"
        for character in name
    )


def _validate_chat(payload: object) -> Tuple[Optional[Dict[str, object]], Optional[str]]:
    if not isinstance(payload, dict):
        return None, "Please send a valid chat request."
    if _read_text(payload.get("website")):
        return {"spam": True, "message": "", "history": [], "visitorName": ""}, None
    message = _read_text(payload.get("message"))
    if len(message) < 2 or len(message) > 600:
        return None, "Your question must be between 2 and 600 characters."
    visitor_name = _read_text(payload.get("visitorName"))
    if visitor_name and not _valid_visitor_name(visitor_name):
        return None, "The visitor name is invalid."
    raw_history = payload.get("history") if isinstance(payload.get("history"), list) else []
    if len(raw_history) > 8:
        return None, "The conversation history is too long."
    history: List[Dict[str, str]] = []
    for item in raw_history:
        if not isinstance(item, dict) or item.get("role") not in {"user", "assistant"}:
            return None, "The conversation history is invalid."
        content = _read_text(item.get("content"))
        if not content or len(content) > 1_000:
            return None, "The conversation history is invalid."
        history.append({"role": str(item["role"]), "content": content})
    return {
        "spam": False,
        "message": message,
        "history": history,
        "visitorName": visitor_name,
    }, None


def _require_admin(request: Request) -> Optional[JSONResponse]:
    if not is_admin_configured():
        return json_response(
            {"error": "Knowledge Studio is not configured. Set KNOWLEDGE_ADMIN_TOKEN to a private value of at least 16 characters."},
            503,
        )
    if not is_admin_request(request):
        return json_response({"error": "Admin authentication is required."}, 401)
    return None


def _require_trusted_proxy(request: Request) -> Optional[JSONResponse]:
    if is_trusted_proxy_request(request):
        return None
    return json_response({"error": "The API proxy is not authorized."}, 403)


def _normalize_source_url(value: str) -> Optional[str]:
    candidate = value.strip() or "/contact"
    if candidate.startswith("/") and not candidate.startswith("//"):
        return candidate
    parsed = urlparse(candidate)
    return candidate if parsed.scheme == "https" and parsed.netloc else None


def _slugify(value: str) -> str:
    normalized = "".join(
        character
        for character in unicodedata.normalize("NFKD", value)
        if not unicodedata.combining(character)
    ).casefold()
    slug = re.sub(r"[^a-z0-9]+", "-", normalized).strip("-")[:48]
    return slug or "knowledge"


@app.get("/health")
async def health() -> Dict[str, object]:
    return {"status": "ok", "service": "vrikshcrafts-ai"}


@app.post("/api/chat")
async def chat(request: Request) -> JSONResponse:
    try:
        proxy_rejection = _require_trusted_proxy(request)
        if proxy_rejection:
            return proxy_rejection
        if not is_same_origin(request, allow_missing=True):
            return json_response({"error": "Cross-site chat requests are not allowed."}, 403)
        if "application/json" not in request.headers.get("content-type", ""):
            return json_response({"error": "Unsupported request format."}, 415)
        declared_length = _declared_content_length(request)
        if declared_length > MAX_BODY_BYTES:
            return json_response({"error": "The chat request is too large."}, 413)
        raw_body = await request.body()
        if len(raw_body) > MAX_BODY_BYTES:
            return json_response({"error": "The chat request is too large."}, 413)
        try:
            payload = __import__("json").loads(raw_body)
        except (ValueError, UnicodeDecodeError):
            return json_response({"error": "Please send a valid chat request."}, 400)
        validated, error = _validate_chat(payload)
        if error:
            return json_response({"error": error}, 400)
        if validated["spam"]:
            return json_response({"answer": "Thank you.", "sources": []})
        limited, retry_after = _check_rate_limit(
            _rate_limits, _client_address(request), RATE_LIMIT_MAX_REQUESTS
        )
        if limited:
            return json_response(
                {"error": "Too many questions were sent. Please wait and try again."},
                429,
                {"Retry-After": str(retry_after)},
            )
        question = str(validated["message"])
        visitor_name = str(validated["visitorName"])
        conversation = conversational_reply(question, visitor_name)
        if conversation:
            conversation_answer, conversation_suggestions = conversation
            return json_response(
                {
                    "answer": conversation_answer,
                    "mode": "conversation",
                    "sources": [],
                    "suggestions": conversation_suggestions,
                }
            )
        retrieval_query = build_retrieval_query(question, validated["history"])
        persistent_sources = await fetch_persistent_sources()
        sources = [
            source
            for source in retrieve_knowledge(
                retrieval_query, limit=6, additional_sources=persistent_sources
            )
            if source.get("id") != "chatbot-answer-policy"
        ][:5]
        answer: Optional[str] = None
        mode = "local-retrieval"
        if sources and is_openrouter_configured():
            if not _has_daily_model_capacity():
                return json_response(
                    {"error": "The assistant has reached today's model limit. Please use the enquiry form or try again tomorrow."},
                    429,
                )
            try:
                answer = await generate_grounded_answer(
                    question=question,
                    history=validated["history"],
                    sources=sources,
                    visitor_name=visitor_name,
                )
                mode = "model-rag"
            except Exception as generation_error:
                print(f"[vrikshcrafts] Chat generation failed: {generation_error}")
                mode = "retrieval-fallback"
        answer = answer or local_answer(
            question, sources, visitor_name, retrieval_query=retrieval_query
        )
        return json_response(
            {
                "answer": answer,
                "mode": mode,
                "sources": [
                    {"id": source["id"], "title": source["title"], "url": source["url"]}
                    for source in sources[:3]
                ],
                "suggestions": suggested_follow_ups(sources),
            }
        )
    except Exception as request_error:
        print(f"[vrikshcrafts] Chat request failed: {request_error}")
        return json_response(
            {"error": "The assistant is temporarily unavailable. Please try again."}, 500
        )


@app.post("/api/contact")
async def contact(request: Request) -> JSONResponse:
    try:
        proxy_rejection = _require_trusted_proxy(request)
        if proxy_rejection:
            return proxy_rejection
        if not is_same_origin(request, allow_missing=True):
            return json_response({"success": False, "error": "Cross-site requests are not allowed."}, 403)
        if "application/json" not in request.headers.get("content-type", ""):
            return json_response({"success": False, "error": "Unsupported request format."}, 415)
        if _declared_content_length(request) > MAX_CONTACT_BODY_BYTES:
            return json_response({"success": False, "error": "The enquiry is too large."}, 413)
        raw_body = await request.body()
        if len(raw_body) > MAX_CONTACT_BODY_BYTES:
            return json_response({"success": False, "error": "The enquiry is too large."}, 413)
        try:
            payload = __import__("json").loads(raw_body)
        except (ValueError, UnicodeDecodeError):
            return json_response({"success": False, "error": "Please submit a valid enquiry."}, 400)
        data, validation_error, spam = validate_contact_payload(payload)
        if validation_error:
            return json_response({"success": False, "error": validation_error}, 400)
        if spam:
            return json_response({"success": True})
        limited, retry_after = _check_rate_limit(
            _contact_rate_limits, _client_address(request), CONTACT_RATE_LIMIT_MAX_REQUESTS
        )
        if limited:
            return json_response(
                {"success": False, "error": "Too many enquiries were submitted. Please wait and try again."},
                429,
                {"Retry-After": str(retry_after)},
            )
        smtp_host = env("SMTP_HOST")
        smtp_user = env("SMTP_USER")
        smtp_pass = env("SMTP_PASS")
        smtp_from = env("SMTP_FROM")
        smtp_to = env("SMTP_TO")
        try:
            smtp_port = int(env("SMTP_PORT", "587"))
        except ValueError:
            smtp_port = 0
        if not all([smtp_host, smtp_user, smtp_pass, smtp_from, smtp_to]) or smtp_port <= 0:
            print("[vrikshcrafts] Contact email service is not configured.")
            return json_response(
                {"success": False, "error": "Our enquiry service is temporarily unavailable. Please email us directly."},
                503,
            )
        if data is None:
            return json_response({"success": False, "error": "Please submit a valid enquiry."}, 400)
        await asyncio.to_thread(
            deliver_contact_email,
            data,
            smtp_host=smtp_host,
            smtp_port=smtp_port,
            smtp_user=smtp_user,
            smtp_pass=smtp_pass,
            smtp_from=smtp_from,
            smtp_to=smtp_to,
        )
        print("[vrikshcrafts] Contact enquiry delivered.")
        return json_response({"success": True})
    except Exception as delivery_error:
        print(f"[vrikshcrafts] Contact delivery failed: {delivery_error}")
        return json_response(
            {"success": False, "error": "We could not send your enquiry. Please try again or email us directly."},
            502,
        )


@app.get("/api/admin/knowledge/session")
async def session_status(request: Request) -> JSONResponse:
    proxy_rejection = _require_trusted_proxy(request)
    if proxy_rejection:
        return proxy_rejection
    return json_response(
        {"configured": is_admin_configured(), "authenticated": is_admin_request(request)}
    )


@app.post("/api/admin/knowledge/session")
async def login(request: Request) -> JSONResponse:
    proxy_rejection = _require_trusted_proxy(request)
    if proxy_rejection:
        return proxy_rejection
    if not is_same_origin(request):
        return json_response({"error": "Cross-site requests are not allowed."}, 403)
    if not is_admin_configured():
        return json_response(
            {"error": "Knowledge Studio is not configured. Set KNOWLEDGE_ADMIN_TOKEN to a private value of at least 16 characters."},
            503,
        )
    try:
        body = await request.json()
    except ValueError:
        body = None
    token = body.get("token") if isinstance(body, dict) else None
    if not isinstance(token, str) or not is_valid_admin_token(token):
        return json_response({"error": "The admin passphrase is incorrect."}, 401)
    response = json_response({"authenticated": True})
    response.set_cookie(
        KNOWLEDGE_SESSION_COOKIE,
        create_admin_session(),
        httponly=True,
        samesite="strict",
        secure=is_production(),
        max_age=KNOWLEDGE_SESSION_SECONDS,
        path="/",
    )
    return response


@app.delete("/api/admin/knowledge/session")
async def logout(request: Request) -> JSONResponse:
    proxy_rejection = _require_trusted_proxy(request)
    if proxy_rejection:
        return proxy_rejection
    if not is_same_origin(request):
        return json_response({"error": "Cross-site requests are not allowed."}, 403)
    response = json_response({"authenticated": False})
    response.delete_cookie(KNOWLEDGE_SESSION_COOKIE, path="/")
    return response


@app.get("/api/admin/knowledge")
async def knowledge_dashboard(request: Request) -> JSONResponse:
    proxy_rejection = _require_trusted_proxy(request)
    if proxy_rejection:
        return proxy_rejection
    rejection = _require_admin(request)
    if rejection:
        return rejection
    sources = list_uploaded_sources()
    documents, _ = get_knowledge_snapshot()
    core_count = len(load_core_knowledge())
    return json_response(
        {
            "coreChunkCount": core_count,
            "uploadedChunkCount": len(documents) - core_count,
            "totalChunkCount": len(documents),
            "sources": sources,
        }
    )


@app.post("/api/admin/knowledge")
async def upload_knowledge(request: Request) -> JSONResponse:
    proxy_rejection = _require_trusted_proxy(request)
    if proxy_rejection:
        return proxy_rejection
    rejection = _require_admin(request)
    if rejection:
        return rejection
    if not is_same_origin(request):
        return json_response({"error": "Cross-site requests are not allowed."}, 403)
    declared_length = _declared_content_length(request)
    if declared_length > MAX_KNOWLEDGE_FILE_BYTES + 100_000:
        return json_response({"error": "The uploaded document is too large."}, 413)
    try:
        form = await request.form()
    except Exception:
        return json_response({"error": "Please submit a valid upload."}, 400)
    title = str(form.get("title") or "").strip()
    source_url = _normalize_source_url(str(form.get("sourceUrl") or ""))
    keywords_raw = str(form.get("keywords") or "").strip()
    pasted_text = str(form.get("content") or "").strip()
    file_value = form.get("file")
    file = file_value if isinstance(file_value, UploadFile) and file_value.filename else None
    if len(title) < 3 or len(title) > MAX_TITLE_LENGTH:
        return json_response(
            {"error": f"Title must contain between 3 and {MAX_TITLE_LENGTH} characters."}, 400
        )
    if not source_url:
        return json_response({"error": "Source URL must be a site path or an HTTPS URL."}, 400)
    if len(keywords_raw) > MAX_KEYWORDS_LENGTH:
        return json_response({"error": "The keyword list is too long."}, 400)
    if file and not is_supported_file(file.filename):
        return json_response(
            {"error": "Upload a Markdown, text, PDF, or Word (.docx) document."}, 415
        )
    raw_text = pasted_text
    original_filename = "Pasted knowledge"
    if file:
        data = await file.read(MAX_KNOWLEDGE_FILE_BYTES + 1)
        original_filename = file.filename
        try:
            raw_text = await extract_file(file.filename, data)
        except ValueError as extraction_error:
            return json_response({"error": str(extraction_error)}, 422)
    if len(raw_text) < 40:
        return json_response({"error": "Add at least 40 characters of useful knowledge."}, 400)
    keywords = [item.strip() for item in keywords_raw.split(",") if item.strip()][:30]
    source_id = f"{_slugify(title)}-{str(uuid.uuid4())[:8]}"
    try:
        chunks = chunk_knowledge_text(
            source_id=source_id,
            title=title,
            source_url=source_url,
            keywords=keywords,
            text=raw_text,
        )
    except ValueError as chunking_error:
        return json_response({"error": str(chunking_error)}, 400)
    if not chunks or len(chunks) > 300:
        return json_response({"error": "The document produced an invalid number of chunks."}, 400)
    preview = [
        {
            "id": chunk["id"],
            "title": chunk["title"],
            "characters": len(str(chunk["content"])),
            "content": chunk["content"],
        }
        for chunk in chunks
    ]
    if request.query_params.get("preview") == "1":
        return json_response({"preview": preview, "chunkCount": len(chunks)})
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    source = {
        "schemaVersion": 1,
        "id": source_id,
        "title": title,
        "sourceUrl": source_url,
        "keywords": keywords,
        "originalFilename": original_filename,
        "createdAt": now,
        "updatedAt": now,
        "rawText": raw_text,
        "chunks": chunks,
    }
    if not env("KNOWLEDGE_STORE_URL"):
        try:
            save_uploaded_source(source)
        except (OSError, ValueError) as persistence_error:
            print(f"[vrikshcrafts] Knowledge upload failed: {persistence_error}")
            return json_response(
                {"error": "The server could not persist this document. Confirm that the deployment has writable storage."},
                500,
            )
    return json_response(
        {
            "source": {
                "id": source_id,
                "title": title,
                "sourceUrl": source_url,
                "keywords": keywords,
                "originalFilename": original_filename,
                "createdAt": now,
                "updatedAt": now,
                "chunkCount": len(chunks),
                "characterCount": len(raw_text),
            },
            "preview": preview,
            "persistentSource": source,
        },
        201,
    )


@app.delete("/api/admin/knowledge")
async def remove_knowledge(request: Request) -> JSONResponse:
    proxy_rejection = _require_trusted_proxy(request)
    if proxy_rejection:
        return proxy_rejection
    rejection = _require_admin(request)
    if rejection:
        return rejection
    if not is_same_origin(request):
        return json_response({"error": "Cross-site requests are not allowed."}, 403)
    source_id = request.query_params.get("id", "")
    if not delete_uploaded_source(source_id):
        return json_response({"error": "Knowledge source was not found."}, 404)
    return json_response({"deleted": True})
