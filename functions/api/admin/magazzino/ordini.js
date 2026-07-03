import { json } from "../../../_utils.js";

// GET /admin/magazzino/ordini — ordini materie prime dallo staff, con righe/dettagli
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const stato = url.searchParams.get("stato");

  const query = stato
    ? env.DB.prepare("SELECT * FROM magazzino_ordini WHERE stato = ? ORDER BY creato_il DESC").bind(stato)
    : env.DB.prepare("SELECT * FROM magazzino_ordini ORDER BY creato_il DESC LIMIT 200");

  const { results: ordini } = await query.all();

  const { results: righe } = await env.DB
    .prepare(
      `SELECT i.ordine_id, i.quantita, i.note, m.id AS materia_prima_id, m.nome, m.reparto, m.unita_misura, m.prezzo_riferimento
       FROM magazzino_ordini_items i
       JOIN magazzino_materie_prime m ON m.id = i.materia_prima_id
       WHERE i.ordine_id IN (${ordini.map(() => "?").join(",") || "0"})`
    )
    .bind(...ordini.map((o) => o.id))
    .all();

  const ordiniConItems = ordini.map((o) => ({
    ...o,
    items: righe.filter((r) => r.ordine_id === o.id),
  }));

  return json({ ordini: ordiniConItems });
}
