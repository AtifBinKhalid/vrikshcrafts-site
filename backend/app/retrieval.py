from __future__ import annotations

import math
import re
import unicodedata
from collections import Counter
from typing import Dict, List, Optional, Tuple

from .knowledge import KnowledgeChunk, get_knowledge_snapshot


STOP_WORDS = {
    "a", "an", "and", "are", "can", "do", "for", "from", "how", "i", "in",
    "is", "it", "me", "my", "of", "on", "or", "our", "the", "to", "we",
    "what", "where", "which", "who", "with", "you", "your",
}
SYNONYMS = {
    "lakdi": "wood", "wooden": "wood", "product": "decor", "products": "decor",
    "offer": "service", "offers": "service", "saman": "decor", "daam": "price",
    "kimat": "price", "costing": "price", "bhejna": "shipping", "bhejte": "shipping",
    "deliver": "delivery", "ship": "shipping", "dukaan": "store", "dukan": "store",
    "daftar": "office", "kharid": "order", "banwana": "custom", "banate": "custom",
    "founded": "founder", "started": "founder",
}


def tokenize(value: object) -> List[str]:
    normalized = "".join(
        character
        for character in unicodedata.normalize("NFKD", str(value))
        if not unicodedata.combining(character)
    ).casefold()
    raw_tokens = re.findall(r"[^\W_]+", normalized, flags=re.UNICODE)
    tokens = [SYNONYMS.get(token, token) for token in raw_tokens]
    return [token for token in tokens if len(token) > 1 and token not in STOP_WORDS]


_cached_revision: Optional[str] = None
_cached_index: Optional[Tuple[List[Dict[str, object]], float, Counter]] = None


def _get_search_index() -> Tuple[List[Dict[str, object]], float, Counter]:
    global _cached_revision, _cached_index
    documents, revision = get_knowledge_snapshot()
    if _cached_revision == revision and _cached_index is not None:
        return _cached_index

    indexed: List[Dict[str, object]] = []
    for document in documents:
        body_tokens = tokenize(f"{document['title']} {document['content']}")
        keyword_tokens = tokenize(" ".join(str(item) for item in document["keywords"]))
        indexed.append(
            {
                "document": document,
                "body_tokens": body_tokens,
                "keyword_tokens": keyword_tokens,
                "frequencies": Counter(body_tokens),
                "title_tokens": tokenize(document["title"]),
            }
        )
    average_length = sum(len(item["body_tokens"]) for item in indexed) / max(1, len(indexed))
    document_frequency: Counter = Counter()
    for item in indexed:
        document_frequency.update(set(item["body_tokens"] + item["keyword_tokens"]))

    _cached_revision = revision
    _cached_index = (indexed, average_length, document_frequency)
    return _cached_index


def retrieve_knowledge(query: str, *, limit: int = 4, min_score: float = 0.65) -> List[KnowledgeChunk]:
    indexed, average_length, document_frequency = _get_search_index()
    safe_limit = max(1, min(int(limit or 4), 8))
    query_tokens = list(dict.fromkeys(tokenize(query)))
    if not query_tokens:
        return []

    results: List[KnowledgeChunk] = []
    for item in indexed:
        score = 0.0
        body_tokens = item["body_tokens"]
        for token in query_tokens:
            frequency = item["frequencies"].get(token, 0)
            docs_with_token = document_frequency.get(token, 0)
            inverse_frequency = math.log(
                1 + (len(indexed) - docs_with_token + 0.5) / (docs_with_token + 0.5)
            )
            if frequency > 0:
                normalized_frequency = (frequency * 2.2) / (
                    frequency + 1.2 * (0.25 + 0.75 * (len(body_tokens) / average_length))
                )
                score += inverse_frequency * normalized_frequency
            if token in item["keyword_tokens"]:
                score += 1.15
            if token in item["title_tokens"]:
                score += 0.75
        normalized_query = query.casefold().strip()
        document = item["document"]
        if len(normalized_query) > 3 and normalized_query in str(document["content"]).casefold():
            score += 2
        result = dict(document)
        result["score"] = round(score, 4)
        if score >= min_score:
            results.append(result)
    results.sort(key=lambda result: float(result["score"]), reverse=True)
    return results[:safe_limit]
