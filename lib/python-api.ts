const DEFAULT_PYTHON_API_URL = "http://127.0.0.1:8000";
const RESPONSE_HEADERS = ["cache-control", "content-type", "retry-after", "set-cookie"];

function apiBaseUrl() {
  const configured = process.env.PYTHON_API_URL?.trim() || DEFAULT_PYTHON_API_URL;
  return configured.replace(/\/$/, "");
}

export async function proxyPythonApi(request: Request) {
  const requestUrl = new URL(request.url);
  const targetUrl = `${apiBaseUrl()}${requestUrl.pathname}${requestUrl.search}`;
  const headers = new Headers();

  for (const name of ["content-type", "cookie", "origin", "user-agent", "x-forwarded-for", "x-real-ip"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("x-forwarded-host", request.headers.get("host") || requestUrl.host);
  headers.set("x-forwarded-proto", requestUrl.protocol.replace(":", ""));
  const sharedSecret = process.env.PYTHON_API_SHARED_SECRET?.trim();
  if (sharedSecret) headers.set("x-vrikshcrafts-proxy-key", sharedSecret);

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
    const responseHeaders = new Headers();
    for (const name of RESPONSE_HEADERS) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    responseHeaders.set("Cache-Control", "no-store");
    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(
      "[vrikshcrafts] Python API proxy failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return Response.json(
      {
        error:
          "The AI service is temporarily unavailable. Confirm that the Python API is running.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
