import { json } from "../../_utils.js";

// GET /admin/impostazioni — tutte le chiavi come oggetto
export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare("SELECT * FROM impostazioni").all();
  const obj = {};
  for (const row of results) obj[row.chiave] = row.valore;
  return json({ impostazioni: obj });
}

// PUT /admin/impostazioni — aggiorna SOLO le chiavi inviate (upsert), non tocca le altre
export async function onRequestPut(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ errore: "JSON non valido" }, 400);
  }

  const voci = Object.entries(body || {});
  if (voci.length === 0) return json({ errore: "Nessuna impostazione inviata" }, 400);

  for (const [chiave, valore] of voci) {
    await env.DB
      .prepare(
        `INSERT INTO impostazioni (chiave, valore) VALUES (?, ?)
         ON CONFLICT(chiave) DO UPDATE SET valore = excluded.valore`
      )
      .bind(chiave, String(valore))
      .run();
  }

  return json({ ok: true });
}
