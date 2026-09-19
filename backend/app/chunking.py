from __future__ import annotations

import re
from typing import Dict, List, Sequence

from .config import MAX_DOCUMENT_CHARACTERS


DEFAULT_CHUNK_SIZE = 1_000


def clean_markdown(value: str) -> str:
    value = str(value).replace("\x00", "").replace("\r\n", "\n").replace("\r", "\n")
    value = re.sub(
        r"```[^\n]*\n?([\s\S]*?)```",
        lambda match: match.group(1),
        value,
    )
    value = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", value)
    value = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", value)
    value = re.sub(r"^\s*>\s?", "", value, flags=re.MULTILINE)
    value = re.sub(r"[`*_]", "", value)
    value = re.sub(r"[ \t]+", " ", value)
    value = re.sub(r"\n{3,}", "\n\n", value)
    return value.strip()


def _split_long_text(value: str, max_length: int) -> List[str]:
    if len(value) <= max_length:
        return [value]

    sentences = re.findall(r"[^.!?]+[.!?]+|[^.!?]+$", value) or [value]
    parts: List[str] = []
    current = ""
    for raw_sentence in sentences:
        sentence = raw_sentence.strip()
        if not sentence:
            continue
        candidate = f"{current} {sentence}".strip()
        if len(candidate) <= max_length:
            current = candidate
            continue
        if current:
            parts.append(current)
        if len(sentence) <= max_length:
            current = sentence
            continue
        current = ""
        for word in sentence.split():
            candidate = f"{current} {word}".strip()
            if len(candidate) > max_length and current:
                parts.append(current)
                current = word
            else:
                current = candidate
    if current:
        parts.append(current)
    return parts


def _split_sections(markdown: str, fallback_title: str) -> List[Dict[str, str]]:
    sections: List[Dict[str, str]] = []
    heading = fallback_title
    lines: List[str] = []
    for line in markdown.split("\n"):
        match = re.match(r"^#{1,6}\s+(.+?)\s*$", line)
        if match:
            body = clean_markdown("\n".join(lines))
            if body:
                sections.append({"heading": heading, "body": body})
            heading = clean_markdown(match.group(1)) or fallback_title
            lines = []
        else:
            lines.append(line)
    body = clean_markdown("\n".join(lines))
    if body:
        sections.append({"heading": heading, "body": body})
    return sections


def chunk_knowledge_text(
    *,
    source_id: str,
    title: str,
    source_url: str,
    keywords: Sequence[str],
    text: str,
    max_chunk_size: int = DEFAULT_CHUNK_SIZE,
) -> List[Dict[str, object]]:
    normalized_text = str(text).strip()
    if not normalized_text or len(normalized_text) > MAX_DOCUMENT_CHARACTERS:
        raise ValueError(
            f"Knowledge text must contain between 1 and {MAX_DOCUMENT_CHARACTERS:,} characters."
        )

    raw_chunks: List[Dict[str, str]] = []
    for section in _split_sections(normalized_text, title):
        paragraphs = [item for item in re.split(r"\n\s*\n", section["body"]) if item]
        current = ""
        for paragraph in paragraphs:
            for part in _split_long_text(paragraph, max_chunk_size):
                candidate = f"{current}\n\n{part}".strip()
                if len(candidate) > max_chunk_size and current:
                    raw_chunks.append({"heading": section["heading"], "content": current})
                    current = part
                else:
                    current = candidate
        if current:
            raw_chunks.append({"heading": section["heading"], "content": current})

    chunks: List[Dict[str, object]] = []
    for index, chunk in enumerate(raw_chunks, start=1):
        chunk_title = (
            title
            if chunk["heading"].casefold() == title.casefold()
            else f"{title} — {chunk['heading']}"
        )
        chunks.append(
            {
                "id": f"{source_id}-{index:03d}",
                "title": chunk_title,
                "url": source_url,
                "keywords": list(keywords),
                "content": chunk["content"],
            }
        )
    return chunks
