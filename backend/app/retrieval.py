from __future__ import annotations

import math
import re
import unicodedata
from collections import Counter
from typing import Collection, Dict, List, Optional, Tuple

from .knowledge import KnowledgeChunk, UploadedSource, get_knowledge_snapshot


STOP_WORDS = {
    "a", "about", "an", "and", "are", "can", "could", "did", "do", "does",
    "for", "from", "had", "has", "have", "how", "i", "in", "is", "it", "me",
    "much", "my", "of", "on", "or", "our", "please", "tell", "the", "to", "we",
    "what", "where", "which", "who", "will", "with", "would", "you", "your",
}
SYNONYMS = {
    "lakdi": "wood", "wooden": "wood", "product": "decor", "products": "decor",
    "offer": "service", "offers": "service", "saman": "decor", "daam": "price",
    "artefact": "decor", "artefacts": "decor", "artifact": "decor", "artifacts": "decor",
    "catalogue": "catalog", "charges": "price", "cost": "price", "costing": "price",
    "estimate": "quote", "quotation": "quote", "rates": "price", "kimat": "price",
    "bhejna": "shipping", "bhejte": "shipping",
    "deliver": "delivery", "ship": "shipping", "dukaan": "store", "dukan": "store",
    "dispatch": "shipping", "freight": "shipping", "transport": "shipping",
    "bespoke": "custom", "customise": "custom", "customised": "custom",
    "customize": "custom", "customized": "custom", "daftar": "office",
    "kharid": "order", "banwana": "custom", "banate": "custom",
    "founded": "founder", "started": "founder",
}
RETRIEVAL_SPELLING_VOCABULARY = {
    "availability", "catalog", "catalogue", "contact", "custom", "customization",
    "customize", "decor", "delivery", "dimensions", "finish", "founder", "material",
    "minimum", "offer", "order", "panels", "payment", "price", "pricing", "product",
    "products", "project", "quotation", "quote", "return", "services", "shipping",
    "signage", "timeline", "warranty", "whatsapp", "wood", "wooden",
}
GENERIC_RETRIEVAL_TERMS = {
    "available", "buy", "make", "order", "sell", "service", "store",
}


def _is_likely_typo(value: str, candidate: str, *, allow_substitution: bool) -> bool:
    """Match one missing/extra letter or one adjacent transposition conservatively."""
    if value == candidate or abs(len(value) - len(candidate)) > 1:
        return False
    if len(value) == len(candidate):
        mismatches = [
            index
            for index, (left, right) in enumerate(zip(value, candidate))
            if left != right
        ]
        if allow_substitution and len(mismatches) == 1:
            return True
        return (
            len(mismatches) == 2
            and mismatches[1] == mismatches[0] + 1
            and value[mismatches[0]] == candidate[mismatches[1]]
            and value[mismatches[1]] == candidate[mismatches[0]]
        )

    shorter, longer = (value, candidate) if len(value) < len(candidate) else (candidate, value)
    short_index = long_index = differences = 0
    while short_index < len(shorter) and long_index < len(longer):
        if shorter[short_index] == longer[long_index]:
            short_index += 1
            long_index += 1
            continue
        differences += 1
        long_index += 1
        if differences > 1:
            return False
    return True


def correct_common_typos(
    value: object,
    vocabulary: Collection[str],
    *,
    minimum_length: int = 4,
    allow_substitution: bool = False,
) -> str:
    """Correct only unambiguous, near-match words from a controlled vocabulary."""
    normalized_vocabulary = {
        word.casefold() for word in vocabulary if len(word) >= minimum_length
    }

    def replace(match: re.Match[str]) -> str:
        token = match.group(0)
        folded = token.casefold()
        if len(folded) < minimum_length or folded in normalized_vocabulary:
            return token
        candidates = [
            candidate
            for candidate in normalized_vocabulary
            if _is_likely_typo(
                folded, candidate, allow_substitution=allow_substitution
            )
        ]
        return candidates[0] if len(candidates) == 1 else token

    return re.sub(r"[^\W_]+", replace, str(value), flags=re.UNICODE)


def normalize_query_spelling(value: object) -> str:
    return correct_common_typos(value, RETRIEVAL_SPELLING_VOCABULARY)


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


def _get_search_index(
    additional_sources: Optional[List[UploadedSource]] = None,
) -> Tuple[List[Dict[str, object]], float, Counter]:
    global _cached_revision, _cached_index
    documents, revision = get_knowledge_snapshot(additional_sources)
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


def retrieve_knowledge(
    query: str,
    *,
    limit: int = 4,
    min_score: float = 0.65,
    additional_sources: Optional[List[UploadedSource]] = None,
) -> List[KnowledgeChunk]:
    indexed, average_length, document_frequency = _get_search_index(additional_sources)
    safe_limit = max(1, min(int(limit or 4), 8))
    corrected_query = normalize_query_spelling(query)
    query_token_counts = Counter(tokenize(corrected_query))
    if not query_token_counts:
        return []

    results: List[KnowledgeChunk] = []
    for item in indexed:
        score = 0.0
        matched_tokens: set[str] = set()
        body_tokens = item["body_tokens"]
        for token, raw_query_weight in query_token_counts.items():
            query_weight = min(raw_query_weight, 3)
            frequency = item["frequencies"].get(token, 0)
            docs_with_token = document_frequency.get(token, 0)
            inverse_frequency = math.log(
                1 + (len(indexed) - docs_with_token + 0.5) / (docs_with_token + 0.5)
            )
            if frequency > 0:
                matched_tokens.add(token)
                normalized_frequency = (frequency * 2.2) / (
                    frequency + 1.2 * (0.25 + 0.75 * (len(body_tokens) / average_length))
                )
                score += inverse_frequency * normalized_frequency * query_weight
            if token in item["keyword_tokens"]:
                matched_tokens.add(token)
                score += 1.15 * query_weight
            if token in item["title_tokens"]:
                matched_tokens.add(token)
                score += 0.75 * query_weight
        normalized_query = corrected_query.casefold().strip()
        document = item["document"]
        normalized_title = str(document["title"]).casefold()
        normalized_keywords = " ".join(str(value) for value in document["keywords"]).casefold()
        if len(normalized_query) > 3 and normalized_query in normalized_title:
            score += 2.5
        if len(normalized_query) > 3 and normalized_query in normalized_keywords:
            score += 1.5
        if len(normalized_query) > 3 and normalized_query in str(document["content"]).casefold():
            score += 2
        result = dict(document)
        result["score"] = round(score, 4)
        specific_query_tokens = set(query_token_counts) - GENERIC_RETRIEVAL_TERMS
        if specific_query_tokens and not (matched_tokens & specific_query_tokens):
            continue
        if score >= min_score:
            results.append(result)
    results.sort(key=lambda result: float(result["score"]), reverse=True)
    return results[:safe_limit]
