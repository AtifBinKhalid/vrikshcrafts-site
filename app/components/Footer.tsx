import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/services", label: "Our services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact us" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand + one calm line */}
          <div className="footer-brand">
            <p className="footer-brand-title">vrikshcrafts</p>
            <p className="footer-brand-text">
              Handcrafted Saharanpur wood decor for cafés, offices, designers,
              and decor / gift stores.
            </p>
          </div>

          {/* Quick links */}
          <div className="footer-column">
            <p className="footer-column-title">Pages</p>
            <nav className="footer-links">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact info */}
          <div className="footer-column footer-contact">
            <p className="footer-column-title">Contact</p>
            <p className="footer-contact-line">
              Email:{" "}
              <a href="mailto:atifbinkhalid1@gmail.com">
                atifbinkhalid1@gmail.com
              </a>
            </p>
            <p className="footer-contact-line">
              Phone / WhatsApp: +91-8218656007
            </p>
            <p className="footer-contact-line">
              Based in Saharanpur · serving India and select global projects.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} vrikshcrafts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}





// import Link from "next/link";

// export default function Footer() {
//   return (
//     <footer className="site-footer">
//       <div className="container site-footer-inner">
//         <div>
//           © {new Date().getFullYear()} vrikshcrafts · Saharanpur wood decor
//           for B2B projects.
//         </div>
//         <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
//           <Link href="/catalog">Catalog</Link>
//           <Link href="/services">Our services</Link>
//           <Link href="/about">About</Link>
//           <Link href="/contact">Contact us</Link>
//         </div>
//       </div>
//     </footer>
//   );
// }

