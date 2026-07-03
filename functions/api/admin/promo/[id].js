import { json } from "../../../_utils.js";

// PUT /admin/promo/:id — update parziale sicuro
export async function onRequestPut(context) {
  const { request, env, params } = context;
  const id = Number(params.id);

  const attuale = await env.DB.prepare("SELECT * FROM promo WHERE id = ?").bind(id).first();
  if (!attuale) return json({ errore: "Promo non trovata" }, 404);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ errore: "JSON non valido" }, 400);
  }

  const codice = body.codice !== undefined ? String(body.codice).trim().toUpperCase() : attuale.codice;
  const tipo = body.tipo !== undefined ? body.tipo : attuale.tipo;
  const valore = body.valore !== undefined ? Number(body.valore) : attuale.valore;
  const minOrdine = body.min_ordine !== undefined ? Number(body.min_ordine) : attuale.min_ordine;
  const scadenza = body.scadenza !== undefined ? String(body.scadenza) : attuale.scadenza;
  const attivo = body.attivo !== undefined ? (body.attivo ? 1 : 0) : attuale.attivo;

  await env.DB
    .prepare("UPDATE promo SET codice = ?, tipo = ?, valore = ?, min_ordine = ?, scadenza = ?, attivo = ? WHERE id = ?")
    .bind(codice, tipo, valore, minOrdine, scadenza, attivo, id)
    .run();

  return json({ ok: true });
}

// DELETE /admin/promo/:id
export async function onRequestDelete(context) {
  const { env, params } = context;
  await env.DB.prepare("DELETE FROM promo WHERE id = ?").bind(Number(params.id)).run();
  return json({ ok: true });
}
