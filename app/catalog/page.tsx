// import type { Metadata } from "next";
// import { CATALOG_ITEMS } from "../../src/data/catalogData";

// export const metadata: Metadata = {
//   title: "Catalog · vrikshcrafts",
//   description:
//     "Explore how vrikshcrafts wooden decor can be used across walls, counters, tabletops, signage, and giftable items for cafés, offices, and decor stores.",
// };

// export default function CatalogPage() {
//   return (
//     <section className="catalog-section">
//       <div className="container">
//         <p className="hero-kicker">Catalog</p>
//         <h1 className="hero-title">How vrikshcrafts can fit into your space</h1>
//         <p className="hero-subtitle">
//           These are example categories we usually work with. Each project is customised,
//           but this gives you a clear idea of the kind of decor vrikshcrafts can supply
//           for cafés, offices, studios, and decor / gift stores.
//         </p>

//         {/* Catalog cards */}
//         <div className="catalog-grid" style={{ marginTop: "1.4rem" }}>
//           {CATALOG_ITEMS.map((item) => (
//             <article key={item.id} className="catalog-card">
//               <h2 className="catalog-card-title">{item.title}</h2>
//               <p
//                 style={{
//                   fontSize: "0.85rem",
//                   color: "var(--accent-green-soft)",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.16em",
//                   marginTop: "0.35rem",
//                   marginBottom: "0.6rem",
//                 }}
//               >
//                 {item.subtitle}
//               </p>
//               <p
//                 style={{
//                   fontSize: "0.85rem",
//                   color: "#fef3c7",
//                   marginBottom: "0.75rem",
//                 }}
//               >
//                 {item.description}
//               </p>

//               {item.tags.length > 0 && (
//                 <div
//                   style={{
//                     display: "flex",
//                     flexWrap: "wrap",
//                     gap: "0.3rem",
//                     marginTop: "0.25rem",
//                   }}
//                 >
//                   {item.tags.map((tag) => (
//                     <span
//                       key={tag}
//                       style={{
//                         fontSize: "0.7rem",
//                         textTransform: "uppercase",
//                         letterSpacing: "0.12em",
//                         padding: "0.15rem 0.45rem",
//                         borderRadius: "999px",
//                         border: "1px solid rgba(248, 250, 252, 0.28)",
//                         background:
//                           "linear-gradient(to right, rgba(248, 250, 252, 0.08), rgba(248, 250, 252, 0.18))",
//                         color: "#fef3c7",
//                       }}
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//               )}
//             </article>
//           ))}
//         </div>

//         {/* NEW: small “where these pieces usually go” use-case block BELOW the cards */}
//         <div
//           style={{
//             marginTop: "1.8rem",
//             background:
//               "radial-gradient(circle at top left, #f4e4d1 0, #e5c9a6 70%)",
//             borderRadius: "var(--radius-card)",
//             border: "1px solid var(--border-soft)",
//             padding: "0.9rem 1.1rem",
//             boxShadow: "var(--shadow-soft)",
//             fontSize: "0.9rem",
//             color: "var(--text-main)",
//           }}
//         >
//           <p
//             style={{
//               marginTop: 0,
//               marginBottom: "0.5rem",
//               fontSize: "0.95rem",
//               fontWeight: 600,
//               color: "var(--text-main)",
//             }}
//           >
//             Where these pieces usually go
//           </p>
//           <ul
//             style={{
//               margin: 0,
//               paddingLeft: "1.1rem",
//               color: "var(--text-muted)",
//             }}
//           >
//             <li style={{ marginBottom: "0.25rem" }}>
//               Accent walls near the cash counter or behind seating in cafés and restaurants.
//             </li>
//             <li style={{ marginBottom: "0.25rem" }}>
//               Reception backdrops, meeting room walls, and small shelves in offices and studios.
//             </li>
//             <li style={{ marginBottom: "0.25rem" }}>
//               Tabletops, product-display shelves, and window spots in decor / gift stores.
//             </li>
//             <li>
//               Branded gifting pieces for clients, guests, or internal company events.
//             </li>
//           </ul>
//         </div>
//       </div>
//     </section>
//   );
// }
import type { Metadata } from "next";
import { CATALOG_ITEMS } from "../../src/data/catalogData";

export const metadata: Metadata = {
  title: "Catalog · vrikshcrafts — Saharanpur wood decor",
  description:
    "Explore how vrikshcrafts wooden decor can be used across walls, counters, tabletops, signage, and giftable items for cafés, offices, studios, and decor / gift stores.",
  alternates: {
    canonical: "/catalog",
  },
  openGraph: {
    title: "Catalog · vrikshcrafts — Saharanpur wood decor",
    description:
      "Browse example wooden decor categories from vrikshcrafts and see how they fit into café, office, studio, and decor / gift store spaces.",
    url: "/catalog",
    type: "website",
    siteName: "vrikshcrafts",
  },
  twitter: {
    card: "summary",
    title: "Catalog · vrikshcrafts — Saharanpur wood decor",
    description:
      "Catalog view of vrikshcrafts wooden decor categories for cafés, offices, studios, and decor / gift stores.",
  },
  keywords: [
    "vrikshcrafts catalog",
    "Saharanpur wood decor catalog",
    "cafe wall decor",
    "office wooden signage",
    "tabletop wooden decor",
    "giftable wooden items",
  ],
};

export default function CatalogPage() {
  return (
    <section className="catalog-section">
      <div className="container">
        <p className="hero-kicker">Catalog</p>
        <h1 className="hero-title">How vrikshcrafts can fit into your space</h1>
        <p className="hero-subtitle">
          These are example categories we usually work with. Each project is customised,
          but this gives you a clear idea of the kind of decor vrikshcrafts can supply
          for cafés, offices, studios, and decor / gift stores.
        </p>

        {/* Catalog cards */}
        <div className="catalog-grid" style={{ marginTop: "1.4rem" }}>
          {CATALOG_ITEMS.map((item) => (
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

        {/* NEW: small “where these pieces usually go” use-case block BELOW the cards */}
        <div
          style={{
            marginTop: "1.8rem",
            background:
              "radial-gradient(circle at top left, #f4e4d1 0, #e5c9a6 70%)",
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--border-soft)",
            padding: "0.9rem 1.1rem",
            boxShadow: "var(--shadow-soft)",
            fontSize: "0.9rem",
            color: "var(--text-main)",
          }}
        >
          <p
            style={{
              marginTop: 0,
              marginBottom: "0.5rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "var(--text-main)",
            }}
          >
            Where these pieces usually go
          </p>
          <ul
            style={{
              margin: 0,
              paddingLeft: "1.1rem",
              color: "var(--text-muted)",
            }}
          >
            <li style={{ marginBottom: "0.25rem" }}>
              Accent walls near the cash counter or behind seating in cafés and restaurants.
            </li>
            <li style={{ marginBottom: "0.25rem" }}>
              Reception backdrops, meeting room walls, and small shelves in offices and studios.
            </li>
            <li style={{ marginBottom: "0.25rem" }}>
              Tabletops, product-display shelves, and window spots in decor / gift stores.
            </li>
            <li>
              Branded gifting pieces for clients, guests, or internal company events.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
