import { json, parseJSONSafe } from "../../../_utils.js";

// GET /admin/clienti/:id — dettaglio cliente + storico ordini
export async function onRequestGet(context) {
  const { env, params } = context;
  const id = Number(params.id);

  const cliente = await env.DB.prepare("SELECT * FROM clienti WHERE id = ?").bind(id).first();
  if (!cliente) return json({ errore: "Cliente non trovato" }, 404);

  const { results } = await env.DB
    .prepare("SELECT * FROM ordini WHERE cliente_telefono = ? ORDER BY creato_il DESC")
    .bind(cliente.telefono)
    .all();

  return json({
    cliente,
    ordini: results.map((o) => ({ ...o, items: parseJSONSafe(o.items, []) })),
  });
}
