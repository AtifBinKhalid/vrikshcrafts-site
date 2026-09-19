from __future__ import annotations

import unittest

from backend.app.contact import sanitize_header, validate_contact_payload


VALID_PAYLOAD = {
    "name": "Aditi Sharma",
    "businessName": "Aditi Studio",
    "email": "ADITI@example.com",
    "phone": "+91 99999 99999",
    "city": "Delhi",
    "projectType": "Designer",
    "budget": "₹1–3 lakh",
    "message": "We need carved wooden panels for a reception wall.",
    "website": "",
}


class ContactValidationTests(unittest.TestCase):
    def test_accepts_and_normalizes_valid_enquiry(self) -> None:
        data, error, spam = validate_contact_payload(VALID_PAYLOAD)
        self.assertIsNone(error)
        self.assertFalse(spam)
        self.assertEqual(data["email"], "aditi@example.com")

    def test_rejects_malformed_or_short_enquiries(self) -> None:
        _, error, _ = validate_contact_payload({**VALID_PAYLOAD, "email": "invalid"})
        self.assertIsNotNone(error)
        _, error, _ = validate_contact_payload({**VALID_PAYLOAD, "message": "Too short"})
        self.assertIsNotNone(error)

    def test_rejects_oversized_and_unsupported_fields(self) -> None:
        _, error, _ = validate_contact_payload({**VALID_PAYLOAD, "name": "x" * 101})
        self.assertIsNotNone(error)
        _, error, _ = validate_contact_payload({**VALID_PAYLOAD, "projectType": "Injected"})
        self.assertIsNotNone(error)

    def test_marks_honeypot_as_spam(self) -> None:
        _, error, spam = validate_contact_payload(
            {**VALID_PAYLOAD, "website": "https://spam.example"}
        )
        self.assertIsNone(error)
        self.assertTrue(spam)

    def test_removes_line_breaks_from_headers(self) -> None:
        self.assertEqual(
            sanitize_header("Name\r\nBcc: victim@example.com"),
            "Name Bcc: victim@example.com",
        )


if __name__ == "__main__":
    unittest.main()
