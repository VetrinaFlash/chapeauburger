import { json, createSessionCookie } from "../../_utils.js";

// POST /admin/login — { password }
export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.ADMIN_PASSWORD || !env.ADMIN_TOKEN_SECRET) {
    return json({ errore: "Admin non configurato: manca ADMIN_PASSWORD o ADMIN_TOKEN_SECRET" }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ errore: "JSON non valido" }, 400);
  }

  const password = String(body.password || "");
  if (password !== env.ADMIN_PASSWORD) {
    return json({ errore: "Password errata" }, 401);
  }

  const cookie = await createSessionCookie(env.ADMIN_TOKEN_SECRET, { ruolo: "admin" });
  return json({ ok: true }, 200, { "Set-Cookie": cookie });
}
