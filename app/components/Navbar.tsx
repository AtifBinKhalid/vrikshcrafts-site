"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/services", label: "Our services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact us" },
];

export default function Navbar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [query, setQuery] = useState("");

  const getLinkClass = (href: string) => {
    const base = "site-nav-link";
    return pathname === href ? `${base} site-nav-link-active` : base;
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="site-logo">
          <span>vrikshcrafts</span>{" "}
          <span className="site-logo-sub">wood decor</span>
        </Link>

        <div className="site-header-right">
          <nav className="site-nav">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={getLinkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <form className="site-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="site-search-input"
              placeholder="Search catalog"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>
      </div>
    </header>
  );
}
