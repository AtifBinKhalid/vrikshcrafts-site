import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services · vrikshcrafts — Custom Saharanpur wood decor",
  description:
    "See how vrikshcrafts designs and produces custom wooden signage, feature panels, tabletop decor, and small fixtures for cafés, offices, studios, and decor / gift stores.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Services · vrikshcrafts — Custom Saharanpur wood decor",
    description:
      "Custom wood decor design and B2B supply from Saharanpur for cafés, offices, studios, and decor / gift stores.",
    url: "/services",
    type: "website",
    siteName: "vrikshcrafts",
  },
  twitter: {
    card: "summary",
    title: "Services · vrikshcrafts — Custom Saharanpur wood decor",
    description:
      "B2B-focused custom wooden signage, wall panels, tabletop decor, and fixtures from vrikshcrafts.",
  },
  keywords: [
    "vrikshcrafts services",
    "custom wooden signage",
    "Saharanpur wood decor services",
    "cafe wood decor",
    "office wood signage",
    "tabletop wooden fixtures",
  ],
};

export default function ServicesPage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <p className="hero-kicker">Our services · vrikshcrafts</p>

          <h1 className="hero-title">
            Custom wood design and support for your business.
          </h1>
          <p className="hero-subtitle">
            Vrikshcrafts designs and produces specific wooden pieces for your brand
            – signage, feature panels, tabletop decor, and small fixtures – and
            supports your project with clear sizes, drawings, and coordination.
          </p>

          <div className="hero-actions">
            <a href="/contact" className="primary-btn">
              Talk about a custom project
            </a>
            <a href="/catalog" className="secondary-link">
              See example decor categories
            </a>
          </div>
        </div>
      </section>

      {/* MAIN SERVICES AS CARDS */}
      <section className="catalog-section">
        <div className="container">
          <h2
            className="section-title"
            style={{
              fontSize: "1.15rem", // larger + golden (from section-title)
              marginTop: 0,
              marginBottom: "0.75rem",
            }}
          >
            What vrikshcrafts can do for your business
          </h2>

          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              maxWidth: "46rem",
              marginBottom: "1.2rem",
            }}
          >
            Our focus stays on wood. Instead of generic catalog items, we design
            and make decor that fits your logo, brand tone, and real world usage
            – from reception boards to menu holders and wall pieces.
          </p>

          <div className="catalog-grid">
            {/* 1. Core B2B wood decor supply */}
            <div className="catalog-card">
              <p className="catalog-card-title">
                B2B wood decor supply from Saharanpur
              </p>
              <p>
                Vrikshcrafts supplies finished wooden decor for cafés, offices, studios,
                and stores – logo boards, reception signage, wall panels, shelves, menu
                boards, tabletop decor, and small fixtures – produced in Saharanpur with
                consistent finishing and agreed timelines.
              </p>
              <p className="catalog-tagline">
                Core service · made-to-order supply
              </p>
            </div>

            {/* 2. Custom wood decor & signage design */}
            <div className="catalog-card">
              <p className="catalog-card-title">
                Custom wood decor & signage design
              </p>
              <p>
                When you need something unique for your brand – a special feature wall,
                a custom logo board, or branded menu pieces – vrikshcrafts helps shape
                the concept, proportions, and details so the final wooden piece feels
                right for your space and usage.
              </p>
              <p className="catalog-tagline">
                Designed around your brand
              </p>
            </div>

            {/* 3. Drawings and coordination for projects */}
            <div className="catalog-card">
              <p className="catalog-card-title">
                Drawings & coordination for projects
              </p>
              <p>
                For projects with designers or contractors, we provide simple 2D
                drawings, measurements, and clarifications for the wood pieces we
                supply, and coordinate on sizes and finishes so our decor fits smoothly
                into the overall plan without replacing your existing design team.
              </p>
              <p className="catalog-tagline">
                Project-friendly support, not full interiors
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section
        style={{
          backgroundColor: "var(--bg-card)",
          padding: "2rem 0 2.3rem",
          borderTop: "1px solid var(--border-soft)",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <div className="container">
          <h2
            className="section-title"
            style={{
              fontSize: "1.15rem", // same style here too
              marginTop: 0,
              marginBottom: "0.75rem",
            }}
          >
            How a typical custom project runs
          </h2>

          <ol
            style={{
              margin: 0,
              paddingLeft: "1.1rem",
              fontSize: "0.9rem",
              color: "var(--text-muted)",
            }}
          >
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Brief.</strong> You share your business type, logo,
              photos of the space, and what you want in wood – for example a
              reception board, wall panel, or menu boards.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Concept direction.</strong> vrikshcrafts suggests
              simple directions (natural wood, darker stain, raised letters,
              engraving, etc.) and rough layouts for the key pieces.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Design detailing.</strong> For selected pieces, we
              fix sizes, materials, finishes, and create clear drawings so the
              workshop can build them and your team knows where they fit.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Quote & approval.</strong> You receive a clear quote
              with quantities, lead times, and reference visuals. Once approved,
              we move into production.
            </li>
            <li>
              <strong>Production & delivery.</strong> Our Saharanpur
              workshop produces the pieces. After a basic quality check, we ship
              them to you as ready-to-install decor, along with any final
              drawings needed on site.
            </li>
          </ol>

          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
            }}
          >
            Everything stays focused on wood decor and small fixtures. We do not
            replace your interior designer or architect – we support them by
            taking full responsibility for the wooden elements.
          </p>

          <a
            href="/contact"
            className="primary-btn"
            style={{ marginTop: "1rem", display: "inline-flex" }}
          >
            Start a custom wood project
          </a>
        </div>
      </section>
    </>
  );
}
