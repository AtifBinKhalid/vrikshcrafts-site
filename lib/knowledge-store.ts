import { getStore } from "@netlify/blobs";

const STORE_NAME = "vrikshcrafts-knowledge";
const MAX_SOURCES = 50;
const MAX_TOTAL_CHARACTERS = 2_000_000;

export type KnowledgeChunk = {
  id: string;
  title: string;
  url: string;
  content: string;
  keywords: string[];
};

export type PersistentKnowledgeSource = {
  schemaVersion: 1;
  id: string;
  title: string;
  sourceUrl: string;
  keywords: string[];
  originalFilename: string;
  createdAt: string;
  updatedAt: string;
  characterCount: number;
  chunks: KnowledgeChunk[];
};

function store() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export function hasPersistentKnowledgeStore() {
  return process.env.NETLIFY === "true" || Boolean(process.env.NETLIFY_SITE_ID);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isChunk(value: unknown): value is KnowledgeChunk {
  if (!value || typeof value !== "object") return false;
  const chunk = value as Record<string, unknown>;
  return (
    typeof chunk.id === "string" &&
    typeof chunk.title === "string" &&
    typeof chunk.url === "string" &&
    typeof chunk.content === "string" &&
    isStringArray(chunk.keywords)
  );
}

export function normalizePersistentSource(value: unknown): PersistentKnowledgeSource | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  if (
    source.schemaVersion !== 1 ||
    typeof source.id !== "string" ||
    typeof source.title !== "string" ||
    typeof source.sourceUrl !== "string" ||
    !isStringArray(source.keywords) ||
    typeof source.originalFilename !== "string" ||
    typeof source.createdAt !== "string" ||
    typeof source.updatedAt !== "string" ||
    !Array.isArray(source.chunks) ||
    !source.chunks.every(isChunk)
  ) {
    return null;
  }

  const rawText = typeof source.rawText === "string" ? source.rawText : "";
  const characterCount =
    typeof source.characterCount === "number" && Number.isFinite(source.characterCount)
      ? Math.max(0, Math.floor(source.characterCount))
      : rawText.length;

  return {
    schemaVersion: 1,
    id: source.id,
    title: source.title,
    sourceUrl: source.sourceUrl,
    keywords: source.keywords,
    originalFilename: source.originalFilename,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
    characterCount,
    chunks: source.chunks,
  };
}

export async function listPersistentSources(): Promise<PersistentKnowledgeSource[]> {
  if (!hasPersistentKnowledgeStore()) return [];
  const knowledgeStore = store();
  const { blobs } = await knowledgeStore.list();
  const values = await Promise.all(
    blobs.slice(0, MAX_SOURCES).map(({ key }) =>
      knowledgeStore.get(key, { type: "json", consistency: "strong" }),
    ),
  );
  return values
    .map(normalizePersistentSource)
    .filter((source): source is PersistentKnowledgeSource => source !== null)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function savePersistentSource(value: unknown) {
  if (!hasPersistentKnowledgeStore()) return false;
  const source = normalizePersistentSource(value);
  if (!source) throw new Error("The processed knowledge source is invalid.");

  const existing = await listPersistentSources();
  const withoutCurrent = existing.filter((item) => item.id !== source.id);
  const totalCharacters = withoutCurrent.reduce((sum, item) => sum + item.characterCount, 0);
  if (withoutCurrent.length >= MAX_SOURCES || totalCharacters + source.characterCount > MAX_TOTAL_CHARACTERS) {
    throw new Error("Knowledge storage is full. Remove an older source before publishing another document.");
  }

  await store().setJSON(source.id, source);
  return true;
}

export async function deletePersistentSource(sourceId: string) {
  if (!hasPersistentKnowledgeStore()) return false;
  if (!/^[a-z0-9][a-z0-9-]{5,100}$/.test(sourceId)) return false;
  const knowledgeStore = store();
  const existing = await knowledgeStore.getMetadata(sourceId, { consistency: "strong" });
  if (!existing) return false;
  await knowledgeStore.delete(sourceId);
  return true;
}

export function summarizePersistentSource(source: PersistentKnowledgeSource) {
  return {
    id: source.id,
    title: source.title,
    sourceUrl: source.sourceUrl,
    keywords: source.keywords,
    originalFilename: source.originalFilename,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
    chunkCount: source.chunks.length,
    characterCount: source.characterCount,
  };
}
