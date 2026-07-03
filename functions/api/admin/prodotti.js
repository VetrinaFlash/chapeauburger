import { json, idratraProdotto } from "../../_utils.js";

// GET /admin/prodotti — tutti (anche disattivati), con dati idratati
export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare("SELECT * FROM prodotti ORDER BY categoria_id, ordine ASC").all();
  return json({ prodotti: results.map(idratraProdotto) });
}

// POST /admin/prodotti — crea prodotto
export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ errore: "JSON non valido" }, 400);
  }

  const nome = String(body.nome || "").trim();
  const categoriaId = String(body.categoria_id || "");
  if (!nome) return json({ errore: "Il nome prodotto è obbligatorio" }, 400);
  if (!categoriaId) return json({ errore: "La categoria è obbligatoria" }, 400);

  const categoria = await env.DB.prepare("SELECT id FROM categorie WHERE id = ?").bind(categoriaId).first();
  if (!categoria) return json({ errore: `Categoria "${categoriaId}" inesistente` }, 400);

  const prezzi = Array.isArray(body.prezzi) && body.prezzi.length
    ? body.prezzi
    : [{ variante: "Unica", prezzo: Number(body.prezzo) || 0 }];

  const maxOrdine = await env.DB
    .prepare("SELECT MAX(ordine) AS m FROM prodotti WHERE categoria_id = ?")
    .bind(categoriaId)
    .first();

  const result = await env.DB
    .prepare(
      `INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, scelte_obbligatorie, scelte_multiple, rimozione_ingredienti, ordine, attivo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`
    )
    .bind(
      categoriaId,
      nome,
      String(body.descrizione || ""),
      String(body.immagine || ""),
      JSON.stringify(prezzi),
      JSON.stringify(Array.isArray(body.scelte_obbligatorie) ? body.scelte_obbligatorie : []),
      JSON.stringify(Array.isArray(body.scelte_multiple) ? body.scelte_multiple : []),
      body.rimozione_ingredienti ? 1 : 0,
      (maxOrdine?.m || 0) + 1
    )
    .run();

  return json({ ok: true, id: result.meta.last_row_id });
}
