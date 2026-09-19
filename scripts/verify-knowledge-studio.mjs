import { readFileSync } from "node:fs";

const baseUrl = process.env.VERIFY_BASE_URL || "http://localhost:3000";
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const token = env.match(/^KNOWLEDGE_ADMIN_TOKEN=(.+)$/m)?.[1]?.trim();
if (!token) throw new Error("KNOWLEDGE_ADMIN_TOKEN is not configured.");

const originHeaders = { Origin: baseUrl };
const login = await fetch(`${baseUrl}/api/admin/knowledge/session`, {
  method: "POST",
  headers: { ...originHeaders, "Content-Type": "application/json" },
  body: JSON.stringify({ token }),
});
if (!login.ok) throw new Error(`Knowledge Studio login failed: ${login.status}`);

const cookie = login.headers.get("set-cookie")?.split(";")[0];
if (!cookie) throw new Error("Knowledge Studio did not issue a session cookie.");

function uploadForm() {
  const form = new FormData();
  form.set("title", "Juniper verification source");
  form.set("sourceUrl", "/services");
  form.set("keywords", "juniper, verification, temporary");
  form.set(
    "content",
    "# Juniper verification\nThe Juniper verification phrase exists only to validate automatic knowledge ingestion and live retrieval. It is temporary test content.",
  );
  return form;
}

let sourceId = "";
try {
  const previewResponse = await fetch(
    `${baseUrl}/api/admin/knowledge?preview=1`,
    {
      method: "POST",
      headers: { ...originHeaders, Cookie: cookie },
      body: uploadForm(),
    },
  );
  const preview = await previewResponse.json();
  if (!previewResponse.ok || preview.chunkCount !== 1) {
    throw new Error(`Knowledge preview failed: ${previewResponse.status}`);
  }

  const publishResponse = await fetch(`${baseUrl}/api/admin/knowledge`, {
    method: "POST",
    headers: { ...originHeaders, Cookie: cookie },
    body: uploadForm(),
  });
  const published = await publishResponse.json();
  if (!publishResponse.ok || !published.source?.id) {
    throw new Error(`Knowledge publish failed: ${publishResponse.status}`);
  }
  sourceId = published.source.id;

  const chatResponse = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { ...originHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "What is the Juniper verification phrase for?",
      history: [],
      visitorName: "Verification User",
      website: "",
    }),
  });
  const chat = await chatResponse.json();
  const retrieved =
    chatResponse.ok &&
    chat.sources?.some((source) => String(source.id).startsWith(sourceId));
  if (!retrieved) throw new Error("Published knowledge was not retrieved by chat.");

  console.log(
    JSON.stringify({
      login: "passed",
      previewChunks: preview.chunkCount,
      publish: "passed",
      liveRetrieval: "passed",
    }),
  );
} finally {
  if (sourceId) {
    const deletion = await fetch(
      `${baseUrl}/api/admin/knowledge?id=${encodeURIComponent(sourceId)}`,
      {
        method: "DELETE",
        headers: { ...originHeaders, Cookie: cookie },
      },
    );
    if (!deletion.ok) {
      throw new Error(`Temporary-source cleanup failed: ${deletion.status}`);
    }
  }
}
