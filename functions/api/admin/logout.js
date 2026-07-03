import { json, clearSessionCookie } from "../../_utils.js";

// POST /admin/logout
export async function onRequestPost() {
  return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() });
}
