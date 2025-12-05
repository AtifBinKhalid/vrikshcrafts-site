"use client";

import { useSearchParams } from "next/navigation";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim();

  return (
    <section className="hero">
      <div className="container">
        <p className="hero-kicker">Search · vrikshcrafts</p>
        <h1 className="hero-title">Search is not active yet.</h1>
        <p className="hero-subtitle">
          We are still setting up a searchable catalog. For now, you can browse
          the main catalog page instead.
        </p>

        {query && (
          <p className="hero-subtitle">
            You searched for: <strong>{query}</strong>
          </p>
        )}

        <div className="hero-actions">
          <a href="/catalog" className="primary-btn">
            Browse catalog
          </a>
          <a href="/contact" className="secondary-link">
            Start a project enquiry
          </a>
        </div>
      </div>
    </section>
  );
}
