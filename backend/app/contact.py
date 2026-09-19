from __future__ import annotations

import html
import re
import smtplib
import ssl
from email.message import EmailMessage
from typing import Dict, Optional, Tuple


LIMITS = {
    "name": 100,
    "businessName": 120,
    "email": 254,
    "phone": 40,
    "city": 100,
    "projectType": 40,
    "budget": 100,
    "message": 3_000,
    "website": 200,
}
PROJECT_TYPES = {"", "Cafe", "Office", "Designer", "Store", "Other"}
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
CONTROL_CHARACTER_PATTERN = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def _read_text(value: object) -> str:
    return value.strip() if isinstance(value, str) else ""


def validate_contact_payload(payload: object) -> Tuple[Optional[Dict[str, str]], Optional[str], bool]:
    if not isinstance(payload, dict):
        return None, "Please submit a valid enquiry.", False
    data = {
        "name": _read_text(payload.get("name")),
        "businessName": _read_text(payload.get("businessName")),
        "email": _read_text(payload.get("email")).casefold(),
        "phone": _read_text(payload.get("phone")),
        "city": _read_text(payload.get("city")),
        "projectType": _read_text(payload.get("projectType")),
        "budget": _read_text(payload.get("budget")),
        "message": _read_text(payload.get("message")),
        "website": _read_text(payload.get("website")),
    }
    if data["website"]:
        return data, None, True
    if len(data["name"]) < 2 or len(data["message"]) < 20:
        return None, "Please provide your name and at least 20 characters of project details.", False
    if not EMAIL_PATTERN.fullmatch(data["email"]):
        return None, "Please provide a valid email address.", False
    for field, limit in LIMITS.items():
        value = data[field]
        if len(value) > limit or CONTROL_CHARACTER_PATTERN.search(value):
            return None, "One or more fields contain invalid or excessive text.", False
    if data["projectType"] not in PROJECT_TYPES:
        return None, "Please select a valid project type.", False
    return data, None, False


def sanitize_header(value: str) -> str:
    return re.sub(r"[\r\n]+", " ", value)[: LIMITS["name"]]


def deliver_contact_email(
    data: Dict[str, str],
    *,
    smtp_host: str,
    smtp_port: int,
    smtp_user: str,
    smtp_pass: str,
    smtp_from: str,
    smtp_to: str,
) -> None:
    rows = [
        ("Name", data["name"]),
        ("Business / brand", data["businessName"] or "-"),
        ("Email", data["email"]),
        ("Phone", data["phone"] or "-"),
        ("City", data["city"] or "-"),
        ("Project type", data["projectType"] or "-"),
        ("Budget", data["budget"] or "-"),
    ]
    plain_body = "\n".join(
        ["New enquiry received.", "", *(f"{label}: {value}" for label, value in rows), "", "Message:", data["message"]]
    )
    html_rows = "\n".join(
        f"<p><strong>{html.escape(label)}:</strong> {html.escape(value)}</p>"
        for label, value in rows
    )
    html_message = html.escape(data["message"]).replace("\n", "<br/>")

    message = EmailMessage()
    message["From"] = smtp_from
    message["To"] = smtp_to
    message["Reply-To"] = data["email"]
    message["Subject"] = f"New vrikshcrafts enquiry from {sanitize_header(data['name'])}"
    message.set_content(plain_body)
    message.add_alternative(
        f"<h2>New vrikshcrafts enquiry</h2>{html_rows}<p><strong>Message:</strong></p><p>{html_message}</p>",
        subtype="html",
    )

    context = ssl.create_default_context()
    if smtp_port == 465:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=15, context=context) as server:
            server.login(smtp_user, smtp_pass)
            server.send_message(message)
    else:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(smtp_user, smtp_pass)
            server.send_message(message)
