// Riferimento "stato sano" usato dallo strumento di auto-diagnosi/ripristino
// (functions/admin/diagnosi.js). Deve rispecchiare il seed di schema.sql:
// se cambi il menu in schema.sql, aggiorna anche qui (nessuna build step nel
// progetto, quindi la sincronizzazione fra i due file è manuale e deliberata).

export const SEED_CATEGORIE = [
  { id: "antipasti", nome: "Antipasti e Sfizi", icona: "🍢", ordine: 1 },
  { id: "pizze-lievito-reale", nome: "Pizze Lievito Reale", icona: "👑", ordine: 2 },
  { id: "pizze-speciali", nome: "Pizze Speciali", icona: "⭐", ordine: 3 },
  { id: "pizze-classiche", nome: "Pizze Classiche", icona: "🍕", ordine: 4 },
  { id: "ripieni-pizze-fritte", nome: "Ripieni e Pizze Fritte", icona: "🥙", ordine: 5 },
  { id: "pizze-vegan", nome: "Pizze Vegan", icona: "🌱", ordine: 6 },
  { id: "pizze-dessert", nome: "Pizze Dessert", icona: "🍫", ordine: 7 },
  { id: "bevande", nome: "Bevande", icona: "🥤", ordine: 8 },
  { id: "birre", nome: "Birre", icona: "🍺", ordine: 9 },
];

