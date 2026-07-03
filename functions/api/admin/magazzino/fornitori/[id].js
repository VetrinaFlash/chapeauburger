import { json } from "../../../../_utils.js";

// PUT /admin/magazzino/fornitori/:id — rinomina/modifica (update parziale sicuro)
export async function onRequestPut(context) {
  const { request, env, params } = context;
  const id = Number(params.id);

  const attuale = await env.DB.prepare("SELECT * FROM magazzino_fornitori WHERE id = ?").bind(id).first();
  if (!attuale) return json({ errore: "Fornitore non trovato" }, 404);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ errore: "JSON non valido" }, 400);
  }

  const nome = body.nome !== undefined ? String(body.nome) : attuale.nome;
  const whatsapp = body.whatsapp !== undefined ? String(body.whatsapp) : attuale.whatsapp;
  const reparto = body.reparto !== undefined ? String(body.reparto) : attuale.reparto;
  const attivo = body.attivo !== undefined ? (body.attivo ? 1 : 0) : attuale.attivo;

  await env.DB
    .prepare("UPDATE magazzino_fornitori SET nome = ?, whatsapp = ?, reparto = ?, attivo = ? WHERE id = ?")
    .bind(nome, whatsapp, reparto, attivo, id)
    .run();

  return json({ ok: true });
}

// DELETE /admin/magazzino/fornitori/:id
export async function onRequestDelete(context) {
  const { env, params } = context;
  await env.DB.prepare("DELETE FROM magazzino_fornitori WHERE id = ?").bind(Number(params.id)).run();
  return json({ ok: true });
}
