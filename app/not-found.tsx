import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main>
      <section
        className="hero"
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container">
          <p className="hero-kicker">Page not found</p>
          <h1 className="hero-title">This page does not exist.</h1>
          {/* <p className="hero-subtitle">
            The link you opened does not match any page on vrikshcrafts.
            You can return to the home page or explore the catalog.
          </p> */}
          <p className="hero-subtitle">
            The link you opened does not match any page on vrikshcrafts.
            You can return to the home page or explore the catalog for decor ideas.
          </p>


          <div className="hero-actions">
            <Link href="/" className="primary-btn">
              Go back to home
            </Link>
            <Link href="/catalog" className="secondary-link">
              Browse catalog overview
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
