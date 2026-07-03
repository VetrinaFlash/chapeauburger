import { requireStaff } from "../../_utils.js";

// Protegge le rotte /api/staff/* (tranne login) con un semplice codice condiviso
// (STAFF_ACCESS_CODE), inviato dal client nell'header X-Staff-Code.
// Più leggero della sessione admin: è pensato per un accesso di reparto, non personale.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.pathname === "/api/staff/login") {
    return context.next();
  }
  const auth = requireStaff(context);
  if (!auth.ok) return auth.response;
  return context.next();
}
