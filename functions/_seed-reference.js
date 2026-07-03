// Riferimento "stato sano" usato dallo strumento di auto-diagnosi/ripristino
// (functions/admin/diagnosi.js). Deve rispecchiare il seed di schema.sql:
// se cambi il menu in schema.sql, aggiorna anche qui (nessuna build step nel
// progetto, quindi la sincronizzazione fra i due file è manuale e deliberata).

export const SEED_CATEGORIE = [
  { id: "antipasti", nome: "Antipasti & Fritti", icona: "🥟", ordine: 1 },
  { id: "primi", nome: "Primi Piatti", icona: "🍝", ordine: 2 },
  { id: "secondi", nome: "Secondi alla Brace", icona: "🍖", ordine: 3 },
  { id: "speciali", nome: "Il Crocchettone & Il Polpettone", icona: "🥙", ordine: 4 },
  { id: "panino", nome: "Componi il tuo Panino", icona: "🍔", ordine: 5 },
  { id: "vini", nome: "Vini", icona: "🍷", ordine: 6 },
  { id: "birre", nome: "Birre", icona: "🍺", ordine: 7 },
  { id: "bibite", nome: "Bibite", icona: "🥤", ordine: 8 },
];

const CONTORNI_OPZIONI = [
  "Rucola","Peperoni","Friarielli","Pomodori","Patate fritte","Insalata",
  "Melanzane a funghetto","Melanzane a filetto","Melanzane grigliate","Cipolla caramellata",
  "Funghi trifolati","Zucchine alla scapece","Zucchine grigliate","Parmigiana di melanzane","Parmigiana bianca",
].map((nome) => ({ nome, supplemento: 0 }));

