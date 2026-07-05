// Catalogo statico imbottito nel client: usato SOLO se /api/menu non risponde,
// per garantire che l'ordinazione funzioni comunque. Tenerlo allineato a schema.sql.
function u(prezzo) { return [{ variante: "Unica", prezzo }]; }

window.FALLBACK_MENU = {
  categorie: [
    {
      id: "antipasti", nome: "Antipasti e Sfizi", icona: "🍢",
      prodotti: [
        { id: "a1", nome: "Arancino Classico", descrizione: "Riso, pomodoro, prosciutto cotto, piselli", immagine: "images/piatti/arancino-classico.jpg", prezzi: u(2.5), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a2", nome: "Frittatina", descrizione: "Bucatini, besciamella, prosciutto cotto", immagine: "images/piatti/frittatina.jpg", prezzi: u(2.5), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a3", nome: "Frittatina Special", descrizione: "Prodotti di stagione, chiedere al personale", immagine: "images/piatti/frittatina-special.jpg", prezzi: u(3.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a4", nome: "Crocchè", descrizione: "Patate, formaggio grattugiato, provola", immagine: "images/piatti/crocche.jpg", prezzi: u(1.5), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a5", nome: "Crocchè Special", descrizione: "Patate, prezzemolo e mandorle", immagine: "images/piatti/crocche-special.jpg", prezzi: u(2.5), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a6", nome: "Frittelle (10 pz)", descrizione: "", immagine: "images/piatti/frittelle.jpg", prezzi: u(2.5), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a7", nome: "Montanarine", descrizione: "4 gusti a fantasia dello Chef", immagine: "images/piatti/montanarine.jpg", prezzi: u(8.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a8", nome: "Patatine", descrizione: "", immagine: "images/piatti/patatine.jpg", prezzi: u(5.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a9", nome: "Patatine Special", descrizione: "Patatine con fonduta di formaggio e bacon croccante", immagine: "images/piatti/patatine-special.jpg", prezzi: u(7.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a10", nome: "Prosciutto Crudo e Mozzarella di Bufala DOP", descrizione: "Prosciutto crudo, mozzarella di bufala DOP", immagine: "images/piatti/crudo-mozzarella-bufala.jpg", prezzi: u(10.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a11", nome: "Venere Nera (Vegan)", descrizione: "Riso Venere, dadolata di verdure, formaggio a base di anacardi, panko, pesto di pistacchio", immagine: "images/piatti/venere-nera.jpg", prezzi: u(3.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a12", nome: "Magnum di Melanzane (Vegan)", descrizione: "Parmigiana di melanzane con formaggio di anacardi, crema di pomodoro arrosto, panko e mayo all'acquafaba", immagine: "images/piatti/magnum-melanzane.jpg", prezzi: u(5.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "a13", nome: "Tagliere Misto", descrizione: "Tagliere con selezione di salumi e formaggi", immagine: "images/piatti/tagliere-misto.jpg", prezzi: u(15.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
      ],
    },
    {
      id: "pizze-lievito-reale", nome: "Pizze Lievito Reale", icona: "👑",
      prodotti: [
        { id: "plr1", nome: "Ricordi di Calabria", descrizione: "Fior di latte di Agerola, tonno, cipolla di Tropea caramellata, olive nere Caiazzane, pomodorini, peperoni cruschi, basilico, olio EVO", immagine: "images/piatti/ricordi-di-calabria.jpg", prezzi: u(12.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "plr2", nome: "Quattro Pomodori", descrizione: "Crema di pomodoro arrosto, pomodoro giallo, pomodorino del Piennolo, pomodorino Pachino, mozzarella di bufala, scaglie di parmigiano, basilico, olio EVO", immagine: "images/piatti/quattro-pomodori.jpg", prezzi: u(12.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "plr3", nome: "Marinara di Bufala", descrizione: "Provola di bufala, crema di pomodoro arrosto, alici di Cetara, pesto di aglio orsino, olive nere Caiazzane, origano di montagna, basilico, olio EVO", immagine: "images/piatti/marinara-di-bufala.jpg", prezzi: u(12.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "plr4", nome: "Lievito Reale Rivisitata", descrizione: "Fior di latte di Agerola, pancetta, cipolla rossa di Tropea caramellata, crema di formaggio, basilico, olio EVO", immagine: "images/piatti/lievito-reale-rivisitata.jpg", prezzi: u(12.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "plr5", nome: "Quattro Sfumature di Cipolla", descrizione: "Fior di latte, cipolla rossa di Tropea in quattro varianti: fresca, marmellata, caramellata e croccante, basilico, olio EVO", immagine: "images/piatti/quattro-sfumature-cipolla.jpg", prezzi: u(12.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "plr6", nome: "Adriatica", descrizione: "Fior di latte di Agerola, mortadella IGP di Bologna, stracciatella di bufala, crema di pistacchio, olio EVO", immagine: "images/piatti/adriatica.jpg", prezzi: u(12.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "plr7", nome: "La Mia Calabria", descrizione: "Fior di latte di Agerola, 'Nduja di Spilinga, cipolla rossa di Tropea, origano di montagna, olio EVO", immagine: "images/piatti/la-mia-calabria.jpg", prezzi: u(12.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "plr8", nome: "Ricordi d'Infanzia", descrizione: "Scarola, provola, pomodorini rossi, capperi, alici di Cetara, olive Caiazzane, olio EVO", immagine: "images/piatti/ricordi-infanzia.jpg", prezzi: u(12.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "plr9", nome: "Carciofara", descrizione: "Provola affumicata, crema di carciofi, carciofi a spicchi, speck, scaglie di caciocavallo, basilico, olio EVO", immagine: "images/piatti/carciofara.jpg", prezzi: u(12.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "plr10", nome: "Burrata e Capocollo", descrizione: "Fior di latte di Agerola, pomodorini gialli, capocollo, burrata, scaglie di parmigiano, basilico, olio EVO", immagine: "images/piatti/burrata-capocollo.jpg", prezzi: u(12.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "plr11", nome: "La Rapata", descrizione: "Provola affumicata, crema di rapa rossa, pancetta croccante, gorgonzola, scaglie di parmigiano, basilico, olio EVO", immagine: "images/piatti/la-rapata.jpg", prezzi: u(12.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "plr12", nome: "Sotto Bosco", descrizione: "Provola affumicata, crema di porcini, salsiccia nostrana, pesto di aglio orsino, scaglie di parmigiano, basilico, olio EVO", immagine: "images/piatti/sotto-bosco.jpg", prezzi: u(12.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "plr13", nome: "Baccalà", descrizione: "Fior di latte di Agerola, baccalà, capperi, olive nere di Gaeta, pesto di aglio orsino, pomodorini arrosto, basilico, olio EVO", immagine: "images/piatti/baccala.jpg", prezzi: u(12.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
      ],
    },
    {
      id: "pizze-speciali", nome: "Pizze Speciali", icona: "⭐",
      prodotti: [
        { id: "ps1", nome: "Mimosa", descrizione: "Fior di latte, panna fresca, prosciutto cotto, mais, basilico, olio EVO", immagine: "images/piatti/mimosa.jpg", prezzi: u(9.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "ps2", nome: "Rucolina", descrizione: "Fior di latte e pomodorini; all'uscita prosciutto crudo, rucola, parmigiano reggiano DOP, basilico, olio EVO", immagine: "images/piatti/rucolina.jpg", prezzi: u(10.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "ps3", nome: "Cotto e Funghi", descrizione: "Fior di latte, pomodoro San Marzano DOP, prosciutto cotto, funghi freschi, basilico, olio EVO", immagine: "images/piatti/cotto-e-funghi.jpg", prezzi: u(9.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "ps4", nome: "Bufalina", descrizione: "Mozzarella di bufala DOP, pomodoro San Marzano DOP, basilico, olio EVO", immagine: "images/piatti/bufalina.jpg", prezzi: u(9.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "ps5", nome: "Margherita Verace", descrizione: "Mozzarella di bufala DOP, pomodoro del Piennolo Vesuviano, Parmigiano Reggiano DOP, basilico, olio EVO", immagine: "images/piatti/margherita-verace.jpg", prezzi: u(10.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "ps6", nome: "5 Formaggi", descrizione: "Fior di latte, scamorza affumicata, taleggio DOP, gorgonzola DOP, Parmigiano Reggiano DOP, basilico, olio EVO", immagine: "images/piatti/cinque-formaggi.jpg", prezzi: u(10.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "ps7", nome: "Crocchettara", descrizione: "Fior di latte, provola affumicata, crocchè, prosciutto cotto, panna fresca, basilico, olio EVO", immagine: "images/piatti/crocchettara.jpg", prezzi: u(10.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "ps8", nome: "Tropeana", descrizione: "Fior di latte, tonno, cipolla di Tropea, basilico, olio EVO", immagine: "images/piatti/tropeana.jpg", prezzi: u(10.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "ps9", nome: "Aglio e Olio", descrizione: "Fior di latte, fiocchi di pomodoro, aglio rosso di Nubia, tarallo sbriciolato, peperoncino, basilico, olio EVO", immagine: "images/piatti/aglio-e-olio.jpg", prezzi: u(9.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
      ],
    },
    {
      id: "pizze-classiche", nome: "Pizze Classiche", icona: "🍕",
      prodotti: [
        { id: "pc1", nome: "Margherita", descrizione: "Fior di latte, pomodoro San Marzano DOP, basilico, olio EVO", immagine: "images/piatti/margherita.jpg", prezzi: u(6.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "pc2", nome: "Marinara", descrizione: "Pomodoro San Marzano DOP, origano fresco, aglio rosso di Nubia, olio EVO", immagine: "images/piatti/marinara.jpg", prezzi: u(5.5), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "pc3", nome: "Napoletana", descrizione: "Pomodoro San Marzano DOP, pomodorini del Piennolo, alici di Cetara, capperi, olive Caiazzane, aglio rosso di Nubia, olio EVO", immagine: "images/piatti/napoletana.jpg", prezzi: u(8.5), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "pc4", nome: "Diavola", descrizione: "Fior di latte, pomodoro San Marzano DOP, salame piccante, basilico, olio EVO", immagine: "images/piatti/diavola.jpg", prezzi: u(8.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "pc5", nome: "4 Stagioni", descrizione: "Fior di latte, pomodoro San Marzano DOP, prosciutto cotto, salame napoli, carciofini, funghi freschi, basilico, olio EVO", immagine: "images/piatti/quattro-stagioni.jpg", prezzi: u(10.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "pc6", nome: "Siciliana", descrizione: "Fior di latte, pomodoro San Marzano DOP, melanzane a funghetto, parmigiano reggiano DOP, basilico, olio EVO", immagine: "images/piatti/siciliana.jpg", prezzi: u(8.5), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "pc7", nome: "Carrettiera", descrizione: "Fior di latte, friarielli, salsiccia di maiale nostrano, olio EVO", immagine: "images/piatti/carrettiera.jpg", prezzi: u(10.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "pc8", nome: "Cosacca", descrizione: "Pomodoro San Marzano DOP, parmigiano reggiano DOP, basilico, olio EVO", immagine: "images/piatti/cosacca.jpg", prezzi: u(5.5), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "pc9", nome: "Ortolana", descrizione: "Fior di latte, melanzane, peperoni, zucchine, basilico, olio EVO", immagine: "images/piatti/ortolana.jpg", prezzi: u(9.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "pc10", nome: "Uagliù", descrizione: "Fior di latte, würstel, patate fritte, olio EVO", immagine: "images/piatti/uagliu.jpg", prezzi: u(8.5), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
      ],
    },
    {
      id: "ripieni-pizze-fritte", nome: "Ripieni e Pizze Fritte", icona: "🥙",
      prodotti: [
        { id: "rpf1", nome: "Napoletano", descrizione: "Fior di latte, ricotta, salame napoli, parmigiano reggiano DOP, pepe, basilico, olio EVO", immagine: "images/piatti/napoletano-ripieno.jpg", prezzi: u(9.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "rpf2", nome: "Scarola", descrizione: "Fior di latte, scarola, alici di Cetara, olive nere Caiazzane, olio EVO", immagine: "images/piatti/scarola.jpg", prezzi: u(10.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "rpf3", nome: "Cotto e Funghi", descrizione: "Fior di latte, prosciutto cotto, funghi freschi, Parmigiano Reggiano DOP, basilico, olio EVO", immagine: "images/piatti/cotto-funghi-ripieno.jpg", prezzi: u(9.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "rpf4", nome: "Ripieno Special", descrizione: "Fior di latte, melanzane a funghetto, pomodoro giallo; all'uscita prosciutto crudo, pesto di basilico, scaglie di ricotta salata, olio EVO", immagine: "images/piatti/ripieno-special.jpg", prezzi: u(11.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "rpf5", nome: "Cannolo", descrizione: "Fior di latte, funghi porcini, salsiccia di maiale nostrano, basilico, olio EVO", immagine: "images/piatti/cannolo.jpg", prezzi: u(10.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "rpf6", nome: "Calzone Fritto", descrizione: "Provola, pomodoro San Marzano DOP, Parmigiano Reggiano DOP, pepe, basilico, olio EVO", immagine: "images/piatti/calzone-fritto.jpg", prezzi: u(9.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "rpf7", nome: "Fritto Napoli", descrizione: "Fior di latte, ricotta, salame napoli, Parmigiano Reggiano DOP, pepe, basilico, olio EVO", immagine: "images/piatti/fritto-napoli.jpg", prezzi: u(10.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
      ],
    },
    {
      id: "pizze-vegan", nome: "Pizze Vegan", icona: "🌱",
      prodotti: [
        { id: "pv1", nome: "Margherita Vegan", descrizione: "Mozzarella vegana, pomodoro San Marzano DOP, basilico, olio EVO", immagine: "images/piatti/margherita-vegan.jpg", prezzi: u(8.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "pv2", nome: "Marinara ai 4 Pomodori Vegan", descrizione: "Pomodoro San Marzano DOP, pomodorino giallo, pomodorino del Piennolo, pomodoro semidry, origano, aglio, basilico, olio EVO", immagine: "images/piatti/marinara-4-pomodori-vegan.jpg", prezzi: u(12.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "pv3", nome: "Sfumature di Cipolle Vegan", descrizione: "Mozzarella vegana, cipolla rossa di Tropea in quattro varianti: fresca, caramellata, marmellata e croccante, basilico, olio EVO", immagine: "images/piatti/sfumature-cipolle-vegan.jpg", prezzi: u(12.0), rimozione_ingredienti: true, scelte_obbligatorie: [], scelte_multiple: [] },
      ],
    },
    {
      id: "pizze-dessert", nome: "Pizze Dessert", icona: "🍫",
      prodotti: [
        { id: "pd1", nome: "Pizza alla Nutella", descrizione: "", immagine: "images/piatti/pizza-nutella.jpg", prezzi: u(10.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "pd2", nome: "Straccetti alla Nutella", descrizione: "", immagine: "images/piatti/straccetti-nutella.jpg", prezzi: u(9.0), scelte_obbligatorie: [], scelte_multiple: [] },
      ],
    },
    {
      id: "bevande", nome: "Bevande", icona: "🥤",
      prodotti: [
        { id: "bv1", nome: "Acqua 75cl", descrizione: "", immagine: "images/piatti/acqua-75cl.jpg", prezzi: u(2.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "bv2", nome: "Coca Cola 33cl", descrizione: "", immagine: "images/piatti/coca-cola.jpg", prezzi: u(3.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "bv3", nome: "Coca Cola Zero 33cl", descrizione: "", immagine: "images/piatti/coca-cola-zero.jpg", prezzi: u(3.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "bv4", nome: "Fanta 33cl", descrizione: "", immagine: "images/piatti/fanta.jpg", prezzi: u(3.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "bv5", nome: "Amari e Digestivi", descrizione: "", immagine: "images/piatti/amari-digestivi.jpg", prezzi: u(2.5), scelte_obbligatorie: [], scelte_multiple: [] },
      ],
    },
    {
      id: "birre", nome: "Birre", icona: "🍺",
      prodotti: [
        { id: "br1", nome: "Ceres 33cl", descrizione: "", immagine: "images/piatti/birra-ceres.jpg", prezzi: u(4.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "br2", nome: "Tennent's 33cl", descrizione: "", immagine: "images/piatti/birra-tennents.jpg", prezzi: u(4.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "br3", nome: "Nastro Azzurro 33cl", descrizione: "", immagine: "images/piatti/birra-nastro-azzurro.jpg", prezzi: u(2.5), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "br4", nome: "Ichnusa 33cl", descrizione: "", immagine: "images/piatti/birra-ichnusa.jpg", prezzi: u(3.5), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "br5", nome: "Leffe Rossa 33cl", descrizione: "", immagine: "images/piatti/birra-leffe-rossa.jpg", prezzi: u(4.5), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "br6", nome: "Poretti Chiara 20cl (spillata)", descrizione: "", immagine: "images/piatti/poretti-chiara-20cl.jpg", prezzi: u(3.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "br7", nome: "Poretti Chiara 40cl (spillata)", descrizione: "", immagine: "images/piatti/poretti-chiara-40cl.jpg", prezzi: u(5.0), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "br8", nome: "Poretti Rossa 20cl (spillata)", descrizione: "", immagine: "images/piatti/poretti-rossa-20cl.jpg", prezzi: u(3.5), scelte_obbligatorie: [], scelte_multiple: [] },
        { id: "br9", nome: "Poretti Rossa 40cl (spillata)", descrizione: "", immagine: "images/piatti/poretti-rossa-40cl.jpg", prezzi: u(7.0), scelte_obbligatorie: [], scelte_multiple: [] },
      ],
    },
  ],
};
