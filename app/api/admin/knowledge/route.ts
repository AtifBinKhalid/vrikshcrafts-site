import { proxyPythonApi } from "../../../../lib/python-api";
import {
  deletePersistentSource,
  hasPersistentKnowledgeStore,
  listPersistentSources,
  savePersistentSource,
  summarizePersistentSource,
} from "../../../../lib/knowledge-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const upstream = await proxyPythonApi(request);
  if (!upstream.ok || !hasPersistentKnowledgeStore()) return upstream;

  const dashboard = (await upstream.json()) as Record<string, unknown>;
  try {
    const persisted = await listPersistentSources();
    const localSources = Array.isArray(dashboard.sources) ? dashboard.sources : [];
    const merged = new Map<string, Record<string, unknown>>();
    for (const source of localSources) {
      if (source && typeof source === "object" && typeof (source as { id?: unknown }).id === "string") {
        merged.set((source as { id: string }).id, source as Record<string, unknown>);
      }
    }
    for (const source of persisted) merged.set(source.id, summarizePersistentSource(source));
    const sources = [...merged.values()].sort((left, right) =>
      String(right.createdAt || "").localeCompare(String(left.createdAt || "")),
    );
    const coreChunkCount = Number(dashboard.coreChunkCount || 0);
    const uploadedChunkCount = sources.reduce(
      (sum, source) => sum + Number(source.chunkCount || 0),
      0,
    );
    return Response.json(
      { coreChunkCount, uploadedChunkCount, totalChunkCount: coreChunkCount + uploadedChunkCount, sources },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[vrikshcrafts] Persistent knowledge listing failed:", error);
    return Response.json(
      { error: "Knowledge Studio could not read durable storage. Please try again." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function POST(request: Request) {
  const upstream = await proxyPythonApi(request);
  const contentType = upstream.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return upstream;
  const payload = (await upstream.json()) as Record<string, unknown>;
  const persistentSource = payload.persistentSource;
  delete payload.persistentSource;

  if (!upstream.ok || !persistentSource || !hasPersistentKnowledgeStore()) {
    return Response.json(payload, {
      status: upstream.status,
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    await savePersistentSource(persistentSource);
    return Response.json(payload, { status: upstream.status, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[vrikshcrafts] Persistent knowledge write failed:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The document could not be saved to durable storage.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function DELETE(request: Request) {
  const upstream = await proxyPythonApi(request);
  if (![200, 404].includes(upstream.status) || !hasPersistentKnowledgeStore()) return upstream;
  const sourceId = new URL(request.url).searchParams.get("id") || "";
  try {
    const deleted = await deletePersistentSource(sourceId);
    if (deleted || upstream.ok) {
      return Response.json({ deleted: true }, { headers: { "Cache-Control": "no-store" } });
    }
    return upstream;
  } catch (error) {
    console.error("[vrikshcrafts] Persistent knowledge deletion failed:", error);
    return Response.json(
      { error: "The document could not be removed from durable storage." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
