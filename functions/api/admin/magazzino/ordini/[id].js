import { json } from "../../../../_utils.js";

const STATI_VALIDI = ["nuovo", "inviato", "completato"];

// PUT /admin/magazzino/ordini/:id — cambio stato ordine materie prime
export async function onRequestPut(context) {
  const { request, env, params } = context;
  const id = Number(params.id);

  const attuale = await env.DB.prepare("SELECT * FROM magazzino_ordini WHERE id = ?").bind(id).first();
  if (!attuale) return json({ errore: "Ordine magazzino non trovato" }, 404);

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
    .prepare("UPDATE magazzino_ordini SET stato = ?, note = ? WHERE id = ?")
    .bind(stato, note, id)
    .run();

  return json({ ok: true });
}
