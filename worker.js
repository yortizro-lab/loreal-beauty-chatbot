var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// backend/worker.js
var PAGES_PROJECT = "loreal-beauty-chatbot-yortizro-workers-dev";
var normalizeOrigin = /* @__PURE__ */ __name((v) => String(v || "").trim().replace(/\/+$/, ""), "normalizeOrigin");
function isAllowedOrigin(origin, env) {
  const o = normalizeOrigin(origin);
  if (!o)
    return false;
  const configured = String(env.ALLOWED_ORIGIN || "").split(",").map(normalizeOrigin).filter(Boolean);
  if (configured.includes(o))
    return true;
  try {
    const url = new URL(o);
    if (url.protocol !== "https:")
      return false;
    const host = url.hostname.toLowerCase();
    return host === `${PAGES_PROJECT}.pages.dev` || host.endsWith(`.${PAGES_PROJECT}.pages.dev`);
  } catch {
    return false;
  }
}
__name(isAllowedOrigin, "isAllowedOrigin");
function buildCorsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
  if (isAllowedOrigin(origin, env)) {
    headers["Access-Control-Allow-Origin"] = normalizeOrigin(origin);
  }
  return headers;
}
__name(buildCorsHeaders, "buildCorsHeaders");
var worker_default = {
  async fetch(request, env) {
    const corsHeaders = buildCorsHeaders(request, env);
    if (request.method === "OPTIONS") {
      const origin = request.headers.get("Origin") || "";
      if (origin && !corsHeaders["Access-Control-Allow-Origin"]) {
        return new Response(null, {
          status: 403,
          headers: corsHeaders
        });
      }
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }
    if (request.method !== "POST") {
      return Response.json(
        { error: "Method not allowed." },
        { status: 405, headers: corsHeaders }
      );
    }
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return Response.json(
        { error: "Content-Type must be application/json." },
        { status: 415, headers: corsHeaders }
      );
    }
    try {
      const body = await request.json();
      const message = typeof body.message === "string" ? body.message.trim() : "";
      const languageNames = {
        en: "English",
        es: "Spanish",
        zh: "Chinese",
        pt: "Portuguese"
      };
      const language = languageNames[body.language] ? body.language : "en";
      const responseLanguage = languageNames[language];
      const history = Array.isArray(body.history) ? body.history.filter(
        (entry) => entry && (entry.role === "user" || entry.role === "assistant") && typeof entry.content === "string" && entry.content.trim()
      ).slice(-12).map((entry) => ({
        role: entry.role,
        content: entry.content.trim().slice(0, 2e3)
      })) : [];
      if (!message) {
        return Response.json(
          { error: "Please provide a message." },
          { status: 400, headers: corsHeaders }
        );
      }
      if (!env.OPENAI_API_KEY) {
        return Response.json(
          { error: "The AI service is not configured." },
          { status: 500, headers: corsHeaders }
        );
      }
      const systemPrompt = `You are L'Or\xE9al Beauty Guide, an AI assistant specializing in L'Or\xE9al beauty products and personalized beauty routines.

You help customers with:
- L'Or\xE9al skincare, makeup, and haircare products
- Personalized beauty recommendations based on skin/hair type
- Product usage and application techniques
- Beauty routines and ingredient benefits

You do NOT:
- Recommend competitor brands
- Answer questions unrelated to beauty or L'Or\xE9al products
- Invent product information or prices
- Claim to be an official L'Or\xE9al representative

For off-topic questions, politely redirect: "I'm your L'Or\xE9al Beauty Guide! \u{1F497} I specialize in L'Or\xE9al beauty products and personalized routines. I can't help with that, but I'd love to help you find your perfect beauty solution! What beauty goal can I assist you with?"

Always respond in ${responseLanguage} and maintain a professional, friendly tone.`;
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: message.slice(0, 4e3) }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("OpenAI response failed:", data);
        return Response.json(
          { error: "AI service request failed." },
          { status: 502, headers: corsHeaders }
        );
      }
      const answer = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
      return Response.json({ answer }, { headers: corsHeaders });
    } catch (error) {
      console.error("Worker request failed:", error);
      return Response.json(
        { error: "Something went wrong. Please try again." },
        { status: 500, headers: corsHeaders }
      );
    }
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map


