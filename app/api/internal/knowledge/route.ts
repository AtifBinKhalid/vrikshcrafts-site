import { timingSafeEqual } from "node:crypto";
import { listPersistentSources } from "../../../../lib/knowledge-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const expected = process.env.PYTHON_API_SHARED_SECRET?.trim() || "";
  const provided = request.headers.get("x-vrikshcrafts-proxy-key") || "";
  if (expected.length < 16 || expected.length !== provided.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return Response.json(
      { error: "The knowledge store request is not authorized." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const sources = await listPersistentSources();
    return Response.json({ sources }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("[vrikshcrafts] Internal knowledge read failed:", error);
    return Response.json(
      { error: "The persistent knowledge store is unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
