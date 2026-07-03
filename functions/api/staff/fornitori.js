import { json } from "../../_utils.js";

// GET /staff/fornitori — elenco fornitori/reparti (solo per raggruppare la richiesta, niente dati sensibili extra)
export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB
    .prepare("SELECT id, nome, reparto FROM magazzino_fornitori WHERE attivo = 1 ORDER BY reparto, nome")
    .all();
  return json({ fornitori: results });
}
