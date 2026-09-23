from __future__ import annotations

import re
from typing import Dict, List, Optional, Tuple

from .retrieval import correct_common_typos, normalize_query_spelling, tokenize


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
HOW_ARE_YOU_PATTERN = re.compile(
    r"^(?:(?:hi|hello|hey)[,! ]+)?(?:how are you|how have you been|"
    r"how(?:'s| is) it going|how(?:'s| is) your day|what(?:'s| is) up|"
    r"are you (?:okay|alright|well))[?!. ]*$",
    flags=re.IGNORECASE,
)
ABOUT_ASSISTANT_PATTERN = re.compile(
    r"^(?:who are you|what can you do|what do you help with|"
    r"how can you help(?: me)?)[?!. ]*$",
    flags=re.IGNORECASE,
)
ASSISTANT_ACTIVITY_PATTERN = re.compile(
    r"^(?:(?:hi|hello|hey)[,! ]+)?(?:what are you doing|what are you up to|"
    r"what do you do|are you (?:there|working|ready))[?!. ]*$",
    flags=re.IGNORECASE,
)
RESPONSE_EXPECTATION_PATTERN = re.compile(
    r"^(?:if i ask you anything(?:,? then)? how would you (?:respond|answer)|"
    r"how would you (?:respond|answer)(?: if i ask you something)?|"
    r"can you answer my questions|will you answer my questions|"
    r"can i ask you anything)[?!. ]*$",
    flags=re.IGNORECASE,
)
BOT_NATURE_PATTERN = re.compile(
    r"^(?:are you (?:a bot|an ai|human|real)|are you a real person)[?!. ]*$",
    flags=re.IGNORECASE,
)
ASK_USER_FEELING_PATTERN = re.compile(
    r"\b(?:(?:can|could|will|would) you (?:please )?(?:first )?)?"
    r"ask(?: me)? (?:how (?:am i|i am|i'm) (?:feeling|doing)(?: today)?|"
    r"how i feel(?: today)?|how my day is(?: going)?)\b",
    flags=re.IGNORECASE,
)
DISSATISFACTION_PATTERN = re.compile(
    r"\b(?:not (?:giving|getting) (?:me )?(?:the )?(?:desired|right|expected) "
    r"(?:output|answer|response)|not what i (?:asked|meant|wanted)|"
    r"you (?:misunderstood|didn't understand|did not understand)|"
    r"wrong (?:answer|response)|please (?:first )?(?:see|read|understand) "
    r"what i asked)\b",
    flags=re.IGNORECASE,
)
GOODBYE_PATTERN = re.compile(
    r"^(?:bye|goodbye|see you|talk to you later|that(?:'s| is) all)[?!. ]*$",
    flags=re.IGNORECASE,
)
IDENTITY_PATTERN = re.compile(
    r"^(?:(?:hi|hello|hey)[,! ]+)?(?:do you (?:know|remember) me|remember me|"
    r"what(?:'s| is) my name|who am i)[?!. ]*$",
    flags=re.IGNORECASE,
)
TOPIC_SWITCH_PATTERN = re.compile(
    r"\b(?:not about (?:a |the )?project|something else|a different (?:thing|topic)|"
    r"change (?:the )?(?:subject|topic)|another topic)\b",
    flags=re.IGNORECASE,
)
ASK_PERMISSION_PATTERN = re.compile(
    r"\b(?:i (?:want|would like|need) to ask|can i ask|may i ask|"
    r"i have (?:a|one|another) question|let me ask)\b",
    flags=re.IGNORECASE,
)
ACKNOWLEDGEMENT_PATTERN = re.compile(
    r"^(?:ok|okay|alright|all right|sure|sounds good|got it)[?!. ]*$",
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

GENERAL_CONVERSATION_SUGGESTIONS = [
    "What products do you offer?",
    "Can you customize for my brand?",
    "How do I request a quotation?",
]
PROJECT_CONVERSATION_SUGGESTIONS = [
    "Which products could suit my space?",
    "Can you match my brand or interior theme?",
    "What should I share for a quotation?",
]
INTENT_SPELLING_VOCABULARY = {
    "alright", "answer", "anything", "another", "ask", "asked", "change", "desired",
    "different", "doing", "else", "expected", "feel", "feeling", "first", "good",
    "hello", "help", "human", "know", "misunderstood", "name", "okay", "output",
    "project", "question", "ready", "real", "remember", "respond", "response",
    "something", "subject", "sure", "thing", "today", "topic", "understand", "want",
    "what", "who", "working", "would", "wrong", "you",
}
WORK_SCOPE_TERMS = {
    "architect", "artisan", "availability", "board", "boards", "brand", "branding",
    "budget", "cafe", "care", "carved", "carving", "catalog", "cladding", "cleaning",
    "contact", "counter", "craft", "custom", "customization", "decor", "delivery",
    "designer", "dimensions", "finish", "furniture", "gift", "handcrafted", "hotel",
    "install", "installation", "interior", "logo", "manufacture", "manufacturing",
    "material", "menu", "minimum", "office", "order", "panel", "panels", "payment",
    "price", "pricing", "production", "project", "quantity", "quote", "reception",
    "restaurant", "retail", "return", "sample", "shelf", "shelves", "shipping",
    "signage", "space", "store", "supplier", "tabletop", "teak", "timeline", "timber",
    "wall", "warranty", "wholesale", "wood", "workshop", "vrikshcrafts",
}


def _normalize_intent_spelling(value: str) -> str:
    domain_normalized = normalize_query_spelling(value)
    return correct_common_typos(
        domain_normalized,
        INTENT_SPELLING_VOCABULARY,
        minimum_length=3,
        allow_substitution=False,
    )


def is_work_related(question: str) -> bool:
    normalized = normalize_query_spelling(question)
    return bool(set(tokenize(normalized)) & WORK_SCOPE_TERMS)


def conversational_reply(
    question: str,
    visitor_name: str,
    history: Optional[List[Dict[str, str]]] = None,
) -> Optional[Tuple[str, List[str]]]:
    """Handle dialogue acts that should never be sent through document retrieval."""
    message = _normalize_intent_spelling(question.strip())
    greeting = f"Yes—I know you as {visitor_name} from this chat." if visitor_name else (
        "I don’t know your name yet, but I’d be happy to learn it."
    )
    personal_greeting = f", {visitor_name}" if visitor_name else ""
    previous_user_message = next(
        (
            item.get("content", "")
            for item in reversed(history or [])
            if item.get("role") == "user" and item.get("content", "").strip()
        ),
        "",
    )

    if DISSATISFACTION_PATTERN.search(message):
        if ASK_USER_FEELING_PATTERN.search(
            _normalize_intent_spelling(previous_user_message)
        ):
            return (
                f"You’re right—I misunderstood what you wanted. Let me ask properly: "
                f"how are you feeling today{personal_greeting}?",
                GENERAL_CONVERSATION_SUGGESTIONS,
            )
        return (
            "You’re right—I may have misunderstood you. Tell me what you wanted me "
            "to respond to, and I’ll take it from there.",
            GENERAL_CONVERSATION_SUGGESTIONS,
        )
    if ASK_USER_FEELING_PATTERN.search(message):
        return (
            f"Of course{personal_greeting}—how are you feeling today?",
            GENERAL_CONVERSATION_SUGGESTIONS,
        )

    if IDENTITY_PATTERN.fullmatch(message):
        return (
            f"{greeting} How can I help you today?",
            GENERAL_CONVERSATION_SUGGESTIONS,
        )
    if HOW_ARE_YOU_PATTERN.fullmatch(message):
        return (
            f"I’m doing well{personal_greeting}—thanks for asking! I’m here and ready "
            "to help. What’s on your mind?",
            GENERAL_CONVERSATION_SUGGESTIONS,
        )
    if ASSISTANT_ACTIVITY_PATTERN.fullmatch(message):
        return (
            "Right now, I’m here with you—ready to help with vrikshcrafts products, "
            "customization, quotations, shipping, or a project idea. What would you "
            "like to talk about?",
            GENERAL_CONVERSATION_SUGGESTIONS,
        )
    if RESPONSE_EXPECTATION_PATTERN.fullmatch(message):
        return (
            "You can ask me anything. I’ll respond naturally to casual conversation, "
            "use verified information for vrikshcrafts questions, and tell you honestly "
            "when something is outside my scope instead of guessing.",
            GENERAL_CONVERSATION_SUGGESTIONS,
        )
    if BOT_NATURE_PATTERN.fullmatch(message):
        return (
            "I’m an AI assistant, not a person—but I’ll keep our conversation natural "
            "and be honest about what I do and don’t know. How can I help?",
            GENERAL_CONVERSATION_SUGGESTIONS,
        )
    if ABOUT_ASSISTANT_PATTERN.fullmatch(message):
        return (
            "I’m the vrikshcrafts website assistant. I can chat with you naturally and "
            "help with products, customization, quotations, shipping, or planning a "
            "project. What would you like to explore?",
            GENERAL_CONVERSATION_SUGGESTIONS,
        )
    if THANKS_PATTERN.fullmatch(message):
        return (
            "You’re welcome—I’m glad I could help. What would you like to explore next?",
            GENERAL_CONVERSATION_SUGGESTIONS,
        )
    if GOODBYE_PATTERN.fullmatch(message):
        return (
            "It was good talking with you. Whenever you’re ready, I’ll be here to help.",
            GENERAL_CONVERSATION_SUGGESTIONS,
        )
    if SMALL_TALK_PATTERN.fullmatch(message):
        return (
            f"Hi{personal_greeting}! It’s good to hear from you. What would you like "
            "to talk about?",
            GENERAL_CONVERSATION_SUGGESTIONS,
        )
    if TOPIC_SWITCH_PATTERN.search(message):
        return (
            "No problem at all. What would you like to talk about? I’m best at "
            "vrikshcrafts-related questions, so if something is outside that area, "
            "I’ll be honest rather than make up an answer.",
            GENERAL_CONVERSATION_SUGGESTIONS,
        )
    if ASK_PERMISSION_PATTERN.search(message):
        if re.search(r"\bproject\b", message, re.IGNORECASE):
            return (
                "Of course—tell me about the project. You can start with the kind of "
                "space, what you want to create, or whichever question is on your mind.",
                PROJECT_CONVERSATION_SUGGESTIONS,
            )
        return (
            "Of course—go ahead. What would you like to ask?",
            GENERAL_CONVERSATION_SUGGESTIONS,
        )
    if ACKNOWLEDGEMENT_PATTERN.fullmatch(message):
        return (
            "Great—what would you like to explore?",
            GENERAL_CONVERSATION_SUGGESTIONS,
        )
    return None


def build_retrieval_query(question: str, history: List[Dict[str, str]]) -> str:
    """Resolve short follow-ups against the most recent user topic."""
    if not REFERENCE_PATTERN.search(question):
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


def _humanize_grounded_answer(answer: str, source_ids: set[str]) -> str:
    if "minimum-order-budget" in source_ids:
        natural_answer = answer.replace(
            "The website does not publish fixed prices because",
            "Pricing is worked out project by project because",
            1,
        )
        if not natural_answer.startswith("Pricing"):
            natural_answer = f"Pricing is worked out project by project. {natural_answer}"
        return natural_answer
    if "catalog-overview" in source_ids:
        return f"Here’s the short version: {answer}"
    if "customization" in source_ids:
        return f"Yes—customization is possible. {answer}"
    if "shipping" in source_ids:
        return answer.replace(
            "vrikshcrafts is based in Saharanpur and works with clients across India.",
            "Yes—we work with clients across India.",
            1,
        )
    if "timelines-availability" in source_ids:
        return f"Timelines are planned project by project. {answer}"
    return answer


def _project_next_step(source_ids: set[str]) -> str:
    if "minimum-order-budget" in source_ids:
        return (
            "If you’d like a quotation, share the product type, dimensions, quantity, "
            "finish, destination, and preferred timeline."
        )
    if "shipping" in source_ids or "timelines-availability" in source_ids:
        return (
            "If you share the item, quantity, dimensions, destination, and preferred date, "
            "the team can confirm what’s realistic."
        )
    if "customization" in source_ids:
        return (
            "If you share a logo, moodboard, dimensions, quantity, and finish reference, "
            "the team can assess the idea properly."
        )
    return (
        "If you share the product, quantity, dimensions, destination, and preferred timeline, "
        "the team can give you a reliable project-specific answer."
    )


def local_answer(
    question: str,
    sources: List[Dict[str, object]],
    visitor_name: str,
    retrieval_query: str = "",
) -> str:
    greeting = f"Hi, {visitor_name}!" if visitor_name else "Hello!"
    intent_message = _normalize_intent_spelling(question.strip())
    if SMALL_TALK_PATTERN.fullmatch(intent_message):
        return (
            f"{greeting} Nice to meet you. Tell me what you’re planning—even a rough idea "
            "is enough—and I’ll help you work through products, customization, shipping, "
            "or the next step."
        )
    if HOW_ARE_YOU_PATTERN.fullmatch(intent_message):
        return "I’m doing well—thanks for asking! What are you hoping to create or source today?"
    if ABOUT_ASSISTANT_PATTERN.fullmatch(intent_message):
        return (
            "I’m here to help you understand what vrikshcrafts offers and plan your next step. "
            "You can ask me about products, customization, quotations, shipping, or what to "
            "include in a project brief."
        )
    if THANKS_PATTERN.fullmatch(intent_message):
        return "You’re welcome—I’m glad that helped. What would you like to explore next?"
    if GOODBYE_PATTERN.fullmatch(intent_message):
        return "Thanks for stopping by. Whenever you’re ready, I’ll be here to help with your project."
    if not sources:
        prefix = "I’m sorry this has been frustrating. " if re.search(
            r"\b(?:angry|bad|frustrat|problem|upset|wrong)\w*\b", question, re.IGNORECASE
        ) else ""
        if is_work_related(question):
            return (
                f"{prefix}I understand what you’re asking, but I don’t have that specific "
                "vrikshcrafts detail in my verified information yet, and I don’t want to "
                "guess. Share a little more context, or contact the team if you need a "
                "confirmed project-specific answer."
            )
        return (
            f"{prefix}Sorry, that’s outside what I can help with here. I’m focused on "
            "vrikshcrafts products and projects, so I’d rather be honest than give you an "
            "unreliable answer. I can still help with products, customization, quotations, "
            "shipping, or planning a project."
        )

    answer = _synthesize_from_sources(
        normalize_query_spelling(retrieval_query or question), sources
    )
    if not answer:
        return (
            "I found something related, but not enough to give you a useful answer yet. "
            "Could you share the product or project you have in mind?"
        )

    query_tokens = set(tokenize(normalize_query_spelling(question)))
    source_ids = {str(source.get("id")) for source in sources}
    answer = _humanize_grounded_answer(answer, source_ids)
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
        return (
            f"I’d rather not guess about that deadline. {answer}\n\n"
            f"{_project_next_step(source_ids)}"
        )
    if query_tokens & PROJECT_DETAIL_TERMS:
        return f"{answer}\n\n{_project_next_step(source_ids)}"
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
