import { json, idratraProdotto } from "../_utils.js";

// GET /api/menu — catalogo pubblico, categorie + prodotti attivi
export async function onRequestGet(context) {
  const { env } = context;
  try {
    const categorie = await env.DB
      .prepare("SELECT * FROM categorie WHERE attiva = 1 ORDER BY ordine ASC")
      .all();
    const prodotti = await env.DB
      .prepare("SELECT * FROM prodotti WHERE attivo = 1 ORDER BY ordine ASC")
      .all();

    const catalogo = categorie.results.map((cat) => ({
      id: cat.id,
      nome: cat.nome,
      icona: cat.icona,
      prodotti: prodotti.results
        .filter((p) => p.categoria_id === cat.id)
        .map(idratraProdotto),
    }));

    return json({ categorie: catalogo });
  } catch (err) {
    return json({ errore: "Impossibile caricare il menu", dettaglio: String(err) }, 500);
  }
}
