import { json, parseJSONSafe } from "../../../_utils.js";

const STATI_VALIDI = ["nuovo", "in_preparazione", "pronto", "consegnato", "annullato"];

// GET /admin/ordini/:id — dettaglio ordine
export async function onRequestGet(context) {
  const { env, params } = context;
  const id = Number(params.id);
  const ordine = await env.DB.prepare("SELECT * FROM ordini WHERE id = ?").bind(id).first();
  if (!ordine) return json({ errore: "Ordine non trovato" }, 404);
  return json({ ordine: { ...ordine, items: parseJSONSafe(ordine.items, []) } });
}

// PUT /admin/ordini/:id — cambio stato / note
export async function onRequestPut(context) {
  const { request, env, params } = context;
  const id = Number(params.id);

  const attuale = await env.DB.prepare("SELECT * FROM ordini WHERE id = ?").bind(id).first();
  if (!attuale) return json({ errore: "Ordine non trovato" }, 404);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ errore: "JSON non valido" }, 400);
  }

  if (body.stato !== undefined && !STATI_VALIDI.includes(body.stato)) {
    return json({ errore: `Stato non valido: ${body.stato}` }, 400);
  }

  const stato = body.stato !== undefined ? body.stato : attuale.stato;
  const note = body.note !== undefined ? String(body.note) : attuale.note;

  await env.DB
    .prepare("UPDATE ordini SET stato = ?, note = ?, aggiornato_il = datetime('now') WHERE id = ?")
    .bind(stato, note, id)
    .run();

  return json({ ok: true });
}
