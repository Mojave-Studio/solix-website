const markdownMediaType = /(?:^|,)\s*text\/markdown(?:\s*;[^,]*)?(?=,|$)/i;
const acceptsMarkdown = (accept) =>
  markdownMediaType.test(accept) &&
  !/text\/markdown\s*;[^,]*\bq=0(?:\.0+)?\b/i.test(accept);

const contentSignal = "search=yes, ai-input=yes, ai-train=no";
const htmlPaths = new Set(["/", "/index.html"]);

// Responses constructed here bypass the asset layer's _headers rules, so the
// same policy is applied explicitly.
const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline'; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; object-src 'none'; upgrade-insecure-requests",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Content-Signal": contentSignal,
};

function withVary(headers, value) {
  const values = new Set(
    (headers.get("vary") ?? "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
  values.add(value.toLowerCase());
  headers.set("vary", [...values].join(", "));
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  if (url.hostname === "www.solix.fyi") {
    url.hostname = "solix.fyi";
    return Response.redirect(url.toString(), 301);
  }

  const isHtmlPage = htmlPaths.has(url.pathname);
  const wantsMarkdown =
    ["GET", "HEAD"].includes(request.method) &&
    acceptsMarkdown(request.headers.get("accept") ?? "");

  if (isHtmlPage && wantsMarkdown) {
    const markdown = await env.ASSETS.fetch(new URL("/index.md", url));
    if (markdown.ok) {
      const headers = new Headers(markdown.headers);
      for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value);
      headers.set("Content-Type", "text/markdown; charset=utf-8");
      withVary(headers, "Accept");
      return new Response(request.method === "HEAD" ? null : markdown.body, {
        status: markdown.status,
        statusText: markdown.statusText,
        headers,
      });
    }
  }

  const response = await next();
  if (isHtmlPage && (response.headers.get("content-type") ?? "").includes("text/html")) {
    const headers = new Headers(response.headers);
    withVary(headers, "Accept");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
  return response;
}
