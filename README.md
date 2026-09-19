# vrikshcrafts website

A Next.js frontend with a Python FastAPI backend for the vrikshcrafts B2B wood-decor business. Marketing pages are statically generated, catalog search runs locally in the browser, and FastAPI handles contact delivery, chat, RAG retrieval, document ingestion, and Knowledge Studio sessions.

## Local setup

1. Install frontend dependencies with `npm install`.
2. Create the Python environment with `python -m venv .venv`.
3. Install the AI service with `.venv\\Scripts\\python.exe -m pip install -r backend/requirements.txt` on Windows, or `.venv/bin/python -m pip install -r backend/requirements.txt` on macOS/Linux.
4. Copy `.env.example` to `.env.local` and replace the example values.
5. Start both services with `npm run dev`.
6. Open <http://localhost:3000>.

`npm run dev` starts the Next.js interface on port 3000 and the FastAPI AI service on port 8000. The browser continues to call the same `/api/...` URLs; thin Next.js routes forward those requests to FastAPI using `PYTHON_API_URL`.

The Python contact endpoint deliberately returns an unavailable response when SMTP is incomplete. It never reports a successful enquiry unless the message was accepted by the configured SMTP server.

## Website assistant

The chatbot backend is implemented with Python and FastAPI. It uses a curated public knowledge base and local BM25-style retrieval. Its authoritative source is `knowledge/vrikshcrafts-rag-knowledge-base.md`; the editing instructions and reusable chunk template are at the top of that file. Core edits are detected automatically on the next request. It works in retrieval-only mode when no model is configured, which makes local development deterministic and free.

To enable generated RAG answers, configure `OPENROUTER_API_KEY`. The production default is the free `deepseek/deepseek-v4-flash-0731:free` model with `openrouter/free` as an availability fallback. You can override either choice with `OPENROUTER_MODEL` and the comma-separated `OPENROUTER_FALLBACK_MODELS`. Setting `OPENROUTER_FALLBACK_MODELS` to an empty value disables the fallback. The API sends only the visitor's question, recent chat turns, and retrieved public website passages to the selected provider. Conversations are not persisted by this application.

The FastAPI service keeps request counters in memory as a safe local and single-instance baseline. A distributed deployment should replace them with a shared rate-limit store such as platform KV or Redis.

### Knowledge Studio

Open `/admin/knowledge` to manage additional chatbot knowledge. Set a private `KNOWLEDGE_ADMIN_TOKEN` of at least 16 characters before use. The studio supports Markdown, text, PDF, and Word (`.docx`) files up to 5 MB, plus pasted text. Every document is extracted, split by headings and paragraphs, previewed, and published only after explicit approval.

The approved core source remains `knowledge/vrikshcrafts-rag-knowledge-base.md`. Studio uploads are written to `knowledge/uploads` and become searchable immediately without a server restart. Local filesystem storage is suitable for development or a persistent Python host; serverless deployment requires a persistent repository adapter backed by object storage or a database.

The current zero-cost retriever uses BM25-style lexical ranking rather than vector embeddings. See `docs/rag-architecture.md` for the current data flow and the planned hybrid vector upgrade boundary.

## Commands

- `npm run dev` — start Next.js and FastAPI together
- `npm run dev:web` — start only Next.js
- `npm run dev:api` — start only FastAPI
- `npm run lint` — run ESLint
- `npm run test` — run frontend and Python backend tests
- `npm run build` — create a production build
- `npm run check` — run the complete verification sequence

## Deployment configuration

- `NEXT_PUBLIC_SITE_URL` controls canonical URLs, sitemap links, and metadata.
- `PYTHON_API_URL` tells the Next.js proxy where the FastAPI service is available.
- `APP_ENV=production` enables production-only backend security settings.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, and `SMTP_TO` configure enquiry delivery.

For sustained or distributed traffic, replace the in-memory contact rate limiter with a shared store provided by the deployment platform.
