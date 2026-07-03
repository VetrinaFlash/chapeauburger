// Catalogo statico imbottito nel client: usato SOLO se /api/menu non risponde,
// per garantire che l'ordinazione funzioni comunque. Tenerlo allineato a schema.sql.
const CONTORNI_OPZIONI = [
  "Rucola","Peperoni","Friarielli","Pomodori","Patate fritte","Insalata",
  "Melanzane a funghetto","Melanzane a filetto","Melanzane grigliate","Cipolla caramellata",
  "Funghi trifolati","Zucchine alla scapece","Zucchine grigliate","Parmigiana di melanzane","Parmigiana bianca",
].map((nome) => ({ nome, supplemento: 0 }));

function u(prezzo) { return [{ variante: "Unica", prezzo }]; }

window.FALLBACK_MENU = {
  categorie: [
    {
      id: "antipasti", nome: "Antipasti & Fritti", icona: "🥟",
      prodotti: [
        { id: "a1", nome: "Fritto misto x2", descrizione: "Bruschette, zeppoline alle alghe, panzerotti, polpettine, arancine", immagine: "images/piatti/fritto-misto.jpg", prezzi: u(8.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a2", nome: "Tagliere salumi x2", descrizione: "Crudo di Parma, cotto Leoncini, speck, mortadella, mozzarella, salame", immagine: "images/piatti/tagliere-salumi.jpg", prezzi: u(15.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a3", nome: "Crudo e mozzarella", descrizione: "Crudo di Parma, mozzarella di Bufala", immagine: "images/piatti/crudo-mozzarella.jpg", prezzi: u(7.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a4", nome: "Fagioli alla messicana", descrizione: "", immagine: "images/piatti/fagioli-messicana.jpg", prezzi: u(7.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a5", nome: "Polipo all'insalata x2", descrizione: "", immagine: "images/piatti/polipo-insalata.jpg", prezzi: u(15.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a6", nome: "Crocchè di patate", descrizione: "", immagine: "images/piatti/crocche-patate.jpg", prezzi: u(1.5), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a7", nome: "Frittatina di zio Frank", descrizione: "", immagine: "images/piatti/frittatina-zio-frank.jpg", prezzi: u(2.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a8", nome: "Frittatina pasta, patate e provola", descrizione: "Pasta, patate, provola", immagine: "images/piatti/frittatina-pasta-patate.jpg", prezzi: u(2.5), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a9", nome: "Frittatina salsiccia e friarielli", descrizione: "Salsiccia, friarielli", immagine: "images/piatti/frittatina-salsiccia-friarielli.jpg", prezzi: u(2.5), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a10", nome: "Frittatina carbonara", descrizione: "", immagine: "images/piatti/frittatina-carbonara.jpg", prezzi: u(2.5), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a11", nome: "Arancino", descrizione: "", immagine: "images/piatti/arancino.jpg", prezzi: u(2.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a12", nome: "Patatine fritte piccola", descrizione: "", immagine: "images/piatti/patatine-piccola.jpg", prezzi: u(2.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a13", nome: "Patatine fritte grande", descrizione: "", immagine: "images/piatti/patatine-grande.jpg", prezzi: u(4.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a14", nome: "Patatine fritte e wurstel", descrizione: "Patatine, wurstel", immagine: "images/piatti/patatine-wurstel.jpg", prezzi: u(5.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a15", nome: "Kebab e patatine", descrizione: "Kebab, patatine", immagine: "images/piatti/kebab-patatine.jpg", prezzi: u(7.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a16", nome: "Kebab, patatine e cheddar", descrizione: "Kebab, patatine, cheddar", immagine: "images/piatti/kebab-patatine-cheddar.jpg", prezzi: u(8.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a17", nome: "Polpettine e patate", descrizione: "Polpettine, patate", immagine: "images/piatti/polpettine-patate.jpg", prezzi: u(6.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a18", nome: "Polpettine, patate e cheddar", descrizione: "Polpettine, patate, cheddar", immagine: "images/piatti/polpettine-patate-cheddar.jpg", prezzi: u(7.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a19", nome: "Polpettine 20pz", descrizione: "", immagine: "images/piatti/polpettine-20pz.jpg", prezzi: u(5.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a20", nome: "Polpetta", descrizione: "", immagine: "images/piatti/polpetta.jpg", prezzi: u(1.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a21", nome: "Polpetta al sugo", descrizione: "", immagine: "images/piatti/polpetta-sugo.jpg", prezzi: u(1.5), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a22", nome: "Nuggets 8pz", descrizione: "", immagine: "images/piatti/nuggets-8pz.jpg", prezzi: u(4.0), scelte_obbligatorie: [], scelte_multiple: [] },
      ],
    },
    {
      id: "primi", nome: "Primi Piatti", icona: "🍝",
      prodotti: [
        { id: "p1", nome: "Paccheri pesce spada e melanzane", descrizione: "Paccheri, pesce spada, melanzane", immagine: "images/piatti/paccheri-pesce-spada.jpg", prezzi: u(14.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "p2", nome: "Bolognese", descrizione: "", immagine: "images/piatti/bolognese.jpg", prezzi: u(10.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "p3", nome: "Boscaiola", descrizione: "", immagine: "images/piatti/boscaiola.jpg", prezzi: u(10.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "p4", nome: "Genovese", descrizione: "", immagine: "images/piatti/genovese.jpg", prezzi: u(10.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "p5", nome: "Pennette salsiccia e peperoni", descrizione: "Pennette, salsiccia, peperoni", immagine: "images/piatti/pennette-salsiccia-peperoni.jpg", prezzi: u(9.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "p6", nome: "Pennette speck, zucchine e mozzarella", descrizione: "Pennette, speck, zucchine, mozzarella", immagine: "images/piatti/pennette-speck-zucchine.jpg", prezzi: u(9.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "p7", nome: "Carbonara", descrizione: "", immagine: "images/piatti/carbonara.jpg", prezzi: u(9.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "p8", nome: "Pasta e patate con provola", descrizione: "Pasta, patate, provola", immagine: "images/piatti/pasta-patate-provola.jpg", prezzi: u(9.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "p9", nome: "Spaghetti alle vongole", descrizione: "", immagine: "images/piatti/spaghetti-vongole.jpg", prezzi: u(15.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "p10", nome: "Pomodoro fresco", descrizione: "", immagine: "images/piatti/pomodoro-fresco.jpg", prezzi: u(8.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "p11", nome: "Scarpariello", descrizione: "", immagine: "images/piatti/scarpariello.jpg", prezzi: u(8.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "p12", nome: "Siciliana", descrizione: "", immagine: "images/piatti/siciliana.jpg", prezzi: u(9.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "p13", nome: "Ragù Napoletano", descrizione: "", immagine: "images/piatti/ragu-napoletano.jpg", prezzi: u(10.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "p14", nome: "Arrabbiata", descrizione: "", immagine: "images/piatti/arrabbiata.jpg", prezzi: u(8.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "p15", nome: "Bucatini all'Amatriciana", descrizione: "", immagine: "images/piatti/bucatini-amatriciana.jpg", prezzi: u(9.0), scelte_obbligatorie: [], scelte_multiple: [] },
      ],
    },
    {
      id: "secondi", nome: "Secondi alla Brace", icona: "🍖",
      prodotti: [
        { id: "s1", nome: "Frittura di gamberi e calamari", descrizione: "Gamberi, calamari", immagine: "images/piatti/frittura-gamberi-calamari.jpg", prezzi: u(15.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "s2", nome: "Zuppa di cozze", descrizione: "", immagine: "images/piatti/zuppa-cozze.jpg", prezzi: u(15.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "s3", nome: "Pesce spada alla brace", descrizione: "", immagine: "images/piatti/pesce-spada-brace.jpg", prezzi: u(11.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "s4", nome: "Costoletta di maiale", descrizione: "Alla brace con contorno a scelta", immagine: "images/piatti/costoletta-maiale.jpg", prezzi: u(8.0), scelte_obbligatorie: [{ nome: "Contorno", opzioni: CONTORNI_OPZIONI }], scelte_multiple: [] },
        { id: "s5", nome: "Salsiccia di maiale nero", descrizione: "Alla brace con contorno a scelta", immagine: "images/piatti/salsiccia-maiale-nero.jpg", prezzi: u(7.0), scelte_obbligatorie: [{ nome: "Contorno", opzioni: CONTORNI_OPZIONI }], scelte_multiple: [] },
        { id: "s6", nome: "Tris di pesce alla brace", descrizione: "Gamberi, calamari, pesce spada", immagine: "images/piatti/tris-pesce-brace.jpg", prezzi: u(15.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "s7", nome: "Tris di carne alla brace", descrizione: "Hamburger di Scottona 180gr, salsiccia di maiale nero, costoletta di maiale, contorno a scelta", immagine: "images/piatti/tris-carne-brace.jpg", prezzi: u(15.0), rimozione_ingredienti: true, scelte_obbligatorie: [{ nome: "Contorno", opzioni: CONTORNI_OPZIONI }], scelte_multiple: [] },
        { id: "s8", nome: "Cotoletta e patatine", descrizione: "Cotoletta, patatine", immagine: "images/piatti/cotoletta-patatine.jpg", prezzi: u(7.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
      ],
    },
    {
      id: "speciali", nome: "Il Crocchettone & Il Polpettone", icona: "🥙",
      prodotti: [
        { id: "sp1", nome: "Il Crocchettone", descrizione: "Crocchè gigante ripieno, scegli il gusto", immagine: "images/piatti/il-crocchettone.jpg", prezzi: u(7.0), scelte_obbligatorie: [{ nome: "Gusto", opzioni: ["Salsiccia e Friarielli","Parmigiana e Provola","Prosciutto Cotto e Mozzarella","Mortadella e Crema di Pistacchio","Polpette al Ragù","Bacon e Cheddar"].map((nome) => ({ nome, supplemento: 0 })) }], scelte_multiple: [] },
        { id: "sp2", nome: "Il Polpettone", descrizione: "Polpettone gigante ripieno, scegli il gusto", immagine: "images/piatti/il-polpettone.jpg", prezzi: u(7.0), scelte_obbligatorie: [{ nome: "Gusto", opzioni: ["Porchetta e Funghi","Prosciutto Cotto e Mozzarella","Salsiccia e Friarielli","Parmigiana e Provola","Mortadella e Crema di Pistacchio","Bacon e Cheddar"].map((nome) => ({ nome, supplemento: 0 })) }], scelte_multiple: [] },
      ],
    },
    {
      id: "panino", nome: "Componi il tuo Panino", icona: "🍔",
      prodotti: [
        {
          id: "pan1", nome: "Componi il tuo Panino",
          descrizione: "Scegli la base e personalizza con formaggi, contorni ed extra",
          immagine: "images/piatti/componi-panino.jpg",
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
          scelte_obbligatorie: [],
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
      ],
    },
    {
      id: "vini", nome: "Vini", icona: "🍷",
      prodotti: [
        { id: "v1", nome: "Aglianico Cecere 75cl", descrizione: "", immagine: "images/piatti/vino-aglianico-cecere.jpg", prezzi: u(15.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "v2", nome: "Fiano di Avellino 75cl", descrizione: "", immagine: "images/piatti/vino-fiano-avellino.jpg", prezzi: u(15.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "v3", nome: "Aglianico 35cl", descrizione: "", immagine: "images/piatti/vino-aglianico.jpg", prezzi: u(8.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "v4", nome: "Falanghina 35cl", descrizione: "", immagine: "images/piatti/vino-falanghina.jpg", prezzi: u(8.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "v5", nome: "Granato Calabrese Rosso 75cl", descrizione: "", immagine: "images/piatti/vino-granato-calabrese.jpg", prezzi: u(10.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "v6", nome: "Malvasia Bianco 75cl", descrizione: "", immagine: "images/piatti/vino-malvasia.jpg", prezzi: u(10.0), scelte_obbligatorie: [], scelte_multiple: [] },
      ],
    },
    {
      id: "birre", nome: "Birre", icona: "🍺",
      prodotti: [
        { id: "b1", nome: "Tennent's 9% 33cl", descrizione: "", immagine: "images/piatti/birra-tennents.jpg", prezzi: u(3.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "b2", nome: "Heineken 5% 33cl", descrizione: "", immagine: "images/piatti/birra-heineken.jpg", prezzi: u(3.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "b3", nome: "Zi Mari 5.1% 33cl", descrizione: "", immagine: "images/piatti/birra-zi-mari.jpg", prezzi: u(6.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "b4", nome: "Angie 5.4% 33cl", descrizione: "", immagine: "images/piatti/birra-angie.jpg", prezzi: u(6.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "b5", nome: "Don Luis 8% 33cl", descrizione: "", immagine: "images/piatti/birra-don-luis.jpg", prezzi: u(6.0), scelte_obbligatorie: [], scelte_multiple: [] },
      ],
    },
    {
      id: "bibite", nome: "Bibite", icona: "🥤",
      prodotti: [
        { id: "bi1", nome: "Coca Cola 33cl", descrizione: "", immagine: "images/piatti/coca-cola.jpg", prezzi: u(2.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "bi2", nome: "Coca Cola Zero 33cl", descrizione: "", immagine: "images/piatti/coca-cola-zero.jpg", prezzi: u(2.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "bi3", nome: "Fanta 33cl", descrizione: "", immagine: "images/piatti/fanta.jpg", prezzi: u(2.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "bi4", nome: "Tè alla Pesca 33cl", descrizione: "", immagine: "images/piatti/te-pesca.jpg", prezzi: u(2.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "bi5", nome: "Acqua 50cl", descrizione: "", immagine: "images/piatti/acqua-50cl.jpg", prezzi: u(1.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "bi6", nome: "Acqua 1lt", descrizione: "", immagine: "images/piatti/acqua-1lt.jpg", prezzi: u(2.0), scelte_obbligatorie: [], scelte_multiple: [] },
      ],
    },
  ],
};
