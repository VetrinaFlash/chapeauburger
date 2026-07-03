import { json, idratraProdotto } from "../../_utils.js";
import { SEED_CATEGORIE, SEED_PRODOTTI } from "../../_seed-reference.js";

// Strumento di auto-diagnosi/ripristino menu.
// GET  = anteprima "cosa verrebbe corretto e perché" (nessuna scrittura)
// POST = applica le correzioni (da usare solo dopo conferma esplicita in admin)
//
// Confronta lo stato attuale del DB con il riferimento noto buono
// (functions/_seed-reference.js, che rispecchia il seed di schema.sql).
// Non tocca mai immagine/ordine/attivo: quelli possono essere personalizzazioni
// legittime dell'admin, non corruzioni di dati.

async function calcolaCorrezioni(env) {
  const correzioni = [];

  const { results: categorieAttuali } = await env.DB.prepare("SELECT * FROM categorie").all();
  const { results: prodottiAttualiRaw } = await env.DB.prepare("SELECT * FROM prodotti").all();
  const prodottiAttuali = prodottiAttualiRaw.map(idratraProdotto);

  for (const catRif of SEED_CATEGORIE) {
    const attuale = categorieAttuali.find((c) => c.id === catRif.id);
    if (!attuale) {
      correzioni.push({
        tipo: "categoria_mancante",
        categoria_id: catRif.id,
        motivo: `La categoria "${catRif.nome}" (${catRif.id}) non esiste nel database.`,
        azione: "Verrà ricreata con nome e icona di riferimento.",
        dati: catRif,
      });
    } else if (attuale.nome !== catRif.nome || attuale.icona !== catRif.icona) {
      correzioni.push({
        tipo: "categoria_da_correggere",
        categoria_id: catRif.id,
        motivo: `Nome/icona di "${catRif.id}" non corrispondono al riferimento (attuale: "${attuale.nome}" ${attuale.icona}, riferimento: "${catRif.nome}" ${catRif.icona}).`,
        azione: "Nome e icona verranno ripristinati al valore di riferimento.",
        dati: catRif,
      });
    }
  }

  for (const prodRif of SEED_PRODOTTI) {
    const attuale = prodottiAttuali.find(
      (p) => p.categoria_id === prodRif.categoria_id && p.nome === prodRif.nome
    );

    if (!attuale) {
      correzioni.push({
        tipo: "prodotto_mancante",
        nome: prodRif.nome,
        categoria_id: prodRif.categoria_id,
        motivo: `Il prodotto "${prodRif.nome}" (categoria ${prodRif.categoria_id}) non esiste nel database.`,
        azione: "Verrà ricreato con prezzi/scelte di riferimento.",
        dati: prodRif,
      });
      continue;
    }

    const campiDaVerificare = [
      ["descrizione", "descrizione"],
      ["prezzi", "prezzi"],
      ["scelte_obbligatorie", "scelte_obbligatorie"],
      ["scelte_multiple", "scelte_multiple"],
      ["rimozione_ingredienti", "rimozione_ingredienti"],
    ];

    const campiDrift = [];
    for (const [campo] of campiDaVerificare) {
      const valRif = JSON.stringify(prodRif[campo] ?? (campo === "rimozione_ingredienti" ? false : campo === "descrizione" ? "" : []));
      const valAttuale = JSON.stringify(attuale[campo] ?? (campo === "rimozione_ingredienti" ? false : campo === "descrizione" ? "" : []));
      if (valRif !== valAttuale) campiDrift.push(campo);
    }

    if (campiDrift.length > 0) {
      correzioni.push({
        tipo: "prodotto_da_correggere",
        prodotto_id: attuale.id,
        nome: prodRif.nome,
        categoria_id: prodRif.categoria_id,
        motivo: `I campi [${campiDrift.join(", ")}] di "${prodRif.nome}" non corrispondono al riferimento — probabile salvataggio parziale da un form che non gestiva questi campi.`,
        azione: `Verranno ripristinati solo i campi [${campiDrift.join(", ")}]. Immagine, ordine e stato attivo/disattivo NON vengono toccati.`,
        dati: prodRif,
        campi_da_correggere: campiDrift,
      });
    }
  }

  return correzioni;
}

// GET /admin/diagnosi — anteprima
export async function onRequestGet(context) {
  const { env } = context;
  const correzioni = await calcolaCorrezioni(env);
  return json({ sano: correzioni.length === 0, correzioni });
}

// POST /admin/diagnosi — applica le correzioni
export async function onRequestPost(context) {
  const { env } = context;
  const correzioni = await calcolaCorrezioni(env);

  for (const c of correzioni) {
    if (c.tipo === "categoria_mancante") {
      await env.DB
        .prepare("INSERT INTO categorie (id, nome, icona, ordine, attiva) VALUES (?, ?, ?, ?, 1)")
        .bind(c.dati.id, c.dati.nome, c.dati.icona, c.dati.ordine)
        .run();
    } else if (c.tipo === "categoria_da_correggere") {
      await env.DB
        .prepare("UPDATE categorie SET nome = ?, icona = ? WHERE id = ?")
        .bind(c.dati.nome, c.dati.icona, c.categoria_id)
        .run();
    } else if (c.tipo === "prodotto_mancante") {
      const p = c.dati;
      const maxOrdine = await env.DB
        .prepare("SELECT MAX(ordine) AS m FROM prodotti WHERE categoria_id = ?")
        .bind(p.categoria_id)
        .first();
      await env.DB
        .prepare(
          `INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, scelte_obbligatorie, scelte_multiple, rimozione_ingredienti, ordine, attivo)
           VALUES (?, ?, ?, '', ?, ?, ?, ?, ?, 1)`
        )
        .bind(
          p.categoria_id,
          p.nome,
          p.descrizione || "",
          JSON.stringify(p.prezzi || []),
          JSON.stringify(p.scelte_obbligatorie || []),
          JSON.stringify(p.scelte_multiple || []),
          p.rimozione_ingredienti ? 1 : 0,
          (maxOrdine?.m || 0) + 1
        )
        .run();
    } else if (c.tipo === "prodotto_da_correggere") {
      const p = c.dati;
      const set = [];
      const binds = [];
      for (const campo of c.campi_da_correggere) {
        if (campo === "rimozione_ingredienti") {
          set.push("rimozione_ingredienti = ?");
          binds.push(p.rimozione_ingredienti ? 1 : 0);
        } else if (campo === "descrizione") {
          set.push("descrizione = ?");
          binds.push(p.descrizione || "");
        } else {
          set.push(`${campo} = ?`);
          binds.push(JSON.stringify(p[campo] || []));
        }
      }
      binds.push(c.prodotto_id);
      await env.DB.prepare(`UPDATE prodotti SET ${set.join(", ")} WHERE id = ?`).bind(...binds).run();
    }
  }

  return json({ ok: true, corrette: correzioni.length });
}
