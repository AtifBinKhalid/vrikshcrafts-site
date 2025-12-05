// import type { Metadata } from "next";
// import "./globals.css";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

// export const metadata: Metadata = {
//   title: "vrikshcrafts — Saharanpur wood decor for B2B projects",
//   description:
//     "vrikshcrafts is a Saharanpur-based wood decor partner for cafes, offices, interior designers and decor stores. We curate handcrafted wooden pieces and coordinate production for B2B projects.",
//   metadataBase: new URL("https://vrikshcrafts.example"), // change later to your real domain
//   openGraph: {
//     title: "vrikshcrafts — Saharanpur wood decor for B2B projects",
//     description:
//       "Handcrafted wood decor from Saharanpur for cafes, offices, studios and decor stores. Curated B2B sourcing with clear communication and realistic timelines.",
//     url: "/",
//     siteName: "vrikshcrafts",
//     type: "website",
//   },
//   twitter: {
//     card: "summary",
//     title: "vrikshcrafts — Saharanpur wood decor for B2B projects",
//     description:
//       "B2B-focused wood decor partner for cafes, offices and designers.",
//   },
//   icons: {
//     icon: "/favicon.ico",
//   },
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <Navbar />
//         <main>{children}</main>
//         <Footer />
//       </body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "vrikshcrafts — Saharanpur wood decor for B2B projects",
  description:
    "vrikshcrafts is a Saharanpur-based wood decor partner for cafes, offices, interior designers and decor stores. We curate handcrafted wooden pieces and coordinate production for B2B projects.",
  // Update this later to your real domain, for example: https://vrikshcrafts.in
  metadataBase: new URL("https://vrikshcrafts.example"),
  openGraph: {
    title: "vrikshcrafts — Saharanpur wood decor for B2B projects",
    description:
      "Handcrafted wood decor from Saharanpur for cafes, offices, studios and decor stores. Curated B2B sourcing with clear communication and realistic timelines.",
    url: "/",
    siteName: "vrikshcrafts",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "vrikshcrafts — Saharanpur wood decor for B2B projects",
    description:
      "B2B-focused wood decor partner for cafes, offices and designers.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "vrikshcrafts",
    "Saharanpur wood decor",
    "wooden decor wholesale",
    "B2B wood decor",
    "cafe decor",
    "office decor",
    "interior designer sourcing",
    "decor and gift store supply",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
