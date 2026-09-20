# vrikshcrafts RAG Architecture

## Current implementation

The customer-facing website remains a Next.js application. Contact delivery, chat, ingestion, retrieval, document extraction, OpenRouter access, sessions, and knowledge administration run in a separate Python FastAPI service. Same-origin Next.js proxy routes preserve the existing browser API contract.

The system does not currently call an embedding model or store vectors. The FastAPI service uses a zero-cost, local BM25-style lexical retriever over structured knowledge chunks.

```text
Next.js UI ─> same-origin API proxy ─> FastAPI
                                        │
Core Markdown ───────────────┐           │
                            ├─> validated chunks ─> live lexical index ─> top sources
Admin upload / pasted text ──┘                                      │
  └─ PDF / DOCX / MD / TXT extraction                               v
  └─ heading-aware automatic chunking                         OpenRouter answer
  └─ preview and explicit publish                             or local fallback
```

### Core knowledge

- File: `knowledge/vrikshcrafts-rag-knowledge-base.md`
- Maintained as reviewed, version-controlled business knowledge.
- Each `RAG-CHUNK` is a deliberate retrieval unit.
- Changes are detected through the file revision and reindexed on the next request.

### Uploaded knowledge

- Interface: `/admin/knowledge`
- Accepted formats: Markdown, text, PDF, Word `.docx`, or pasted text.
- Maximum file size: 5 MB.
- PDF safety limit: 75 pages with a 12-second extraction timeout.
- Processing: text extraction, normalization, heading and paragraph-aware chunking, preview, explicit publish.
- Storage: `knowledge/uploads/*.json`.
- Published and deleted sources refresh the retrieval index automatically.

### Retrieval and answering

1. The visitor question is normalized and tokenized.
2. Common Hinglish vocabulary and synonyms are normalized.
3. The retriever scores core and uploaded chunks using term frequency, inverse document frequency, titles, and keywords.
4. The best chunks are passed to the selected OpenRouter model when configured.
5. Without OpenRouter, the best source is returned through the deterministic local fallback.
6. Short or referential follow-ups are rewritten with the most recent user topic before retrieval.
7. The local answer engine ranks sentences across the best chunks instead of copying an entire document, then suggests relevant follow-up questions.
8. The model prompt uses direct-answer-first guidance, clarification behavior, compact formatting, and a final grounding check.
9. The answer policy prevents unsupported claims about pricing, stock, specifications, warranties, or delivery commitments.

## Security controls

- Knowledge Studio requires a server-side admin passphrase.
- Authentication uses a signed, HTTP-only, same-site session cookie with an eight-hour lifetime.
- Mutating requests require the same browser origin.
- Upload type, byte size, extracted text length, PDF page count, and chunk count are bounded.
- Filenames never control storage paths.
- Sources are previewed before publication.
- Core knowledge cannot be deleted from the admin interface.
- Uploaded source deletion is explicit and confirmed in the UI.

## Embedding upgrade boundary

For the present knowledge volume, lexical retrieval is fast, deterministic, and free. Vector embeddings become useful when the collection grows substantially or users ask conceptually similar questions without sharing the same terms.

A future hybrid design should preserve the existing chunk and repository formats:

1. Generate an embedding for every published chunk.
2. Store vectors with the chunk ID and source metadata in a persistent vector-capable database.
3. Generate one embedding for each visitor query.
4. Retrieve semantic candidates by cosine similarity.
5. Combine semantic scores with the existing lexical scores.
6. Rerank and pass only the best trusted chunks to the answer model.

The upload UI and chunking pipeline do not need to change when embeddings are added; only the indexing and retrieval adapters change.

## Deployment requirement

The current uploaded-source repository uses the local filesystem. This works on the development machine and persistent Python hosts. Before deploying to a serverless or multi-instance platform, replace the filesystem repository with persistent object storage or a database and move session/rate-limit state to shared storage. Deploy the Next.js frontend and FastAPI service independently, then set `PYTHON_API_URL` to the private FastAPI origin.
