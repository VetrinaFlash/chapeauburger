import { json } from "../../../_utils.js";

// GET /admin/magazzino/fornitori
export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare("SELECT * FROM magazzino_fornitori ORDER BY reparto, nome").all();
  return json({ fornitori: results });
}

// POST /admin/magazzino/fornitori — crea fornitore
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
    .prepare("INSERT INTO magazzino_fornitori (nome, whatsapp, reparto, attivo) VALUES (?, ?, ?, 1)")
    .bind(nome, String(body.whatsapp || ""), reparto)
    .run();

  return json({ ok: true, id: result.meta.last_row_id });
}
