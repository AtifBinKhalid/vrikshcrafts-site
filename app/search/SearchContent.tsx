"use client";

import { useSearchParams } from "next/navigation";
import {
  CATALOG_ITEMS,
  type CatalogItem,
} from "../../src/data/catalogData";

function filterCatalog(queryRaw: string | undefined): CatalogItem[] {
  if (!queryRaw) {
    // No query: show all items, ordered as defined
    return CATALOG_ITEMS;
  }

  const query = queryRaw.trim().toLowerCase();
  if (!query) return CATALOG_ITEMS;

  return CATALOG_ITEMS.filter((item) => {
    const haystack = (
      item.title +
      " " +
      item.subtitle +
      " " +
      item.description +
      " " +
      item.tags.join(" ")
    ).toLowerCase();

    return haystack.includes(query);
  });
}

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const results = filterCatalog(query);
  const hasQuery = !!query && query.trim().length > 0;

  return (
    <>
      {hasQuery ? (
        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "0.9rem",
            color: "var(--text-muted)",
          }}
        >
          Showing results for <strong>&quot;{query}&quot;</strong> —{" "}
          <strong>{results.length}</strong>{" "}
          {results.length === 1 ? "matching section" : "matching sections"}.
        </p>
      ) : (
        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "0.9rem",
            color: "var(--text-muted)",
          }}
        >
          No search term entered yet. The list below shows all catalog
          categories we typically work with.
        </p>
      )}

      <div className="catalog-grid" style={{ marginTop: "1.5rem" }}>
        {results.map((item) => (
          <article key={item.id} className="catalog-card">
            <h2 className="catalog-card-title">{item.title}</h2>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--accent-green-soft)",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                marginTop: "0.35rem",
                marginBottom: "0.6rem",
              }}
            >
              {item.subtitle}
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#fef3c7",
                marginBottom: "0.75rem",
              }}
            >
              {item.description}
            </p>
            {item.tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.3rem",
                  marginTop: "0.25rem",
                }}
              >
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      padding: "0.15rem 0.45rem",
                      borderRadius: "999px",
                      border: "1px solid rgba(248, 250, 252, 0.28)",
                      background:
                        "linear-gradient(to right, rgba(248, 250, 252, 0.08), rgba(248, 250, 252, 0.18))",
                      color: "#fef3c7",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      {hasQuery && results.length === 0 && (
        <p
          style={{
            marginTop: "1.4rem",
            fontSize: "0.9rem",
            color: "var(--text-muted)",
          }}
        >
          We didn&apos;t find a direct match. Try broader words like{" "}
          <strong>wall</strong>, <strong>table</strong>, <strong>office</strong>,{" "}
          <strong>cafe</strong>, or <strong>gift</strong>.
        </p>
      )}
    </>
  );
}
