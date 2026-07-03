import { json, parseJSONSafe } from "../../_utils.js";

// GET /admin/ordini?stato=nuovo — lista con filtro opzionale per stato
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const stato = url.searchParams.get("stato");

  const query = stato
    ? env.DB.prepare("SELECT * FROM ordini WHERE stato = ? ORDER BY creato_il DESC").bind(stato)
    : env.DB.prepare("SELECT * FROM ordini ORDER BY creato_il DESC LIMIT 300");

  const { results } = await query.all();
  const ordini = results.map((o) => ({ ...o, items: parseJSONSafe(o.items, []) }));
  return json({ ordini });
}

// POST /admin/ordini — ordine manuale creato da admin (dal catalogo reale, non testo libero)
export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ errore: "JSON non valido" }, 400);
  }

  const cliente = body.cliente || {};
  const items = Array.isArray(body.items) ? body.items : [];
  const tipo = body.tipo === "domicilio" ? "domicilio" : "asporto";
  const note = String(body.note || "").slice(0, 500);

  if (items.length === 0) return json({ errore: "Il carrello è vuoto" }, 400);

  const totale = items.reduce((acc, it) => {
    const prezzoRiga = Number(it.prezzo_totale) || 0;
    const qta = Number(it.quantita) || 1;
    return acc + prezzoRiga * qta;
  }, 0);

  if (cliente.nome && cliente.telefono) {
    await env.DB
      .prepare(
        `INSERT INTO clienti (nome, telefono, indirizzo)
         VALUES (?, ?, ?)
         ON CONFLICT(telefono) DO UPDATE SET nome = excluded.nome, indirizzo = excluded.indirizzo`
      )
      .bind(cliente.nome, cliente.telefono, cliente.indirizzo || "")
      .run();
  }

  const result = await env.DB
    .prepare(
      `INSERT INTO ordini (cliente_nome, cliente_telefono, cliente_indirizzo, tipo, stato, items, totale, note, canale)
       VALUES (?, ?, ?, ?, 'nuovo', ?, ?, ?, 'admin')`
    )
    .bind(cliente.nome || "Cliente banco", cliente.telefono || "", cliente.indirizzo || "", tipo, JSON.stringify(items), totale, note)
    .run();

  return json({ ok: true, ordine_id: result.meta.last_row_id, totale });
}
