// import FaqSection from "../components/FaqSection";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "About vrikshcrafts",
//   description:
//     "Learn how vrikshcrafts connects Saharanpur’s handcrafted wood decor with cafes, offices, designers, and decor stores worldwide.",
// };

// export default function AboutPage() {
//   return (
//     <>
//     <section className="about-section">
//       <div className="container">
//         <p className="hero-kicker">About vrikshcrafts</p>
//         <h1 className="hero-title">Saharanpur woodcraft, built for modern spaces.</h1>
//         <p className="hero-subtitle">
//           Vrikshcrafts is a Saharanpur-based wood decor partner that focuses on
//           B2B needs. We connect traditional workshops with cafes, offices,
//           interior designers, and decor / gift stores in a structured, project-first way.
//         </p>

//         {/* Brand story cards */}
//         <div
//           style={{
//             marginTop: "2rem",
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
//             gap: "1rem",
//           }}
//         >
//           {/* Card 1: Idea behind vrikshcrafts */}
//           <article className="catalog-card">
//             <h2
//               className="section-title"
//               style={{
//                 marginTop: 0,
//                 marginBottom: "0.4rem",
//                 color: "#fed7aa", // golden heading like before
//               }}
//             >
//               The idea behind vrikshcrafts
//             </h2>

//             <p
//               style={{
//                 fontSize: "0.9rem",
//                 color: "#fef3c7",
//                 lineHeight: 1.6,
//               }}
//             >
//               Instead of acting like a large online marketplace, vrikshcrafts
//               works more like a focused sourcing partner. We listen to your
//               project, understand the mood and budget, and then curate a set of
//               wooden decor options that make sense for your space.
//             </p>
//             <p
//               style={{
//                 marginTop: "0.6rem",
//                 fontSize: "0.85rem",
//                 color: "#e5e7eb",
//               }}
//             >
//               This means fewer random catalog links and more realistic, cohesive
//               suggestions that match how you actually plan your interiors.
//             </p>
//           </article>

//           {/* Card 2: Why Saharanpur matters */}
//           <article className="catalog-card">
//             <h2
//               className="section-title"
//               style={{
//                 marginTop: 0,
//                 marginBottom: "0.4rem",
//                 color: "#fed7aa", // golden heading like before
//               }}
//             >
//               Why Saharanpur matters
//             </h2>

//             <p
//               style={{
//                 fontSize: "0.9rem",
//                 color: "#fef3c7",
//                 lineHeight: 1.6,
//               }}
//             >
//               Saharanpur is one of India&apos;s most important woodcraft hubs,
//               known for its carving, panel work, and small decor items. For B2B
//               buyers, this means access to a huge variety of styles and
//               techniques in one ecosystem.
//             </p>
//             <p
//               style={{
//                 marginTop: "0.6rem",
//                 fontSize: "0.85rem",
//                 color: "#e5e7eb",
//               }}
//             >
//               By working closely with selected workshops here, vrikshcrafts can
//               combine traditional skills with more structured timelines,
//               repeatable designs, and project-wise coordination.
//             </p>
//           </article>

//           {/* Card 3: How we work with businesses */}
//           <article className="catalog-card">
//             <h2
//               className="section-title"
//               style={{
//                 marginTop: 0,
//                 marginBottom: "0.4rem",
//                 color: "#fed7aa", // golden heading like before
//               }}
//             >
//               How we work with businesses
//             </h2>
//             <p
//               style={{
//                 fontSize: "0.9rem",
//                 color: "#fef3c7",
//                 lineHeight: 1.6,
//               }}
//             >
//               First, you share your requirements – type of space, mood,
//               approximate budget, and where the decor will be used (walls,
//               counters, tabletops, signage, or giftable items).
//             </p>
//             <p
//               style={{
//                 marginTop: "0.5rem",
//                 fontSize: "0.9rem",
//                 color: "#fef3c7",
//                 lineHeight: 1.6,
//               }}
//             >
//               Then vrikshcrafts shortlists suitable pieces and coordinates with
//               workshops for samples, pricing, and timelines. Our focus is on
//               realistic delivery, batch-wise quality checks, and clear
//               communication so your project can move smoothly.
//             </p>
//           </article>
//         </div>

//                 {/* About the founder */}
//         <div
//           style={{
//             marginTop: "2rem",
//             padding: "1rem 1.1rem",
//             borderRadius: "var(--radius-card)",
//             border: "1px solid var(--border-soft)",
//             background:
//               "radial-gradient(circle at top left, #f4e4d1 0, #e5c9a6 70%)",
//             boxShadow: "var(--shadow-soft)",
//             fontSize: "0.9rem",
//             color: "var(--text-main)",
//             maxWidth: "46rem",
//           }}
//         >
//           <h2
//             style={{
//               marginTop: 0,
//               marginBottom: "0.4rem",
//               fontSize: "0.95rem",
//               fontWeight: 600,
//               color: "var(--text-main)",
//             }}
//           >
//             About the founder
//           </h2>
//           <p style={{ margin: 0 }}>
//             Vrikshcrafts was started by Atif Bin Khalid, based in Saharanpur, with a focus on
//             connecting local workshops to modern café, office, and retail
//             projects. Every enquiry is reviewed personally, with clear
//             communication on what is realistic, so that businesses get handcrafted
//             pieces that actually fit their timelines and spaces.
//           </p>
//         </div>

