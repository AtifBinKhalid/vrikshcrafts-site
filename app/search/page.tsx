import type { Metadata } from "next";
import { Suspense } from "react";
import SearchContent from "./SearchContent";

export const metadata: Metadata = {
  title: "Search · vrikshcrafts",
  description:
    "Search vrikshcrafts examples and categories to see how wooden decor can fit into your café, office, studio, or decor store.",
};

export default function SearchPage() {
  return (
    <section className="hero">
      <div className="container">
        <p className="hero-kicker">Search</p>
        <h1 className="hero-title">Search the vrikshcrafts catalog</h1>
        <p className="hero-subtitle">
          Use the search box in the header to look for terms like{" "}
          <strong>wall</strong>, <strong>café</strong>, <strong>office</strong>, or{" "}
          <strong>gift</strong>. We&apos;ll highlight which catalog sections are
          most relevant.
        </p>

        <Suspense
          fallback={
            <p
              style={{
                marginTop: "1.25rem",
                fontSize: "0.9rem",
                color: "var(--text-muted)",
              }}
            >
              Loading search results…
            </p>
          }
        >
          <SearchContent />
        </Suspense>
      </div>
    </section>
  );
}







// import type { Metadata } from "next";
// import { Suspense } from "react";
// import SearchContent from "./SearchContent";

// export const metadata: Metadata = {
//   title: "Search · vrikshcrafts",
//   description:
//     "Search vrikshcrafts examples and categories to see how wooden decor can fit into your café, office, studio, or decor store.",
// };

// export default function SearchPage() {
//   return (
//     <section className="catalog-section">
//       <div className="container">
//         <p className="hero-kicker">Search</p>
//         <h1 className="hero-title">Search vrikshcrafts catalog ideas</h1>
//         <p className="hero-subtitle">
//           Type a word like “wall”, “logo”, “signage”, or “gift” to see matching
//           catalog examples from vrikshcrafts.
//         </p>

//         <Suspense
//           fallback={
//             <p
//               style={{
//                 marginTop: "1.25rem",
//                 fontSize: "0.9rem",
//                 color: "var(--text-muted)",
//               }}
//             >
//               Loading search results…
//             </p>
//           }
//         >
//           <SearchContent />
//         </Suspense>
//       </div>
//     </section>
//   );
// }





// import type { Metadata } from "next";
// import { Suspense } from "react";
// import SearchContent from "./SearchContent";

// export const metadata: Metadata = {
//   title: "Search · vrikshcrafts",
//   description:
//     "Search vrikshcrafts examples and categories to see how wooden decor can fit into your café, office, studio, or decor store.",
// };

// export default function SearchPage() {
//   return (
//     <section className="catalog-section">
//       <div className="container">
//         <p className="hero-kicker">Search</p>
//         <h1 className="hero-title">Search vrikshcrafts catalog ideas</h1>
//         <p className="hero-subtitle">
//           Type a word like “wall”, “logo”, “signage”, or “gift” to see matching
//           catalog examples from vrikshcrafts.
//         </p>

//         <Suspense
//           fallback={
//             <p
//               style={{
//                 marginTop: "1.25rem",
//                 fontSize: "0.9rem",
//                 color: "var(--text-muted)",
//               }}
//             >
//               Loading search results…
//             </p>
//           }
//         >
//           <SearchContent />
//         </Suspense>
//       </div>
//     </section>
//   );
// }