import { json } from "../../../_utils.js";

// IMPORTANTE: l'id categoria è testuale (es. "pizze-americane").
// Non va MAI passato a parseInt() lato frontend né trattato come numero qui:
// produrrebbe NaN/null e orfanizzerebbe i prodotti collegati.

// PUT /admin/categorie/:id — update parziale sicuro (mai campo || default)
export async function onRequestPut(context) {
  const { request, env, params } = context;
  const id = String(params.id);

  const attuale = await env.DB.prepare("SELECT * FROM categorie WHERE id = ?").bind(id).first();
  if (!attuale) return json({ errore: "Categoria non trovata" }, 404);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ errore: "JSON non valido" }, 400);
  }

  const nome = body.nome !== undefined ? String(body.nome) : attuale.nome;
  const icona = body.icona !== undefined ? String(body.icona) : attuale.icona;
  const ordine = body.ordine !== undefined ? Number(body.ordine) : attuale.ordine;
  const attiva = body.attiva !== undefined ? (body.attiva ? 1 : 0) : attuale.attiva;

  await env.DB
    .prepare("UPDATE categorie SET nome = ?, icona = ?, ordine = ?, attiva = ? WHERE id = ?")
    .bind(nome, icona, ordine, attiva, id)
    .run();

  return json({ ok: true });
}

// DELETE /admin/categorie/:id — rifiuta se ci sono prodotti collegati
export async function onRequestDelete(context) {
  const { env, params } = context;
  const id = String(params.id);

  const prodottiCollegati = await env.DB
    .prepare("SELECT COUNT(*) AS n FROM prodotti WHERE categoria_id = ?")
    .bind(id)
    .first();

  if (prodottiCollegati.n > 0) {
    return json(
      { errore: `Impossibile eliminare: ${prodottiCollegati.n} prodotto/i collegati a questa categoria. Spostali o eliminali prima.` },
      409
    );
  }

  await env.DB.prepare("DELETE FROM categorie WHERE id = ?").bind(id).run();
  return json({ ok: true });
}