//         {/* Small closing note */}
//         <div
//           style={{
//             marginTop: "2rem",
//             padding: "1rem",
//             borderRadius: "var(--radius-card)",
//             border: "1px dashed rgba(22, 101, 52, 0.35)",
//             backgroundColor: "var(--bg-subtle)",
//             fontSize: "0.85rem",
//             color: "var(--text-muted)",
//           }}
//         >
//           Vrikshcrafts is designed to grow with you: you can start with a small
//           set of decor pieces for one café, studio, or office, and then reorder
//           or extend the range as your brand expands into new locations.
//         </div>
//       </div>
//     </section>
//     <FaqSection />
//     </>
//   );
// }
import FaqSection from "../components/FaqSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About vrikshcrafts · Saharanpur B2B wood decor partner",
  description:
    "Learn how vrikshcrafts connects Saharanpur’s handcrafted wood decor with cafes, offices, interior designers, and decor / gift stores through a focused B2B sourcing model.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About vrikshcrafts · Saharanpur B2B wood decor partner",
    description:
      "vrikshcrafts links Saharanpur workshops with cafes, offices, designers, and decor stores using a project-first, B2B-focused approach.",
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About vrikshcrafts · Saharanpur B2B wood decor partner",
    description:
      "Background and approach of vrikshcrafts, a Saharanpur-based B2B wood decor partner for cafes, offices, designers, and decor stores.",
  },
  keywords: [
    "about vrikshcrafts",
    "Saharanpur wood decor",
    "B2B wood decor partner",
    "cafe decor supplier",
    "office decor supplier",
    "interior designer sourcing Saharanpur",
  ],
};

export default function AboutPage() {
  return (
    <>
      <section className="about-section">
        <div className="container">
          <p className="hero-kicker">About vrikshcrafts</p>
          <h1 className="hero-title">Saharanpur woodcraft, built for modern spaces.</h1>
          <p className="hero-subtitle">
            Vrikshcrafts is a Saharanpur-based wood decor partner that focuses on
            B2B needs. We connect traditional workshops with cafes, offices,
            interior designers, and decor / gift stores in a structured, project-first way.
          </p>

          {/* Brand story cards */}
          <div
            style={{
              marginTop: "2rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {/* Card 1: Idea behind vrikshcrafts */}
            <article className="catalog-card">
              <h2
                className="section-title"
                style={{
                  marginTop: 0,
                  marginBottom: "0.4rem",
                  color: "#fed7aa", // golden heading like before
                }}
              >
                The idea behind vrikshcrafts
              </h2>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#fef3c7",
                  lineHeight: 1.6,
                }}
              >
                Instead of acting like a large online marketplace, vrikshcrafts
                works more like a focused sourcing partner. We listen to your
                project, understand the mood and budget, and then curate a set of
                wooden decor options that make sense for your space.
              </p>
              <p
                style={{
                  marginTop: "0.6rem",
                  fontSize: "0.85rem",
                  color: "#e5e7eb",
                }}
              >
                This means fewer random catalog links and more realistic, cohesive
                suggestions that match how you actually plan your interiors.
              </p>
            </article>

            {/* Card 2: Why Saharanpur matters */}
            <article className="catalog-card">
              <h2
                className="section-title"
                style={{
                  marginTop: 0,
                  marginBottom: "0.4rem",
                  color: "#fed7aa", // golden heading like before
                }}
              >
                Why Saharanpur matters
              </h2>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#fef3c7",
                  lineHeight: 1.6,
                }}
              >
                Saharanpur is one of India&apos;s most important woodcraft hubs,
                known for its carving, panel work, and small decor items. For B2B
                buyers, this means access to a huge variety of styles and
                techniques in one ecosystem.
              </p>
              <p
                style={{
                  marginTop: "0.6rem",
                  fontSize: "0.85rem",
                  color: "#e5e7eb",
                }}
              >
                By working closely with selected workshops here, vrikshcrafts can
                combine traditional skills with more structured timelines,
                repeatable designs, and project-wise coordination.
              </p>
            </article>

            {/* Card 3: How we work with businesses */}
            <article className="catalog-card">
              <h2
                className="section-title"
                style={{
                  marginTop: 0,
                  marginBottom: "0.4rem",
                  color: "#fed7aa", // golden heading like before
                }}
              >
                How we work with businesses
              </h2>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#fef3c7",
                  lineHeight: 1.6,
                }}
              >
                First, you share your requirements – type of space, mood,
                approximate budget, and where the decor will be used (walls,
                counters, tabletops, signage, or giftable items).
              </p>
              <p
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.9rem",
                  color: "#fef3c7",
                  lineHeight: 1.6,
                }}
              >
                Then vrikshcrafts shortlists suitable pieces and coordinates with
                workshops for samples, pricing, and timelines. Our focus is on
                realistic delivery, batch-wise quality checks, and clear
                communication so your project can move smoothly.
              </p>
            </article>
          </div>

          {/* About the founder */}
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem 1.1rem",
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--border-soft)",
              background:
                "radial-gradient(circle at top left, #f4e4d1 0, #e5c9a6 70%)",
              boxShadow: "var(--shadow-soft)",
              fontSize: "0.9rem",
              color: "var(--text-main)",
              maxWidth: "46rem",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "0.4rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--text-main)",
              }}
            >
              About the founder
            </h2>
            <p style={{ margin: 0 }}>
              Vrikshcrafts was started by Atif Bin Khalid, based in Saharanpur, with a focus on
              connecting local workshops to modern café, office, and retail
              projects. Every enquiry is reviewed personally, with clear
              communication on what is realistic, so that businesses get handcrafted
              pieces that actually fit their timelines and spaces.
            </p>
          </div>

          {/* Small closing note */}
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              borderRadius: "var(--radius-card)",
              border: "1px dashed rgba(22, 101, 52, 0.35)",
              backgroundColor: "var(--bg-subtle)",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
            }}
          >
            Vrikshcrafts is designed to grow with you: you can start with a small
            set of decor pieces for one café, studio, or office, and then reorder
            or extend the range as your brand expands into new locations.
          </div>
      </div>
    </section>
    <FaqSection />
    </>
  );
}
