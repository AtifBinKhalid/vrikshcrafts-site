# vrikshcrafts website

A Next.js frontend with a Python FastAPI backend for the vrikshcrafts B2B wood-decor business. Marketing pages are statically generated, catalog search runs locally in the browser, FastAPI handles chat, RAG retrieval, document ingestion, and Knowledge Studio sessions, and the Netlify-hosted Next.js contact route delivers enquiry email.

## Local setup

1. Install frontend dependencies with `npm install`.
2. Create the Python environment with `python -m venv .venv`.
3. Install the AI service with `.venv\\Scripts\\python.exe -m pip install -r backend/requirements.txt` on Windows, or `.venv/bin/python -m pip install -r backend/requirements.txt` on macOS/Linux.
4. Copy `.env.example` to `.env.local` and replace the example values.
5. Start both services with `npm run dev`.
6. Open <http://localhost:3000>.

`npm run dev` starts the Next.js interface on port 3000 and the FastAPI AI service on port 8000. The browser continues to call the same `/api/...` URLs; thin Next.js chat and Knowledge Studio routes forward those requests to FastAPI using `PYTHON_API_URL`.

`PYTHON_API_SHARED_SECRET` should contain the same long random value in the Next.js and FastAPI environments. In production, FastAPI rejects API requests that do not arrive through the trusted Next.js proxy.

The contact route remains on the Next.js host because Render's free service blocks common SMTP ports. It validates and rate-limits enquiries and never reports success unless the configured SMTP server accepts the message.

## Website assistant

The chatbot backend is implemented with Python and FastAPI. It uses a curated public knowledge base and local BM25-style retrieval. Its authoritative source is `knowledge/vrikshcrafts-rag-knowledge-base.md`; the editing instructions and reusable chunk template are at the top of that file. Core edits are detected automatically on the next request. It works in retrieval-only mode when no model is configured, which makes local development deterministic and free.

To enable generated RAG answers, configure `OPENROUTER_API_KEY`. The production default is the free `deepseek/deepseek-v4-flash-0731:free` model with `openrouter/free` as an availability fallback. You can override either choice with `OPENROUTER_MODEL` and the comma-separated `OPENROUTER_FALLBACK_MODELS`. Setting `OPENROUTER_FALLBACK_MODELS` to an empty value disables the fallback. The API sends only the visitor's question, recent chat turns, and retrieved public website passages to the selected provider. Conversations are not persisted by this application.

The FastAPI service keeps request counters in memory as a safe local and single-instance baseline. A distributed deployment should replace them with a shared rate-limit store such as platform KV or Redis.

### Knowledge Studio

Open `/admin/knowledge` to manage additional chatbot knowledge. Set a private `KNOWLEDGE_ADMIN_TOKEN` of at least 16 characters before use. The studio supports Markdown, text, PDF, and Word (`.docx`) files up to 5 MB, plus pasted text. Every document is extracted, split by headings and paragraphs, previewed, and published only after explicit approval.

The approved core source remains `knowledge/vrikshcrafts-rag-knowledge-base.md`. In local development, Studio uploads are written to `knowledge/uploads` and become searchable immediately without a server restart. On Netlify, the same documents are mirrored into a strongly consistent, site-wide Netlify Blobs store. FastAPI reads that private store through `/api/internal/knowledge`, authenticated with `PYTHON_API_SHARED_SECRET`, so published uploads survive both frontend deploys and Render restarts.

The current zero-cost retriever uses BM25-style lexical ranking rather than vector embeddings. See `docs/rag-architecture.md` for the current data flow and the planned hybrid vector upgrade boundary.

## Commands

- `npm run dev` — start Next.js and FastAPI together
- `npm run dev:web` — start only Next.js
- `npm run dev:api` — start only FastAPI
- `npm run lint` — run ESLint
- `npm run test` — run the Python backend tests
- `npm run build` — create a production build
- `npm run check` — run the complete verification sequence

## Deployment configuration

- `NEXT_PUBLIC_SITE_URL` controls canonical URLs, sitemap links, and metadata.
- `PYTHON_API_URL` tells the Next.js proxy where the FastAPI service is available.
- `APP_ENV=production` enables production-only backend security settings.
- `PYTHON_API_SHARED_SECRET` authenticates calls from the Netlify Next.js proxy to FastAPI.
- `KNOWLEDGE_STORE_URL` lets FastAPI read durable Knowledge Studio uploads from Netlify. Production uses `https://vrikshcrafts.netlify.app/api/internal/knowledge`.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, and `SMTP_TO` configure enquiry delivery in the Netlify-hosted Next.js route.

For sustained or distributed traffic, replace the per-instance contact and chat rate limiters with a shared store provided by the deployment platform.

### Netlify frontend and Render API

`render.yaml` defines a free FastAPI web service for the `python-fastapi-rag` branch. After Render provides the service URL, add that HTTPS origin as `PYTHON_API_URL` in Netlify. Set the same `PYTHON_API_SHARED_SECRET` in both services, add `KNOWLEDGE_ADMIN_TOKEN` on Render, then redeploy Netlify before merging this branch into `main`.

Render's free filesystem is ephemeral. The reviewed core Markdown is always restored from Git, and production Knowledge Studio uploads are durably mirrored to the existing Netlify project's site-wide Blobs store. The application limits this store to 50 sources and 2,000,000 extracted characters to keep the free deployment predictable.
