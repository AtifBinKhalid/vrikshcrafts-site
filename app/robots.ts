// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    // Change this to your real domain later (no trailing slash)
    sitemap: "https://vrikshcrafts.example/sitemap.xml",
  };
}
