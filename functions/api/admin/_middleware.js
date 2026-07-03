import { requireAdmin } from "../../_utils.js";

// Protegge tutte le rotte /api/admin/* tranne login/logout (verifica sessione firmata HMAC).
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.pathname === "/api/admin/login" || url.pathname === "/api/admin/logout") {
    return context.next();
  }
  const auth = await requireAdmin(context);
  if (!auth.ok) return auth.response;
  context.data = context.data || {};
  context.data.session = auth.session;
  return context.next();
}
