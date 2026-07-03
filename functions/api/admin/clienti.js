import { json } from "../../_utils.js";

// GET /admin/clienti — anagrafica clienti con conteggio ordini
export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB
    .prepare(
      `SELECT c.*, COUNT(o.id) AS numero_ordini, COALESCE(SUM(o.totale), 0) AS totale_speso
       FROM clienti c
       LEFT JOIN ordini o ON o.cliente_telefono = c.telefono
       GROUP BY c.id
       ORDER BY c.creato_il DESC`
    )
    .all();
  return json({ clienti: results });
}