export const SEED_PRODOTTI = [
  // ANTIPASTI E SFIZI
  { categoria_id: "antipasti", nome: "Arancino Classico", descrizione: "Riso, pomodoro, prosciutto cotto, piselli", prezzi: [{ variante: "Unica", prezzo: 2.5 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Frittatina", descrizione: "Bucatini, besciamella, prosciutto cotto", prezzi: [{ variante: "Unica", prezzo: 2.5 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Frittatina Special", descrizione: "Prodotti di stagione, chiedere al personale", prezzi: [{ variante: "Unica", prezzo: 3.0 }] },
  { categoria_id: "antipasti", nome: "Crocchè", descrizione: "Patate, formaggio grattugiato, provola", prezzi: [{ variante: "Unica", prezzo: 1.5 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Crocchè Special", descrizione: "Patate, prezzemolo e mandorle", prezzi: [{ variante: "Unica", prezzo: 2.5 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Frittelle (10 pz)", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 2.5 }] },
  { categoria_id: "antipasti", nome: "Montanarine", descrizione: "4 gusti a fantasia dello Chef", prezzi: [{ variante: "Unica", prezzo: 8.0 }] },
  { categoria_id: "antipasti", nome: "Patatine", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 5.0 }] },
  { categoria_id: "antipasti", nome: "Patatine Special", descrizione: "Patatine con fonduta di formaggio e bacon croccante", prezzi: [{ variante: "Unica", prezzo: 7.0 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Prosciutto Crudo e Mozzarella di Bufala DOP", descrizione: "Prosciutto crudo, mozzarella di bufala DOP", prezzi: [{ variante: "Unica", prezzo: 10.0 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Venere Nera (Vegan)", descrizione: "Riso Venere, dadolata di verdure, formaggio a base di anacardi, panko, pesto di pistacchio", prezzi: [{ variante: "Unica", prezzo: 3.0 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Magnum di Melanzane (Vegan)", descrizione: "Parmigiana di melanzane con formaggio di anacardi, crema di pomodoro arrosto, panko e mayo all'acquafaba", prezzi: [{ variante: "Unica", prezzo: 5.0 }], rimozione_ingredienti: true },
  { categoria_id: "antipasti", nome: "Tagliere Misto", descrizione: "Tagliere con selezione di salumi e formaggi", prezzi: [{ variante: "Unica", prezzo: 15.0 }], rimozione_ingredienti: true },

  // PIZZE LIEVITO REALE
  { categoria_id: "pizze-lievito-reale", nome: "Ricordi di Calabria", descrizione: "Fior di latte di Agerola, tonno, cipolla di Tropea caramellata, olive nere Caiazzane, pomodorini, peperoni cruschi, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 12.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-lievito-reale", nome: "Quattro Pomodori", descrizione: "Crema di pomodoro arrosto, pomodoro giallo, pomodorino del Piennolo, pomodorino Pachino, mozzarella di bufala, scaglie di parmigiano, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 12.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-lievito-reale", nome: "Marinara di Bufala", descrizione: "Provola di bufala, crema di pomodoro arrosto, alici di Cetara, pesto di aglio orsino, olive nere Caiazzane, origano di montagna, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 12.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-lievito-reale", nome: "Lievito Reale Rivisitata", descrizione: "Fior di latte di Agerola, pancetta, cipolla rossa di Tropea caramellata, crema di formaggio, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 12.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-lievito-reale", nome: "Quattro Sfumature di Cipolla", descrizione: "Fior di latte, cipolla rossa di Tropea in quattro varianti: fresca, marmellata, caramellata e croccante, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 12.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-lievito-reale", nome: "Adriatica", descrizione: "Fior di latte di Agerola, mortadella IGP di Bologna, stracciatella di bufala, crema di pistacchio, olio EVO", prezzi: [{ variante: "Unica", prezzo: 12.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-lievito-reale", nome: "La Mia Calabria", descrizione: "Fior di latte di Agerola, 'Nduja di Spilinga, cipolla rossa di Tropea, origano di montagna, olio EVO", prezzi: [{ variante: "Unica", prezzo: 12.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-lievito-reale", nome: "Ricordi d'Infanzia", descrizione: "Scarola, provola, pomodorini rossi, capperi, alici di Cetara, olive Caiazzane, olio EVO", prezzi: [{ variante: "Unica", prezzo: 12.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-lievito-reale", nome: "Carciofara", descrizione: "Provola affumicata, crema di carciofi, carciofi a spicchi, speck, scaglie di caciocavallo, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 12.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-lievito-reale", nome: "Burrata e Capocollo", descrizione: "Fior di latte di Agerola, pomodorini gialli, capocollo, burrata, scaglie di parmigiano, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 12.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-lievito-reale", nome: "La Rapata", descrizione: "Provola affumicata, crema di rapa rossa, pancetta croccante, gorgonzola, scaglie di parmigiano, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 12.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-lievito-reale", nome: "Sotto Bosco", descrizione: "Provola affumicata, crema di porcini, salsiccia nostrana, pesto di aglio orsino, scaglie di parmigiano, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 12.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-lievito-reale", nome: "Baccalà", descrizione: "Fior di latte di Agerola, baccalà, capperi, olive nere di Gaeta, pesto di aglio orsino, pomodorini arrosto, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 12.0 }], rimozione_ingredienti: true },

  // PIZZE SPECIALI
  { categoria_id: "pizze-speciali", nome: "Mimosa", descrizione: "Fior di latte, panna fresca, prosciutto cotto, mais, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 9.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-speciali", nome: "Rucolina", descrizione: "Fior di latte e pomodorini; all'uscita prosciutto crudo, rucola, parmigiano reggiano DOP, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 10.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-speciali", nome: "Cotto e Funghi", descrizione: "Fior di latte, pomodoro San Marzano DOP, prosciutto cotto, funghi freschi, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 9.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-speciali", nome: "Bufalina", descrizione: "Mozzarella di bufala DOP, pomodoro San Marzano DOP, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 9.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-speciali", nome: "Margherita Verace", descrizione: "Mozzarella di bufala DOP, pomodoro del Piennolo Vesuviano, Parmigiano Reggiano DOP, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 10.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-speciali", nome: "5 Formaggi", descrizione: "Fior di latte, scamorza affumicata, taleggio DOP, gorgonzola DOP, Parmigiano Reggiano DOP, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 10.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-speciali", nome: "Crocchettara", descrizione: "Fior di latte, provola affumicata, crocchè, prosciutto cotto, panna fresca, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 10.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-speciali", nome: "Tropeana", descrizione: "Fior di latte, tonno, cipolla di Tropea, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 10.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-speciali", nome: "Aglio e Olio", descrizione: "Fior di latte, fiocchi di pomodoro, aglio rosso di Nubia, tarallo sbriciolato, peperoncino, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 9.0 }], rimozione_ingredienti: true },

  // PIZZE CLASSICHE
  { categoria_id: "pizze-classiche", nome: "Margherita", descrizione: "Fior di latte, pomodoro San Marzano DOP, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 6.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-classiche", nome: "Marinara", descrizione: "Pomodoro San Marzano DOP, origano fresco, aglio rosso di Nubia, olio EVO", prezzi: [{ variante: "Unica", prezzo: 5.5 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-classiche", nome: "Napoletana", descrizione: "Pomodoro San Marzano DOP, pomodorini del Piennolo, alici di Cetara, capperi, olive Caiazzane, aglio rosso di Nubia, olio EVO", prezzi: [{ variante: "Unica", prezzo: 8.5 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-classiche", nome: "Diavola", descrizione: "Fior di latte, pomodoro San Marzano DOP, salame piccante, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 8.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-classiche", nome: "4 Stagioni", descrizione: "Fior di latte, pomodoro San Marzano DOP, prosciutto cotto, salame napoli, carciofini, funghi freschi, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 10.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-classiche", nome: "Siciliana", descrizione: "Fior di latte, pomodoro San Marzano DOP, melanzane a funghetto, parmigiano reggiano DOP, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 8.5 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-classiche", nome: "Carrettiera", descrizione: "Fior di latte, friarielli, salsiccia di maiale nostrano, olio EVO", prezzi: [{ variante: "Unica", prezzo: 10.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-classiche", nome: "Cosacca", descrizione: "Pomodoro San Marzano DOP, parmigiano reggiano DOP, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 5.5 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-classiche", nome: "Ortolana", descrizione: "Fior di latte, melanzane, peperoni, zucchine, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 9.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-classiche", nome: "Uagliù", descrizione: "Fior di latte, würstel, patate fritte, olio EVO", prezzi: [{ variante: "Unica", prezzo: 8.5 }], rimozione_ingredienti: true },

  // RIPIENI E PIZZE FRITTE
  { categoria_id: "ripieni-pizze-fritte", nome: "Napoletano", descrizione: "Fior di latte, ricotta, salame napoli, parmigiano reggiano DOP, pepe, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 9.0 }], rimozione_ingredienti: true },
  { categoria_id: "ripieni-pizze-fritte", nome: "Scarola", descrizione: "Fior di latte, scarola, alici di Cetara, olive nere Caiazzane, olio EVO", prezzi: [{ variante: "Unica", prezzo: 10.0 }], rimozione_ingredienti: true },
  { categoria_id: "ripieni-pizze-fritte", nome: "Cotto e Funghi", descrizione: "Fior di latte, prosciutto cotto, funghi freschi, Parmigiano Reggiano DOP, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 9.0 }], rimozione_ingredienti: true },
  { categoria_id: "ripieni-pizze-fritte", nome: "Ripieno Special", descrizione: "Fior di latte, melanzane a funghetto, pomodoro giallo; all'uscita prosciutto crudo, pesto di basilico, scaglie di ricotta salata, olio EVO", prezzi: [{ variante: "Unica", prezzo: 11.0 }], rimozione_ingredienti: true },
  { categoria_id: "ripieni-pizze-fritte", nome: "Cannolo", descrizione: "Fior di latte, funghi porcini, salsiccia di maiale nostrano, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 10.0 }], rimozione_ingredienti: true },
  { categoria_id: "ripieni-pizze-fritte", nome: "Calzone Fritto", descrizione: "Provola, pomodoro San Marzano DOP, Parmigiano Reggiano DOP, pepe, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 9.0 }], rimozione_ingredienti: true },
  { categoria_id: "ripieni-pizze-fritte", nome: "Fritto Napoli", descrizione: "Fior di latte, ricotta, salame napoli, Parmigiano Reggiano DOP, pepe, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 10.0 }], rimozione_ingredienti: true },

  // PIZZE VEGAN
  { categoria_id: "pizze-vegan", nome: "Margherita Vegan", descrizione: "Mozzarella vegana, pomodoro San Marzano DOP, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 8.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-vegan", nome: "Marinara ai 4 Pomodori Vegan", descrizione: "Pomodoro San Marzano DOP, pomodorino giallo, pomodorino del Piennolo, pomodoro semidry, origano, aglio, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 12.0 }], rimozione_ingredienti: true },
  { categoria_id: "pizze-vegan", nome: "Sfumature di Cipolle Vegan", descrizione: "Mozzarella vegana, cipolla rossa di Tropea in quattro varianti: fresca, caramellata, marmellata e croccante, basilico, olio EVO", prezzi: [{ variante: "Unica", prezzo: 12.0 }], rimozione_ingredienti: true },

  // PIZZE DESSERT
  { categoria_id: "pizze-dessert", nome: "Pizza alla Nutella", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 10.0 }] },
  { categoria_id: "pizze-dessert", nome: "Straccetti alla Nutella", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 9.0 }] },

  // BEVANDE
  { categoria_id: "bevande", nome: "Acqua 75cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 2.0 }] },
  { categoria_id: "bevande", nome: "Coca Cola 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 3.0 }] },
  { categoria_id: "bevande", nome: "Coca Cola Zero 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 3.0 }] },
  { categoria_id: "bevande", nome: "Fanta 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 3.0 }] },
  { categoria_id: "bevande", nome: "Amari e Digestivi", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 2.5 }] },

  // BIRRE
  { categoria_id: "birre", nome: "Ceres 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 4.0 }] },
  { categoria_id: "birre", nome: "Tennent's 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 4.0 }] },
  { categoria_id: "birre", nome: "Nastro Azzurro 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 2.5 }] },
  { categoria_id: "birre", nome: "Ichnusa 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 3.5 }] },
  { categoria_id: "birre", nome: "Leffe Rossa 33cl", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 4.5 }] },
  { categoria_id: "birre", nome: "Poretti Chiara 20cl (spillata)", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 3.0 }] },
  { categoria_id: "birre", nome: "Poretti Chiara 40cl (spillata)", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 5.0 }] },
  { categoria_id: "birre", nome: "Poretti Rossa 20cl (spillata)", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 3.5 }] },
  { categoria_id: "birre", nome: "Poretti Rossa 40cl (spillata)", descrizione: "", prezzi: [{ variante: "Unica", prezzo: 7.0 }] },
].map((p) => ({
  scelte_obbligatorie: [],
  scelte_multiple: [],
  rimozione_ingredienti: false,
  ...p,
}));
