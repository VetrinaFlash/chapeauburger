import { json } from "../../_utils.js";

// POST /staff/ordini — crea un ordine di riordino materie prime
// body: { creato_da, note, items: [{ materia_prima_id, quantita, note }] }
export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ errore: "JSON non valido" }, 400);
  }

  const items = Array.isArray(body.items) ? body.items.filter((i) => i.materia_prima_id && Number(i.quantita) > 0) : [];
  if (items.length === 0) return json({ errore: "Aggiungi almeno una materia prima con quantità valida" }, 400);

  const result = await env.DB
    .prepare("INSERT INTO magazzino_ordini (creato_da, stato, note) VALUES (?, 'nuovo', ?)")
    .bind(String(body.creato_da || "Staff"), String(body.note || ""))
    .run();

  const ordineId = result.meta.last_row_id;

  for (const item of items) {
    await env.DB
      .prepare("INSERT INTO magazzino_ordini_items (ordine_id, materia_prima_id, quantita, note) VALUES (?, ?, ?, ?)")
      .bind(ordineId, Number(item.materia_prima_id), Number(item.quantita), String(item.note || ""))
      .run();
  }

  return json({ ok: true, ordine_id: ordineId });
}