export const SEED_PRODOTTI = [
  // ANTIPASTI
  { categoria_id: "antipasti", nome: "Fritto misto x2", descrizione: "Bruschette, zeppoline alle alghe, panzerotti, polpettine, arancine", prezzi: [{ variante: "Unica", prezzo: 8.0 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Tagliere salumi x2", descrizione: "Crudo di Parma, cotto Leoncini, speck, mortadella, mozzarella, salame", prezzi: [{ variante: "Unica", prezzo: 15.0 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Crudo e mozzarella", descrizione: "Crudo di Parma, mozzarella di Bufala", prezzi: [{ variante: "Unica", prezzo: 7.0 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Fagioli alla messicana", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 7.0 }] },
  { categoria_id: "antipasti", nome: "Polipo all'insalata x2", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 15.0 }] },
  { categoria_id: "antipasti", nome: "Crocchè di patate", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 1.5 }] },
  { categoria_id: "antipasti", nome: "Frittatina di zio Frank", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 2.0 }] },
  { categoria_id: "antipasti", nome: "Frittatina pasta, patate e provola", descrizione: "Pasta, patate, provola", prezzi: [{ variante: "Unica", prezzo: 2.5 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Frittatina salsiccia e friarielli", descrizione: "Salsiccia, friarielli", prezzi: [{ variante: "Unica", prezzo: 2.5 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Frittatina carbonara", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 2.5 }] },
  { categoria_id: "antipasti", nome: "Arancino", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 2.0 }] },
  { categoria_id: "antipasti", nome: "Patatine fritte piccola", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 2.0 }] },
  { categoria_id: "antipasti", nome: "Patatine fritte grande", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 4.0 }] },
  { categoria_id: "antipasti", nome: "Patatine fritte e wurstel", descrizione: "Patatine, wurstel", prezzi: [{ variante: "Unica", prezzo: 5.0 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Kebab e patatine", descrizione: "Kebab, patatine", prezzi: [{ variante: "Unica", prezzo: 7.0 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Kebab, patatine e cheddar", descrizione: "Kebab, patatine, cheddar", prezzi: [{ variante: "Unica", prezzo: 8.0 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Polpettine e patate", descrizione: "Polpettine, patate", prezzi: [{ variante: "Unica", prezzo: 6.0 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Polpettine, patate e cheddar", descrizione: "Polpettine, patate, cheddar", prezzi: [{ variante: "Unica", prezzo: 7.0 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Polpettine 20pz", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 5.0 }] },
  { categoria_id: "antipasti", nome: "Polpetta", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 1.0 }] },
  { categoria_id: "antipasti", nome: "Polpetta al sugo", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 1.5 }] },
  { categoria_id: "antipasti", nome: "Nuggets 8pz", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 4.0 }] },

  // PRIMI
  { categoria_id: "primi", nome: "Paccheri pesce spada e melanzane", descrizione: "Paccheri, pesce spada, melanzane", prezzi: [{ variante: "Unica", prezzo: 14.0 }], rimozione_ingredienti: true },
  { categoria_id: "primi", nome: "Bolognese", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 10.0 }] },
  { categoria_id: "primi", nome: "Boscaiola", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 10.0 }] },
  { categoria_id: "primi", nome: "Genovese", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 10.0 }] },
  { categoria_id: "primi", nome: "Pennette salsiccia e peperoni", descrizione: "Pennette, salsiccia, peperoni", prezzi: [{ variante: "Unica", prezzo: 9.0 }], rimozione_ingredienti: true },
  { categoria_id: "primi", nome: "Pennette speck, zucchine e mozzarella", descrizione: "Pennette, speck, zucchine, mozzarella", prezzi: [{ variante: "Unica", prezzo: 9.0 }], rimozione_ingredienti: true },
  { categoria_id: "primi", nome: "Carbonara", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 9.0 }] },
  { categoria_id: "primi", nome: "Pasta e patate con provola", descrizione: "Pasta, patate, provola", prezzi: [{ variante: "Unica", prezzo: 9.0 }], rimozione_ingredienti: true },
  { categoria_id: "primi", nome: "Spaghetti alle vongole", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 15.0 }] },
  { categoria_id: "primi", nome: "Pomodoro fresco", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 8.0 }] },
  { categoria_id: "primi", nome: "Scarpariello", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 8.0 }] },
  { categoria_id: "primi", nome: "Siciliana", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 9.0 }] },
  { categoria_id: "primi", nome: "Ragù Napoletano", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 10.0 }] },
  { categoria_id: "primi", nome: "Arrabbiata", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 8.0 }] },
  { categoria_id: "primi", nome: "Bucatini all'Amatriciana", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 9.0 }] },

  // SECONDI
  { categoria_id: "secondi", nome: "Frittura di gamberi e calamari", descrizione: "Gamberi, calamari", prezzi: [{ variante: "Unica", prezzo: 15.0 }], rimozione_ingredienti: true },
  { categoria_id: "secondi", nome: "Zuppa di cozze", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 15.0 }] },
  { categoria_id: "secondi", nome: "Pesce spada alla brace", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 11.0 }] },
  { categoria_id: "secondi", nome: "Costoletta di maiale", descrizione: "Alla brace con contorno a scelta", prezzi: [{ variante: "Unica", prezzo: 8.0 }], scelte_obbligatorie: [{ nome: "Contorno", opzioni: CONTORNI_OPZIONI }] },
  { categoria_id: "secondi", nome: "Salsiccia di maiale nero", descrizione: "Alla brace con contorno a scelta", prezzi: [{ variante: "Unica", prezzo: 7.0 }], scelte_obbligatorie: [{ nome: "Contorno", opzioni: CONTORNI_OPZIONI }] },
  { categoria_id: "secondi", nome: "Tris di pesce alla brace", descrizione: "Gamberi, calamari, pesce spada", prezzi: [{ variante: "Unica", prezzo: 15.0 }], rimozione_ingredienti: true },
  { categoria_id: "secondi", nome: "Tris di carne alla brace", descrizione: "Hamburger di Scottona 180gr, salsiccia di maiale nero, costoletta di maiale, contorno a scelta", prezzi: [{ variante: "Unica", prezzo: 15.0 }], scelte_obbligatorie: [{ nome: "Contorno", opzioni: CONTORNI_OPZIONI }], rimozione_ingredienti: true },
  { categoria_id: "secondi", nome: "Cotoletta e patatine", descrizione: "Cotoletta, patatine", prezzi: [{ variante: "Unica", prezzo: 7.0 }], rimozione_ingredienti: true },

  // SPECIALI
  { categoria_id: "speciali", nome: "Il Crocchettone", descrizione: "Crocchè gigante ripieno, scegli il gusto", prezzi: [{ variante: "Unica", prezzo: 7.0 }], scelte_obbligatorie: [{ nome: "Gusto", opzioni: ["Salsiccia e Friarielli","Parmigiana e Provola","Prosciutto Cotto e Mozzarella","Mortadella e Crema di Pistacchio","Polpette al Ragù","Bacon e Cheddar"].map((nome) => ({ nome, supplemento: 0 })) }] },
  { categoria_id: "speciali", nome: "Il Polpettone", descrizione: "Polpettone gigante ripieno, scegli il gusto", prezzi: [{ variante: "Unica", prezzo: 7.0 }], scelte_obbligatorie: [{ nome: "Gusto", opzioni: ["Porchetta e Funghi","Prosciutto Cotto e Mozzarella","Salsiccia e Friarielli","Parmigiana e Provola","Mortadella e Crema di Pistacchio","Bacon e Cheddar"].map((nome) => ({ nome, supplemento: 0 })) }] },

  // PANINO
  {
    categoria_id: "panino", nome: "Componi il tuo Panino",
    descrizione: "Scegli la base e personalizza con formaggi, contorni ed extra",
    prezzi: [
      { variante: "Hamburger Fassona 180gr", prezzo: 9.0 },
      { variante: "Hamburger Black Angus USA 180gr", prezzo: 9.0 },
      { variante: "Hamburger Chianina 180gr", prezzo: 7.0 },
      { variante: "Hamburger Marchigiana 180gr", prezzo: 6.0 },
      { variante: "Hamburger Scottona 180gr", prezzo: 5.0 },
      { variante: "Petto di Pollo a fette", prezzo: 5.0 },
      { variante: "Salsiccia di Maiale Nero", prezzo: 5.0 },
      { variante: "Porchetta", prezzo: 5.0 },
      { variante: "Cotoletta di Pollo", prezzo: 5.0 },
      { variante: "Wurstel", prezzo: 4.0 },
      { variante: "Kebab", prezzo: 5.0 },
    ],
    scelte_multiple: [
      { nome: "Formaggi", min: 0, max: null, opzioni: [
        { nome: "Mozzarella", supplemento: 0.5 }, { nome: "Cheddar", supplemento: 0.5 },
        { nome: "Sottilette", supplemento: 0.5 }, { nome: "Provola affumicata", supplemento: 0.5 },
      ]},
      { nome: "Extra", min: 0, max: null, opzioni: [
        { nome: "Uova occhio di bue", supplemento: 1.0 }, { nome: "Anelli di cipolla 3pz", supplemento: 1.0 },
        { nome: "Crema di pistacchio", supplemento: 1.0 }, { nome: "Mortadella IGP", supplemento: 1.0 },
        { nome: "Scaglie di grana", supplemento: 1.0 }, { nome: "Bacon IGP", supplemento: 1.0 },
        { nome: "Pesto", supplemento: 1.0 }, { nome: "Speck IGP", supplemento: 1.0 },
        { nome: "Crema di noci", supplemento: 1.0 }, { nome: "Bocconcini di mozzarella", supplemento: 2.0 },
      ]},
      { nome: "I tuoi contorni", min: 0, max: null, opzioni: CONTORNI_OPZIONI.map((o) => ({ ...o, supplemento: 0.5 })) },
    ],
  },

  // VINI
  { categoria_id: "vini", nome: "Aglianico Cecere 75cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 15.0 }] },
  { categoria_id: "vini", nome: "Fiano di Avellino 75cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 15.0 }] },
  { categoria_id: "vini", nome: "Aglianico 35cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 8.0 }] },
  { categoria_id: "vini", nome: "Falanghina 35cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 8.0 }] },
  { categoria_id: "vini", nome: "Granato Calabrese Rosso 75cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 10.0 }] },
  { categoria_id: "vini", nome: "Malvasia Bianco 75cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 10.0 }] },

  // BIRRE
  { categoria_id: "birre", nome: "Tennent's 9% 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 3.0 }] },
  { categoria_id: "birre", nome: "Heineken 5% 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 3.0 }] },
  { categoria_id: "birre", nome: "Zi Mari 5.1% 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 6.0 }] },
  { categoria_id: "birre", nome: "Angie 5.4% 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 6.0 }] },
  { categoria_id: "birre", nome: "Don Luis 8% 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 6.0 }] },

  // BIBITE
  { categoria_id: "bibite", nome: "Coca Cola 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 2.0 }] },
  { categoria_id: "bibite", nome: "Coca Cola Zero 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 2.0 }] },
  { categoria_id: "bibite", nome: "Fanta 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 2.0 }] },
  { categoria_id: "bibite", nome: "Tè alla Pesca 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 2.0 }] },
  { categoria_id: "bibite", nome: "Acqua 50cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 1.0 }] },
  { categoria_id: "bibite", nome: "Acqua 1lt", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 2.0 }] },
].map((p) => ({
  scelte_obbligatorie: [],
  scelte_multiple: [],
  rimozione_ingredienti: false,
  ...p,
}));
