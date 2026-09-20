from __future__ import annotations

import re
from typing import Dict, List

from .retrieval import tokenize


SMALL_TALK_PATTERN = re.compile(
    r"^(?:hi|hello|hey|namaste|namaskar|good\s+(?:morning|afternoon|evening))"
    r"\b(?:[\s,!.'-]+\w+){0,3}[!. ]*$",
    flags=re.IGNORECASE,
)
THANKS_PATTERN = re.compile(
    r"^(?:thanks|thank\s+you|thank\s+you\s+so\s+much|great|perfect|helpful)"
    r"[!. ]*$",
    flags=re.IGNORECASE,
)
REFERENCE_PATTERN = re.compile(
    r"\b(?:it|its|that|those|this|these|them|there|same|above|one|ones)\b|"
    r"^(?:and|also|what about|how about|then)\b",
    flags=re.IGNORECASE,
)
PROJECT_DETAIL_TERMS = {
    "availability",
    "budget",
    "cost",
    "deadline",
    "delivery",
    "discount",
    "install",
    "installation",
    "material",
    "price",
    "quote",
    "rate",
    "sample",
    "size",
    "stock",
    "timeline",
    "warranty",
}
META_SOURCE_IDS = {"chatbot-answer-policy"}

FOLLOW_UPS = {
    "catalog-overview": [
        "Can you customize these products?",
        "How do I request a quotation?",
    ],
    "customization": [
        "What should I share for customization?",
        "How does the project process work?",
    ],
    "shipping": [
        "What affects the delivery timeline?",
        "How do I request a shipping estimate?",
    ],
    "pricing": [
        "What details are needed for a quotation?",
        "Is there a minimum order?",
    ],
    "minimum-order-budget": [
        "What details are needed for a quotation?",
        "Is there a minimum order?",
    ],
    "timelines-availability": [
        "What affects the production timeline?",
        "What should I include in my enquiry?",
    ],
    "project-process": [
        "What information should my brief include?",
        "Can I share a moodboard?",
    ],
    "direct-contact": [
        "What should I include in my enquiry?",
        "How quickly will the team respond?",
    ],
}


def build_retrieval_query(question: str, history: List[Dict[str, str]]) -> str:
    """Resolve short follow-ups against the most recent user topic."""
    if not REFERENCE_PATTERN.search(question) and len(tokenize(question)) > 3:
        return question

    previous_user_message = next(
        (
            item.get("content", "")
            for item in reversed(history)
            if item.get("role") == "user" and item.get("content", "").strip()
        ),
        "",
    )
    current_tokens = set(tokenize(question))
    expansions: List[str] = []
    if current_tokens & {"availability", "delivery", "schedule", "shipping", "timeline"}:
        expansions.append("lead time availability delivery schedule")
    if current_tokens & {"budget", "price", "quote"}:
        expansions.append("price quotation budget payment")
    if current_tokens & {"finish", "material", "wood"}:
        expansions.append("finish material stain wood specification")
    if current_tokens & {"minimum", "quantity"}:
        expansions.append("minimum order quantity batch")

    # Keep the old subject while strongly representing the new follow-up intent.
    return " ".join([question, *expansions, previous_user_message]).strip() or question


def _sentences(value: object) -> List[str]:
    return [
        sentence.strip()
        for sentence in re.findall(r"[^.!?]+(?:[.!?]+|$)", str(value))
        if sentence.strip()
    ]


def _sentence_score(sentence: str, question_tokens: set[str], source_rank: int) -> float:
    sentence_tokens = set(tokenize(sentence))
    overlap = len(question_tokens & sentence_tokens)
    if overlap == 0:
        return -1.0
    score = overlap * 2.5 + max(0.0, 1.2 - source_rank * 0.25)
    if 45 <= len(sentence) <= 220:
        score += 0.4
    if re.search(r"\b(?:chatbot|assistant)\b", sentence, re.IGNORECASE):
        score -= 5
    return score


