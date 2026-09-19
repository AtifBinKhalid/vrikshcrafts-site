from __future__ import annotations

import json
import os
import re
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from .config import KNOWLEDGE_FILE, UPLOAD_DIRECTORY


KnowledgeChunk = Dict[str, object]
UploadedSource = Dict[str, object]


def _read_metadata(block: str) -> Dict[str, str]:
    metadata: Dict[str, str] = {}
    for raw_line in block.splitlines():
        line = raw_line.strip()
        if not line or ":" not in line:
            continue
        key, value = line.split(":", 1)
        if key.strip():
            metadata[key.strip()] = value.strip()
    return metadata


def _markdown_to_plain_text(markdown: str) -> str:
    value = re.sub(r"^#{1,6}\s+", "", markdown, flags=re.MULTILINE)
    value = re.sub(r"^\s*[-*]\s+", "", value, flags=re.MULTILINE)
    value = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", value)
    value = re.sub(r"[`*_>]", "", value)
    return re.sub(r"\s+", " ", value).strip()


def parse_knowledge_document(markdown: str) -> List[KnowledgeChunk]:
    indexable = re.sub(r"```[\s\S]*?```", "", markdown)
    pattern = re.compile(
        r"<!-- RAG-CHUNK\s*\r?\n([\s\S]*?)-->\s*([\s\S]*?)<!-- /RAG-CHUNK -->"
    )
    entries: List[KnowledgeChunk] = []
    for match in pattern.finditer(indexable):
        metadata = _read_metadata(match.group(1))
        body = re.sub(r"^\s*#{1,6}\s+[^\r\n]+\r?\n", "", match.group(2), count=1)
        content = _markdown_to_plain_text(body)
        keywords = [item.strip() for item in metadata.get("keywords", "").split(",") if item.strip()]
        if not metadata.get("id") or not metadata.get("title") or not metadata.get("url") or not content:
            raise ValueError("Every RAG chunk must include id, title, url, keywords, and content.")
        entries.append(
            {
                "id": metadata["id"],
                "title": metadata["title"],
                "url": metadata["url"],
                "content": content,
                "keywords": keywords,
            }
        )
    if not entries:
        raise ValueError(f"No RAG chunks were found in {KNOWLEDGE_FILE}.")
    ids = [str(entry["id"]) for entry in entries]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate RAG chunk IDs were found.")
    return entries


def load_core_knowledge() -> List[KnowledgeChunk]:
    return parse_knowledge_document(KNOWLEDGE_FILE.read_text(encoding="utf-8"))


def _is_valid_uploaded_source(value: object) -> bool:
    if not isinstance(value, dict):
        return False
    chunks = value.get("chunks")
    if (
        value.get("schemaVersion") != 1
        or not isinstance(value.get("id"), str)
        or not isinstance(value.get("title"), str)
        or not isinstance(value.get("createdAt"), str)
        or not isinstance(chunks, list)
    ):
        return False
    return all(
        isinstance(chunk, dict)
        and isinstance(chunk.get("id"), str)
        and isinstance(chunk.get("title"), str)
        and isinstance(chunk.get("url"), str)
        and isinstance(chunk.get("content"), str)
        and isinstance(chunk.get("keywords"), list)
        for chunk in chunks
    )


def _uploaded_source_files() -> List[Path]:
    if not UPLOAD_DIRECTORY.exists():
        return []
    return sorted(path for path in UPLOAD_DIRECTORY.iterdir() if path.is_file() and path.suffix == ".json")


def _read_uploaded_source(path: Path) -> Optional[UploadedSource]:
    try:
        parsed = json.loads(path.read_text(encoding="utf-8"))
        return parsed if _is_valid_uploaded_source(parsed) else None
    except (OSError, ValueError, TypeError) as error:
        print(f"[vrikshcrafts] Could not load knowledge source {path.name}: {error}")
        return None


def list_uploaded_sources() -> List[Dict[str, object]]:
    summaries: List[Dict[str, object]] = []
    for path in _uploaded_source_files():
        source = _read_uploaded_source(path)
        if not source:
            continue
        summary = {key: value for key, value in source.items() if key not in {"chunks", "rawText"}}
        summary["chunkCount"] = len(source["chunks"])
        summary["characterCount"] = len(str(source.get("rawText", "")))
        summaries.append(summary)
    return summaries


def get_knowledge_snapshot() -> Tuple[List[KnowledgeChunk], str]:
    files = _uploaded_source_files()
    sources = [source for source in (_read_uploaded_source(path) for path in files) if source]
    upload_revision = "|".join(
        f"{path.name}:{path.stat().st_size}:{path.stat().st_mtime_ns}" for path in files
    )
    core_stats = KNOWLEDGE_FILE.stat()
    documents = load_core_knowledge()
    for source in sources:
        documents.extend(source["chunks"])
    revision = f"{core_stats.st_size}:{core_stats.st_mtime_ns}|{upload_revision}"
    return documents, revision


def save_uploaded_source(source: UploadedSource) -> None:
    if not _is_valid_uploaded_source(source):
        raise ValueError("The processed knowledge source is invalid.")
    UPLOAD_DIRECTORY.mkdir(parents=True, exist_ok=True)
    destination = (UPLOAD_DIRECTORY / f"{source['id']}.json").resolve()
    if destination.parent != UPLOAD_DIRECTORY.resolve():
        raise ValueError("The knowledge source path is invalid.")
    temporary = destination.with_suffix(f".json.{os.getpid()}.tmp")
    with temporary.open("x", encoding="utf-8") as handle:
        json.dump(source, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
    os.replace(temporary, destination)


def delete_uploaded_source(source_id: str) -> bool:
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]{5,100}", source_id):
        return False
    target = (UPLOAD_DIRECTORY / f"{source_id}.json").resolve()
    if target.parent != UPLOAD_DIRECTORY.resolve() or not target.exists():
        return False
    target.unlink()
    return True
