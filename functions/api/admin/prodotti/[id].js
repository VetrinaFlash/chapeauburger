import { json, idratraProdotto } from "../../../_utils.js";

// PUT /admin/prodotti/:id
//
// REGOLA ANTI-BUG (imparata da un incidente reale in produzione):
// mai `body.campo || valoreAttuale.campo` — se un form semplice non invia
// "prezzi" o "scelte_obbligatorie", `[] || attuale` valuterebbe comunque
// attuale solo se `[]` fosse falsy, ma un default sbagliato o un campo
// omesso può comunque azzerare dati. Si legge SEMPRE prima la riga corrente
// e si usa `campo !== undefined ? campo : attuale.campo`, mai un OR.
export async function onRequestPut(context) {
  const { request, env, params } = context;
  const id = Number(params.id); // PK numerica del prodotto, non l'id categoria (quello è testuale)

  const attualeRaw = await env.DB.prepare("SELECT * FROM prodotti WHERE id = ?").bind(id).first();
  if (!attualeRaw) return json({ errore: "Prodotto non trovato" }, 404);
  const attuale = idratraProdotto(attualeRaw);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ errore: "JSON non valido" }, 400);
  }

  if (body.categoria_id !== undefined) {
    const categoria = await env.DB.prepare("SELECT id FROM categorie WHERE id = ?").bind(String(body.categoria_id)).first();
    if (!categoria) return json({ errore: `Categoria "${body.categoria_id}" inesistente` }, 400);
  }

  const categoriaId = body.categoria_id !== undefined ? String(body.categoria_id) : attuale.categoria_id;
  const nome = body.nome !== undefined ? String(body.nome) : attuale.nome;
  const descrizione = body.descrizione !== undefined ? String(body.descrizione) : attuale.descrizione;
  const immagine = body.immagine !== undefined ? String(body.immagine) : attuale.immagine;
  const prezzi = body.prezzi !== undefined ? body.prezzi : attuale.prezzi;
  const scelteObbligatorie = body.scelte_obbligatorie !== undefined ? body.scelte_obbligatorie : attuale.scelte_obbligatorie;
  const scelteMultiple = body.scelte_multiple !== undefined ? body.scelte_multiple : attuale.scelte_multiple;
  const rimozioneIngredienti = body.rimozione_ingredienti !== undefined ? (body.rimozione_ingredienti ? 1 : 0) : (attuale.rimozione_ingredienti ? 1 : 0);
  const ordine = body.ordine !== undefined ? Number(body.ordine) : attuale.ordine;
  const attivo = body.attivo !== undefined ? (body.attivo ? 1 : 0) : (attuale.attivo ? 1 : 0);

  await env.DB
    .prepare(
      `UPDATE prodotti SET categoria_id = ?, nome = ?, descrizione = ?, immagine = ?,
       prezzi = ?, scelte_obbligatorie = ?, scelte_multiple = ?, rimozione_ingredienti = ?,
       ordine = ?, attivo = ? WHERE id = ?`
    )
    .bind(
      categoriaId,
      nome,
      descrizione,
      immagine,
      JSON.stringify(prezzi),
      JSON.stringify(scelteObbligatorie),
      JSON.stringify(scelteMultiple),
      rimozioneIngredienti,
      ordine,
      attivo,
      id
    )
    .run();

  return json({ ok: true });
}

// DELETE /admin/prodotti/:id
export async function onRequestDelete(context) {
  const { env, params } = context;
  const id = Number(params.id);
  await env.DB.prepare("DELETE FROM prodotti WHERE id = ?").bind(id).run();
  return json({ ok: true });
}