def _synthesize_from_sources(question: str, sources: List[Dict[str, object]]) -> str:
    question_tokens = set(tokenize(question))
    sentence_limit = 3 if re.search(r"\b(?:and|also)\b", question, re.IGNORECASE) else 2
    candidates: List[tuple[float, int, int, str]] = []
    for source_rank, source in enumerate(sources[:3]):
        if str(source.get("id")) in META_SOURCE_IDS:
            continue
        for sentence_rank, sentence in enumerate(_sentences(source.get("content", ""))):
            candidates.append(
                (
                    _sentence_score(sentence, question_tokens, source_rank),
                    source_rank,
                    sentence_rank,
                    sentence,
                )
            )

    candidates.sort(key=lambda item: (-item[0], item[1], item[2]))
    selected: List[tuple[int, int, str]] = []
    seen: set[str] = set()
    used_sources: set[int] = set()
    for score, source_rank, sentence_rank, sentence in candidates:
        normalized = sentence.casefold()
        if normalized in seen:
            continue
        if len(selected) >= sentence_limit:
            break
        if selected and score < 1.0:
            continue
        if source_rank in used_sources and len(selected) >= 2:
            continue
        selected.append((source_rank, sentence_rank, sentence))
        seen.add(normalized)
        used_sources.add(source_rank)

    if not selected and sources:
        selected = [
            (0, index, sentence)
            for index, sentence in enumerate(_sentences(sources[0].get("content", ""))[:2])
        ]

    selected.sort(key=lambda item: (item[0], item[1]))
    return " ".join(sentence for _, _, sentence in selected).strip()


def local_answer(
    question: str,
    sources: List[Dict[str, object]],
    visitor_name: str,
    retrieval_query: str = "",
) -> str:
    greeting = f"Hi, {visitor_name}!" if visitor_name else "Hello!"
    if SMALL_TALK_PATTERN.fullmatch(question.strip()):
        return (
            f"{greeting} I can help with products, customization, project planning, "
            "shipping, and quotations. What are you working on?"
        )
    if THANKS_PATTERN.fullmatch(question.strip()):
        return "You’re welcome! If you share what you are planning, I can help you find the most relevant products or next step."
    if not sources:
        prefix = "I’m sorry this has been frustrating. " if re.search(
            r"\b(?:angry|bad|frustrat|problem|upset|wrong)\w*\b", question, re.IGNORECASE
        ) else ""
        return (
            f"{prefix}I couldn’t find a reliable answer in the vrikshcrafts knowledge base. "
            "Could you clarify whether this is about a product, customization, shipping, "
            "pricing, or an existing project?"
        )

    answer = _synthesize_from_sources(retrieval_query or question, sources)
    if not answer:
        return (
            "I found related information, but not enough to answer confidently. "
            "Please rephrase the question or share your project details with the team."
        )

    query_tokens = set(tokenize(question))
    asks_for_exact_timing = bool(
        query_tokens & {"availability", "delivery", "shipping", "stock", "timeline"}
        and re.search(
            r"\b(?:today|tomorrow|tonight|next|urgent|asap|monday|tuesday|wednesday|"
            r"thursday|friday|saturday|sunday|week|month|by|before|within)\b|\d",
            question,
            re.IGNORECASE,
        )
    )
    if asks_for_exact_timing:
        answer = f"I can’t confirm that timing from the published information. {answer}"
    if query_tokens & PROJECT_DETAIL_TERMS:
        return (
            f"{answer}\n\nFor an exact project-specific answer, share your requirements "
            "through the enquiry form and the team will confirm the details."
        )
    return answer


def suggested_follow_ups(sources: List[Dict[str, object]]) -> List[str]:
    suggestions: List[str] = []
    for source in sources:
        for suggestion in FOLLOW_UPS.get(str(source.get("id")), []):
            if suggestion not in suggestions:
                suggestions.append(suggestion)
            if len(suggestions) == 2:
                return suggestions
    return suggestions or [
        "What products do you offer?",
        "How do I start a project enquiry?",
    ]
