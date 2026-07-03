import { json } from "../_utils.js";

// POST /api/ordini — creazione ordine cliente da menu.html
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
  const promoCodice = String(body.promo_codice || "").trim().toUpperCase();

  if (!cliente.nome || !cliente.telefono) {
    return json({ errore: "Nome e telefono sono obbligatori" }, 400);
  }
  if (items.length === 0) {
    return json({ errore: "Il carrello è vuoto" }, 400);
  }

  const subtotale = items.reduce((acc, it) => {
    const prezzoRiga = Number(it.prezzo_totale) || 0;
    const qta = Number(it.quantita) || 1;
    return acc + prezzoRiga * qta;
  }, 0);

  let sconto = 0;
  let promoApplicata = "";
  if (promoCodice) {
    const promo = await env.DB
      .prepare("SELECT * FROM promo WHERE codice = ? AND attivo = 1")
      .bind(promoCodice)
      .first();
    if (promo && subtotale >= (promo.min_ordine || 0)) {
      const oggi = new Date().toISOString().slice(0, 10);
      const scaduta = promo.scadenza && promo.scadenza < oggi;
      if (!scaduta) {
        sconto = promo.tipo === "percentuale" ? (subtotale * promo.valore) / 100 : promo.valore;
        sconto = Math.min(sconto, subtotale);
        promoApplicata = promoCodice;
      }
    }
  }

  const totale = Math.max(0, subtotale - sconto);

  try {
    await env.DB
      .prepare(
        `INSERT INTO clienti (nome, telefono, indirizzo)
         VALUES (?, ?, ?)
         ON CONFLICT(telefono) DO UPDATE SET nome = excluded.nome, indirizzo = excluded.indirizzo`
      )
      .bind(cliente.nome, cliente.telefono, cliente.indirizzo || "")
      .run();

    const result = await env.DB
      .prepare(
        `INSERT INTO ordini (cliente_nome, cliente_telefono, cliente_indirizzo, tipo, stato, items, totale, promo_codice, sconto, note, canale)
         VALUES (?, ?, ?, ?, 'nuovo', ?, ?, ?, ?, ?, 'web')`
      )
      .bind(
        cliente.nome,
        cliente.telefono,
        cliente.indirizzo || "",
        tipo,
        JSON.stringify(items),
        totale,
        promoApplicata,
        sconto,
        note
      )
      .run();

    return json({ ok: true, ordine_id: result.meta.last_row_id, totale, sconto });
  } catch (err) {
    return json({ errore: "Impossibile salvare l'ordine", dettaglio: String(err) }, 500);
  }
}
