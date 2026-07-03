import { json } from "../../_utils.js";

// GET /admin/promo — lista codici sconto
export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare("SELECT * FROM promo ORDER BY id DESC").all();
  return json({ promo: results });
}

// POST /admin/promo — crea codice sconto
export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ errore: "JSON non valido" }, 400);
  }

  const codice = String(body.codice || "").trim().toUpperCase();
  if (!codice) return json({ errore: "Il codice è obbligatorio" }, 400);

  const tipo = body.tipo === "fisso" ? "fisso" : "percentuale";
  const valore = Number(body.valore) || 0;
  const minOrdine = Number(body.min_ordine) || 0;
  const scadenza = String(body.scadenza || "");

  try {
    const result = await env.DB
      .prepare("INSERT INTO promo (codice, tipo, valore, min_ordine, scadenza, attivo) VALUES (?, ?, ?, ?, ?, 1)")
      .bind(codice, tipo, valore, minOrdine, scadenza)
      .run();
    return json({ ok: true, id: result.meta.last_row_id });
  } catch (err) {
    return json({ errore: `Codice già esistente o errore: ${String(err)}` }, 409);
  }
}
