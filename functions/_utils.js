// Utility condivise dai Pages Functions (import relativo, nessuna build step).

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}

export function parseJSONSafe(str, fallback) {
  if (str === null || str === undefined) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function hmacSign(secret, message) {
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return toHex(sig);
}

const SESSION_COOKIE = "cb_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 ore

// Cookie di sessione: base64(payloadJSON).hmacSignature(base64(payloadJSON))
export async function createSessionCookie(secret, payload) {
  const body = JSON.stringify({ ...payload, exp: Date.now() + SESSION_TTL_SECONDS * 1000 });
  const b64 = btoa(unescape(encodeURIComponent(body)));
  const sig = await hmacSign(secret, b64);
  const value = `${b64}.${sig}`;
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function getCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? match[1] : null;
}

export async function verifySession(request, secret) {
  const raw = getCookie(request, SESSION_COOKIE);
  if (!raw) return null;
  const [b64, sig] = raw.split(".");
  if (!b64 || !sig) return null;
  const expectedSig = await hmacSign(secret, b64);
  if (expectedSig !== sig) return null;
  let payload;
  try {
    payload = JSON.parse(decodeURIComponent(escape(atob(b64))));
  } catch {
    return null;
  }
  if (!payload.exp || payload.exp < Date.now()) return null;
  return payload;
}

export async function requireAdmin(context) {
  const { request, env } = context;
  if (!env.ADMIN_TOKEN_SECRET) {
    return { ok: false, response: json({ errore: "ADMIN_TOKEN_SECRET non configurato" }, 500) };
  }
  const session = await verifySession(request, env.ADMIN_TOKEN_SECRET);
  if (!session) {
    return { ok: false, response: json({ errore: "Non autenticato" }, 401) };
  }
  return { ok: true, session };
}

export function requireStaff(context) {
  const { request, env } = context;
  const header = request.headers.get("X-Staff-Code") || "";
  if (!env.STAFF_ACCESS_CODE || header !== env.STAFF_ACCESS_CODE) {
    return { ok: false, response: json({ errore: "Codice staff non valido" }, 401) };
  }
  return { ok: true };
}

// Normalizza righe prodotto dal DB (JSON stringificati -> oggetti)
export function idratraProdotto(row) {
  return {
    ...row,
    prezzi: parseJSONSafe(row.prezzi, []),
    scelte_obbligatorie: parseJSONSafe(row.scelte_obbligatorie, []),
    scelte_multiple: parseJSONSafe(row.scelte_multiple, []),
    rimozione_ingredienti: !!row.rimozione_ingredienti,
    attivo: !!row.attivo,
  };
}
