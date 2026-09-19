const FALLBACK_SITE_URL = "https://vrikshcrafts.in";

export function getSiteUrl(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;

  try {
    return new URL(configuredUrl);
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}
