import { json } from "../../_utils.js";

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET /admin/categorie — tutte (anche disattivate)
export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare("SELECT * FROM categorie ORDER BY ordine ASC").all();
  return json({ categorie: results });
}

// POST /admin/categorie — crea categoria
export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ errore: "JSON non valido" }, 400);
  }

  const nome = String(body.nome || "").trim();
  if (!nome) return json({ errore: "Il nome categoria è obbligatorio" }, 400);

  let id = String(body.id || slugify(nome));
  if (!id) return json({ errore: "Impossibile generare un id valido per la categoria" }, 400);

  const icona = String(body.icona || "🍽️");
  const esistente = await env.DB.prepare("SELECT id FROM categorie WHERE id = ?").bind(id).first();
  if (esistente) {
    return json({ errore: `Esiste già una categoria con id "${id}"` }, 409);
  }

  const maxOrdine = await env.DB.prepare("SELECT MAX(ordine) AS m FROM categorie").first();
  const ordine = Number.isFinite(body.ordine) ? body.ordine : (maxOrdine?.m || 0) + 1;

  await env.DB
    .prepare("INSERT INTO categorie (id, nome, icona, ordine, attiva) VALUES (?, ?, ?, ?, 1)")
    .bind(id, nome, icona, ordine)
    .run();

  return json({ ok: true, id });
}
