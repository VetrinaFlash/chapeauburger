import { json } from "../../../../_utils.js";

// PUT /admin/magazzino/materie-prime/:id — update parziale sicuro
export async function onRequestPut(context) {
  const { request, env, params } = context;
  const id = Number(params.id);

  const attuale = await env.DB.prepare("SELECT * FROM magazzino_materie_prime WHERE id = ?").bind(id).first();
  if (!attuale) return json({ errore: "Materia prima non trovata" }, 404);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ errore: "JSON non valido" }, 400);
  }

  const nome = body.nome !== undefined ? String(body.nome) : attuale.nome;
  const reparto = body.reparto !== undefined ? String(body.reparto) : attuale.reparto;
  const unitaMisura = body.unita_misura !== undefined ? String(body.unita_misura) : attuale.unita_misura;
  const prezzoRiferimento = body.prezzo_riferimento !== undefined ? Number(body.prezzo_riferimento) : attuale.prezzo_riferimento;
  const attivo = body.attivo !== undefined ? (body.attivo ? 1 : 0) : attuale.attivo;

  await env.DB
    .prepare(
      "UPDATE magazzino_materie_prime SET nome = ?, reparto = ?, unita_misura = ?, prezzo_riferimento = ?, attivo = ? WHERE id = ?"
    )
    .bind(nome, reparto, unitaMisura, prezzoRiferimento, attivo, id)
    .run();

  return json({ ok: true });
}

// DELETE /admin/magazzino/materie-prime/:id
export async function onRequestDelete(context) {
  const { env, params } = context;
  await env.DB.prepare("DELETE FROM magazzino_materie_prime WHERE id = ?").bind(Number(params.id)).run();
  return json({ ok: true });
}
