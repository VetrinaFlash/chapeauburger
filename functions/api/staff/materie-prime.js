import { json } from "../../_utils.js";

// GET /staff/materie-prime — elenco per la ricerca prodotti nella richiesta di riordino
export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB
    .prepare("SELECT id, nome, reparto, unita_misura FROM magazzino_materie_prime WHERE attivo = 1 ORDER BY reparto, nome")
    .all();
  return json({ materie_prime: results });
}
