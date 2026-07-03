import { json } from "../../_utils.js";

// POST /staff/login — { codice } verifica il codice staff (senza crearne uno di sessione:
// il client lo ri-userà come header X-Staff-Code su ogni richiesta successiva)
export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.STAFF_ACCESS_CODE) {
    return json({ errore: "STAFF_ACCESS_CODE non configurato" }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ errore: "JSON non valido" }, 400);
  }

  const codice = String(body.codice || "");
  if (codice !== env.STAFF_ACCESS_CODE) {
    return json({ errore: "Codice non valido" }, 401);
  }

  return json({ ok: true });
}
