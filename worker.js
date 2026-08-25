export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": allowed === "*" ? "*" : (origin === allowed ? origin : allowed),
      "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Cache-Control": "no-store"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (url.pathname !== "/api/state") {
      return json({ error: "not_found" }, 404, cors);
    }

    const auth = request.headers.get("Authorization") || "";
    if (!env.API_KEY || auth !== `Bearer ${env.API_KEY}`) {
      return json({ error: "unauthorized" }, 401, cors);
    }

    if (request.method === "GET") {
      const raw = await env.ASSET_STORE.get("asset_state");
      if (!raw) return json({ exists: false }, 200, cors);
      return json({ exists: true, payload: JSON.parse(raw) }, 200, cors);
    }

    if (request.method === "PUT") {
      let body;
      try { body = await request.json(); }
      catch { return json({ error: "invalid_json" }, 400, cors); }

      if (!body || typeof body !== "object" || !body.state) {
        return json({ error: "invalid_payload" }, 400, cors);
      }

      const payload = {
        ...body,
        serverSavedAt: new Date().toISOString()
      };
      await env.ASSET_STORE.put("asset_state", JSON.stringify(payload));
      return json({ ok: true, serverSavedAt: payload.serverSavedAt }, 200, cors);
    }

    return json({ error: "method_not_allowed" }, 405, cors);
  }
};

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
  });
}
