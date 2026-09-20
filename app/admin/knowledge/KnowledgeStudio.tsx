"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type UploadedSource = {
  id: string;
  title: string;
  sourceUrl: string;
  originalFilename: string;
  createdAt: string;
  chunkCount: number;
  characterCount: number;
};

type PreviewChunk = {
  id: string;
  title: string;
  characters: number;
  content: string;
};

type DashboardData = {
  coreChunkCount: number;
  uploadedChunkCount: number;
  totalChunkCount: number;
  sources: UploadedSource[];
};

type SessionData = {
  configured: boolean;
  authenticated: boolean;
};

async function readJson(response: Response) {
  return (await response.json().catch(() => null)) as Record<string, unknown> | null;
}

export default function KnowledgeStudio() {
  const formRef = useRef<HTMLFormElement>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [preview, setPreview] = useState<PreviewChunk[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function loadDashboard() {
    const response = await fetch("/api/admin/knowledge", { cache: "no-store" });
    if (response.status === 401) {
      setSession((current) => ({
        configured: current?.configured ?? true,
        authenticated: false,
      }));
      setDashboard(null);
      return;
    }

    const data = await readJson(response);
    if (!response.ok) throw new Error(String(data?.error || "Could not load knowledge."));
    setDashboard(data as unknown as DashboardData);
  }

  useEffect(() => {
    let active = true;
    async function initialize() {
      try {
        const response = await fetch("/api/admin/knowledge/session", {
          cache: "no-store",
        });
        const data = (await response.json()) as SessionData;
        if (!active) return;
        setSession(data);
        if (data.authenticated) await loadDashboard();
      } catch {
        if (active) setError("Knowledge Studio could not connect to the server.");
      }
    }
    initialize();
    return () => {
      active = false;
    };
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/knowledge/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: form.get("token") }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(String(data?.error || "Login failed."));
      setSession({ configured: true, authenticated: true });
      event.currentTarget.reset();
      await loadDashboard();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    } finally {
      setIsBusy(false);
    }
  }

  function formData() {
    if (!formRef.current) throw new Error("The knowledge form is unavailable.");
    return new FormData(formRef.current);
  }

  async function previewDocument() {
    setIsBusy(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/knowledge?preview=1", {
        method: "POST",
        body: formData(),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(String(data?.error || "Preview failed."));
      const chunks = (data?.preview || []) as PreviewChunk[];
      setPreview(chunks);
      setNotice(
        `${chunks.length} chunk${chunks.length === 1 ? "" : "s"} ready for review. Nothing has been published yet.`,
      );
    } catch (previewError) {
      setPreview([]);
      setError(
        previewError instanceof Error ? previewError.message : "Preview failed.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function publishDocument() {
    if (preview.length === 0) return;
    setIsBusy(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/knowledge", {
        method: "POST",
        body: formData(),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(String(data?.error || "Publish failed."));
      formRef.current?.reset();
      setPreview([]);
      setNotice("Knowledge published. New chatbot questions use it immediately.");
      await loadDashboard();
    } catch (publishError) {
      setError(
        publishError instanceof Error ? publishError.message : "Publish failed.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function removeSource(source: UploadedSource) {
    const confirmed = window.confirm(
      `Remove “${source.title}” and its ${source.chunkCount} knowledge chunks?`,
    );
    if (!confirmed) return;

    setIsBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(
        `/api/admin/knowledge?id=${encodeURIComponent(source.id)}`,
        { method: "DELETE" },
      );
      const data = await readJson(response);
      if (!response.ok) throw new Error(String(data?.error || "Removal failed."));
      setNotice("Knowledge source removed from the chatbot index.");
      await loadDashboard();
    } catch (removeError) {
      setError(
        removeError instanceof Error ? removeError.message : "Removal failed.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/knowledge/session", { method: "DELETE" });
    setSession({ configured: true, authenticated: false });
    setDashboard(null);
    setPreview([]);
    setNotice("");
  }

  if (!session) {
    return (
      <section className="knowledge-shell">
        <div className="container knowledge-loading">Loading Knowledge Studio…</div>
      </section>
    );
  }

  if (!session.configured) {
    return (
      <section className="knowledge-shell">
        <div className="container knowledge-narrow">
          <p className="hero-kicker">Private administration</p>
          <h1 className="hero-title">Knowledge Studio needs one setup value</h1>
          <div className="knowledge-alert knowledge-alert-warning">
            Add a private value of at least 16 characters as
            <code> KNOWLEDGE_ADMIN_TOKEN </code> in <code>.env.local</code>, then
            restart the server. This protects the knowledge base from unauthorized
            changes.
          </div>
        </div>
      </section>
    );
  }

  if (!session.authenticated) {
    return (
      <section className="knowledge-shell">
        <div className="container knowledge-narrow">
          <p className="hero-kicker">Private administration</p>
          <h1 className="hero-title">Knowledge Studio</h1>
          <p className="hero-subtitle">
            Sign in to manage the information used by the vrikshcrafts assistant.
          </p>
          <form className="knowledge-login" onSubmit={login}>
            <label htmlFor="knowledge-token">Admin passphrase</label>
            <input
              id="knowledge-token"
              name="token"
              type="password"
              minLength={16}
              required
              autoComplete="current-password"
            />
            <button className="primary-btn" disabled={isBusy}>
              {isBusy ? "Signing in…" : "Open Knowledge Studio"}
            </button>
          </form>
          {error && <div className="knowledge-alert knowledge-alert-error">{error}</div>}
        </div>
      </section>
    );
  }

  return (
    <section className="knowledge-shell">
      <div className="container">
        <div className="knowledge-heading-row">
          <div>
            <p className="hero-kicker">Private administration</p>
            <h1 className="hero-title">Knowledge Studio</h1>
            <p className="hero-subtitle">
              Upload, review, and publish information used by the website assistant.
            </p>
          </div>
          <button className="knowledge-text-button" type="button" onClick={logout}>
            Sign out
          </button>
        </div>

        {dashboard && (
          <div className="knowledge-stats" aria-label="Knowledge statistics">
            <div><strong>{dashboard.totalChunkCount}</strong><span>Total chunks</span></div>
            <div><strong>{dashboard.coreChunkCount}</strong><span>Approved core</span></div>
            <div><strong>{dashboard.uploadedChunkCount}</strong><span>Uploaded</span></div>
            <div><strong>{dashboard.sources.length}</strong><span>Sources</span></div>
          </div>
        )}

        {notice && <div className="knowledge-alert knowledge-alert-success">{notice}</div>}
        {error && <div className="knowledge-alert knowledge-alert-error">{error}</div>}

        <div className="knowledge-layout">
          <div className="knowledge-card">
            <div className="knowledge-card-heading">
              <span>1</span>
              <div>
                <h2>Add a knowledge source</h2>
                <p>Upload Markdown, text, PDF, or Word, or paste approved information directly.</p>
              </div>
            </div>

            <form
              ref={formRef}
              className="knowledge-form"
              onChange={() => {
                setPreview([]);
                setNotice("");
              }}
              onSubmit={(event) => event.preventDefault()}
            >
              <label>
                Source title*
                <input name="title" minLength={3} maxLength={120} required placeholder="Example: Product care guide" />
              </label>
              <div className="knowledge-form-grid">
                <label>
                  Related website page
                  <input name="sourceUrl" defaultValue="/contact" placeholder="/catalog" />
                </label>
                <label>
                  Search keywords
                  <input name="keywords" maxLength={500} placeholder="care, cleaning, maintenance" />
                </label>
              </div>
              <label>
                Upload a document
                <input name="file" type="file" accept=".md,.markdown,.txt,.pdf,.docx,text/markdown,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                <small>Markdown, text, PDF, or Word (.docx), maximum 5 MB.</small>
              </label>
              <div className="knowledge-divider"><span>or paste text</span></div>
              <label>
                Approved knowledge
                <textarea
                  name="content"
                  rows={10}
                  maxLength={200000}
                  placeholder="Use headings to create clearer automatic chunks."
                />
              </label>
              <button
                type="button"
                className="knowledge-preview-button"
                disabled={isBusy}
                onClick={previewDocument}
              >
                {isBusy ? "Working…" : "Preview automatic chunks"}
              </button>
            </form>
          </div>

          <div className="knowledge-card">
            <div className="knowledge-card-heading">
              <span>2</span>
              <div>
                <h2>Review before publishing</h2>
                <p>Check that each chunk is factual, focused, and safe to show publicly.</p>
              </div>
            </div>

            {preview.length === 0 ? (
              <div className="knowledge-empty">
                A chunk preview will appear here. Nothing is added to the chatbot until
                you select Publish.
              </div>
            ) : (
              <>
                <div className="knowledge-preview-list">
                  {preview.map((chunk, index) => (
                    <article key={chunk.id}>
                      <div><strong>Chunk {index + 1}</strong><span>{chunk.characters} characters</span></div>
                      <h3>{chunk.title}</h3>
                      <p>{chunk.content}</p>
                    </article>
                  ))}
                </div>
                <button
                  type="button"
                  className="primary-btn knowledge-publish-button"
                  disabled={isBusy}
                  onClick={publishDocument}
                >
                  {isBusy ? "Publishing…" : `Publish ${preview.length} chunk${preview.length === 1 ? "" : "s"}`}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="knowledge-card knowledge-sources-card">
          <div className="knowledge-card-heading">
            <span>3</span>
            <div>
              <h2>Uploaded sources</h2>
              <p>The approved core Markdown remains separate and cannot be deleted here.</p>
            </div>
          </div>

          {!dashboard || dashboard.sources.length === 0 ? (
            <div className="knowledge-empty">No additional documents have been published.</div>
          ) : (
            <div className="knowledge-source-list">
              {dashboard.sources.map((source) => (
                <article key={source.id}>
                  <div>
                    <h3>{source.title}</h3>
                    <p>{source.originalFilename} · {source.chunkCount} chunks · {source.characterCount.toLocaleString()} characters</p>
                    <small>Published {new Date(source.createdAt).toLocaleString()}</small>
                  </div>
                  <button type="button" disabled={isBusy} onClick={() => removeSource(source)}>
                    Remove
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="knowledge-alert knowledge-alert-warning knowledge-storage-note">
          Published documents are stored in the site&apos;s durable knowledge store and remain
          available across deployments. Keep source material factual, approved, and free of
          private customer information.
        </div>
      </div>
    </section>
  );
}
