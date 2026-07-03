import { json } from "../../../_utils.js";

// GET /admin/magazzino/report — contabilità spesa aggregata
// (per reparto/fornitore, per singolo ordine, per settimana, per mese)
// basata sul prezzo_riferimento delle materie prime.
export async function onRequestGet(context) {
  const { env } = context;

  const perReparto = await env.DB
    .prepare(
      `SELECT m.reparto AS reparto, ROUND(SUM(i.quantita * m.prezzo_riferimento), 2) AS totale_spesa, COUNT(DISTINCT i.ordine_id) AS numero_ordini
       FROM magazzino_ordini_items i
       JOIN magazzino_materie_prime m ON m.id = i.materia_prima_id
       GROUP BY m.reparto
       ORDER BY totale_spesa DESC`
    )
    .all();

  const perOrdine = await env.DB
    .prepare(
      `SELECT o.id AS ordine_id, o.creato_il, o.stato, ROUND(SUM(i.quantita * m.prezzo_riferimento), 2) AS totale_spesa
       FROM magazzino_ordini o
       JOIN magazzino_ordini_items i ON i.ordine_id = o.id
       JOIN magazzino_materie_prime m ON m.id = i.materia_prima_id
       GROUP BY o.id
       ORDER BY o.creato_il DESC`
    )
    .all();

  const perSettimana = await env.DB
    .prepare(
      `SELECT strftime('%Y-W%W', o.creato_il) AS periodo, ROUND(SUM(i.quantita * m.prezzo_riferimento), 2) AS totale_spesa
       FROM magazzino_ordini o
       JOIN magazzino_ordini_items i ON i.ordine_id = o.id
       JOIN magazzino_materie_prime m ON m.id = i.materia_prima_id
       GROUP BY periodo
       ORDER BY periodo DESC`
    )
    .all();

  const perMese = await env.DB
    .prepare(
      `SELECT strftime('%Y-%m', o.creato_il) AS periodo, ROUND(SUM(i.quantita * m.prezzo_riferimento), 2) AS totale_spesa
       FROM magazzino_ordini o
       JOIN magazzino_ordini_items i ON i.ordine_id = o.id
       JOIN magazzino_materie_prime m ON m.id = i.materia_prima_id
       GROUP BY periodo
       ORDER BY periodo DESC`
    )
    .all();

  return json({
    per_reparto: perReparto.results,
    per_ordine: perOrdine.results,
    per_settimana: perSettimana.results,
    per_mese: perMese.results,
  });
}
