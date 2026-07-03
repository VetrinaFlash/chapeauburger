import { json } from "../../../_utils.js";

// GET /admin/magazzino/materie-prime
export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare("SELECT * FROM magazzino_materie_prime ORDER BY reparto, nome").all();
  return json({ materie_prime: results });
}

// POST /admin/magazzino/materie-prime — crea materia prima
export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ errore: "JSON non valido" }, 400);
  }

  const nome = String(body.nome || "").trim();
  const reparto = String(body.reparto || "").trim();
  if (!nome || !reparto) return json({ errore: "Nome e reparto sono obbligatori" }, 400);

  const result = await env.DB
    .prepare(
      "INSERT INTO magazzino_materie_prime (nome, reparto, unita_misura, prezzo_riferimento, attivo) VALUES (?, ?, ?, ?, 1)"
    )
    .bind(nome, reparto, String(body.unita_misura || "pz"), Number(body.prezzo_riferimento) || 0)
    .run();

  return json({ ok: true, id: result.meta.last_row_id });
}
