-- ============================================================================
-- Pizzeria Lievito Reale — schema.sql
-- Stato "sano" di riferimento: schema tabelle + seed iniziale.
-- Usato anche dallo strumento di auto-diagnosi/ripristino in admin.
-- ============================================================================

DROP TABLE IF EXISTS magazzino_ordini_items;
DROP TABLE IF EXISTS magazzino_ordini;
DROP TABLE IF EXISTS magazzino_materie_prime;
DROP TABLE IF EXISTS magazzino_fornitori;
DROP TABLE IF EXISTS promo;
DROP TABLE IF EXISTS ordini;
DROP TABLE IF EXISTS clienti;
DROP TABLE IF EXISTS prodotti;
DROP TABLE IF EXISTS categorie;
DROP TABLE IF EXISTS impostazioni;

-- ----------------------------------------------------------------------------
-- CATEGORIE (id testuale — MAI parseInt() lato frontend)
-- ----------------------------------------------------------------------------
CREATE TABLE categorie (
  id        TEXT PRIMARY KEY,
  nome      TEXT NOT NULL,
  icona     TEXT NOT NULL DEFAULT '🍽️',
  ordine    INTEGER NOT NULL DEFAULT 0,
  attiva    INTEGER NOT NULL DEFAULT 1
);

-- ----------------------------------------------------------------------------
-- PRODOTTI
-- prezzi:               JSON [{ "variante": "...", "prezzo": 9.0 }, ...]
--                        se len>1 diventa gruppo radio obbligatorio "formato"
-- scelte_obbligatorie:   JSON [{ "nome":"Gusto", "opzioni":[{"nome":"...","supplemento":0}] }]
-- scelte_multiple:       JSON [{ "nome":"Extra", "min":0, "max":null,
--                                 "opzioni":[{"nome":"...","supplemento":1.0}] }]
-- rimozione_ingredienti: 1 = genera checkbox "rimuovi" dalla descrizione (sempre gratis/opzionale)
-- ----------------------------------------------------------------------------
CREATE TABLE prodotti (
  id                      INTEGER PRIMARY KEY AUTOINCREMENT,
  categoria_id            TEXT NOT NULL REFERENCES categorie(id),
  nome                    TEXT NOT NULL,
  descrizione             TEXT NOT NULL DEFAULT '',
  immagine                TEXT NOT NULL DEFAULT '',
  prezzi                  TEXT NOT NULL DEFAULT '[]',
  scelte_obbligatorie     TEXT NOT NULL DEFAULT '[]',
  scelte_multiple         TEXT NOT NULL DEFAULT '[]',
  rimozione_ingredienti   INTEGER NOT NULL DEFAULT 0,
  ordine                  INTEGER NOT NULL DEFAULT 0,
  attivo                  INTEGER NOT NULL DEFAULT 1
);

-- ----------------------------------------------------------------------------
-- CLIENTI
-- ----------------------------------------------------------------------------
CREATE TABLE clienti (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nome        TEXT NOT NULL,
  telefono    TEXT NOT NULL UNIQUE,
  indirizzo   TEXT NOT NULL DEFAULT '',
  note        TEXT NOT NULL DEFAULT '',
  creato_il   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ----------------------------------------------------------------------------
-- ORDINI
-- items: JSON array del carrello con nome prodotto/varianti/scelte/prezzo riga
-- ----------------------------------------------------------------------------
CREATE TABLE ordini (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_nome    TEXT NOT NULL DEFAULT '',
  cliente_telefono TEXT NOT NULL DEFAULT '',
  cliente_indirizzo TEXT NOT NULL DEFAULT '',
  tipo            TEXT NOT NULL DEFAULT 'asporto',   -- asporto | domicilio
  stato           TEXT NOT NULL DEFAULT 'nuovo',     -- nuovo | in_preparazione | pronto | consegnato | annullato
  items           TEXT NOT NULL DEFAULT '[]',
  totale          REAL NOT NULL DEFAULT 0,
  promo_codice    TEXT NOT NULL DEFAULT '',
  sconto          REAL NOT NULL DEFAULT 0,
  note            TEXT NOT NULL DEFAULT '',
  canale          TEXT NOT NULL DEFAULT 'web',       -- web | whatsapp | admin
  creato_il       TEXT NOT NULL DEFAULT (datetime('now')),
  aggiornato_il   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ----------------------------------------------------------------------------
-- PROMO
-- ----------------------------------------------------------------------------
CREATE TABLE promo (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  codice      TEXT NOT NULL UNIQUE,
  tipo        TEXT NOT NULL DEFAULT 'percentuale',  -- percentuale | fisso
  valore      REAL NOT NULL DEFAULT 0,
  min_ordine  REAL NOT NULL DEFAULT 0,
  attivo      INTEGER NOT NULL DEFAULT 1,
  scadenza    TEXT NOT NULL DEFAULT ''
);

-- ----------------------------------------------------------------------------
-- IMPOSTAZIONI (key-value)
-- ----------------------------------------------------------------------------
CREATE TABLE impostazioni (
  chiave  TEXT PRIMARY KEY,
  valore  TEXT NOT NULL DEFAULT ''
);

-- ----------------------------------------------------------------------------
-- MAGAZZINO (modulo opzionale)
-- ----------------------------------------------------------------------------
CREATE TABLE magazzino_fornitori (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nome      TEXT NOT NULL,
  whatsapp  TEXT NOT NULL DEFAULT '',
  reparto   TEXT NOT NULL,
  attivo    INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE magazzino_materie_prime (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  nome                TEXT NOT NULL,
  reparto             TEXT NOT NULL,
  unita_misura        TEXT NOT NULL DEFAULT 'pz',
  prezzo_riferimento  REAL NOT NULL DEFAULT 0,
  attivo              INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE magazzino_ordini (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  creato_da     TEXT NOT NULL DEFAULT '',
  stato         TEXT NOT NULL DEFAULT 'nuovo',   -- nuovo | inviato | completato
  note          TEXT NOT NULL DEFAULT '',
  creato_il     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE magazzino_ordini_items (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  ordine_id             INTEGER NOT NULL REFERENCES magazzino_ordini(id),
  materia_prima_id      INTEGER NOT NULL REFERENCES magazzino_materie_prime(id),
  quantita              REAL NOT NULL DEFAULT 1,
  note                  TEXT NOT NULL DEFAULT ''
);

-- ============================================================================
-- SEED — IMPOSTAZIONI
-- ============================================================================
INSERT INTO impostazioni (chiave, valore) VALUES
  ('nome_locale', 'Pizzeria Lievito Reale'),
  ('citta', 'Casagiove (CE)'),
  ('indirizzo', 'Via Nazionale Appia, 5A, 81022 Casagiove (CE)'),
  ('maps_link', 'https://www.google.com/maps/search/?api=1&query=Via+Nazionale+Appia+5A+81022+Casagiove+CE'),
  ('whatsapp_ordini', '393791291539'),
  ('instagram', 'https://www.instagram.com/lievitoreale'),
  ('facebook', ''),
  ('banner_testo', '👑 Sconto 10% sul primo ordine online! Scrivi ''BENVENUTO'' nella nota dell''ordine su WhatsApp'),
  ('orario_lun', 'Da confermare'),
  ('orario_mar', 'Da confermare'),
  ('orario_mer', 'Da confermare'),
  ('orario_gio', 'Da confermare'),
  ('orario_ven', 'Da confermare'),
  ('orario_sab', 'Da confermare'),
  ('orario_dom', 'Da confermare'),
  ('coperto', '2.00'),
  ('magazzino_attivo', '1'),
  ('admin_password_avviso', 'changeme123');

-- ============================================================================
-- SEED — CATEGORIE
-- ============================================================================
INSERT INTO categorie (id, nome, icona, ordine, attiva) VALUES
  ('antipasti',            'Antipasti e Sfizi',       '🍢', 1, 1),
  ('pizze-lievito-reale',  'Pizze Lievito Reale',     '👑', 2, 1),
  ('pizze-speciali',       'Pizze Speciali',          '⭐', 3, 1),
  ('pizze-classiche',      'Pizze Classiche',         '🍕', 4, 1),
  ('ripieni-pizze-fritte', 'Ripieni e Pizze Fritte',  '🥙', 5, 1),
  ('pizze-vegan',          'Pizze Vegan',             '🌱', 6, 1),
  ('pizze-dessert',        'Pizze Dessert',           '🍫', 7, 1),
  ('bevande',              'Bevande',                 '🥤', 8, 1),
  ('birre',                'Birre',                   '🍺', 9, 1);

-- ============================================================================
-- SEED — PRODOTTI: ANTIPASTI E SFIZI
-- ============================================================================
INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, rimozione_ingredienti, ordine) VALUES
('antipasti','Arancino Classico','Riso, pomodoro, prosciutto cotto, piselli','images/piatti/arancino-classico.jpg','[{"variante":"Unica","prezzo":2.5}]',1,1),
('antipasti','Frittatina','Bucatini, besciamella, prosciutto cotto','images/piatti/frittatina.jpg','[{"variante":"Unica","prezzo":2.5}]',1,2),
('antipasti','Frittatina Special','Prodotti di stagione, chiedere al personale','images/piatti/frittatina-special.jpg','[{"variante":"Unica","prezzo":3.0}]',0,3),
('antipasti','Crocchè','Patate, formaggio grattugiato, provola','images/piatti/crocche.jpg','[{"variante":"Unica","prezzo":1.5}]',1,4),
('antipasti','Crocchè Special','Patate, prezzemolo e mandorle','images/piatti/crocche-special.jpg','[{"variante":"Unica","prezzo":2.5}]',1,5),
('antipasti','Frittelle (10 pz)','','images/piatti/frittelle.jpg','[{"variante":"Unica","prezzo":2.5}]',0,6),
('antipasti','Montanarine','4 gusti a fantasia dello Chef','images/piatti/montanarine.jpg','[{"variante":"Unica","prezzo":8.0}]',0,7),
('antipasti','Patatine','','images/piatti/patatine.jpg','[{"variante":"Unica","prezzo":5.0}]',0,8),
('antipasti','Patatine Special','Patatine con fonduta di formaggio e bacon croccante','images/piatti/patatine-special.jpg','[{"variante":"Unica","prezzo":7.0}]',1,9),
('antipasti','Prosciutto Crudo e Mozzarella di Bufala DOP','Prosciutto crudo, mozzarella di bufala DOP','images/piatti/crudo-mozzarella-bufala.jpg','[{"variante":"Unica","prezzo":10.0}]',1,10),
('antipasti','Venere Nera (Vegan)','Riso Venere, dadolata di verdure, formaggio a base di anacardi, panko, pesto di pistacchio','images/piatti/venere-nera.jpg','[{"variante":"Unica","prezzo":3.0}]',1,11),
('antipasti','Magnum di Melanzane (Vegan)','Parmigiana di melanzane con formaggio di anacardi, crema di pomodoro arrosto, panko e mayo all''acquafaba','images/piatti/magnum-melanzane.jpg','[{"variante":"Unica","prezzo":5.0}]',1,12),
('antipasti','Tagliere Misto','Tagliere con selezione di salumi e formaggi','images/piatti/tagliere-misto.jpg','[{"variante":"Unica","prezzo":15.0}]',1,13);

-- ============================================================================
-- SEED — PRODOTTI: PIZZE LIEVITO REALE
-- ============================================================================
INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, rimozione_ingredienti, ordine) VALUES
('pizze-lievito-reale','Ricordi di Calabria','Fior di latte di Agerola, tonno, cipolla di Tropea caramellata, olive nere Caiazzane, pomodorini, peperoni cruschi, basilico, olio EVO','images/piatti/ricordi-di-calabria.jpg','[{"variante":"Unica","prezzo":12.0}]',1,1),
('pizze-lievito-reale','Quattro Pomodori','Crema di pomodoro arrosto, pomodoro giallo, pomodorino del Piennolo, pomodorino Pachino, mozzarella di bufala, scaglie di parmigiano, basilico, olio EVO','images/piatti/quattro-pomodori.jpg','[{"variante":"Unica","prezzo":12.0}]',1,2),
('pizze-lievito-reale','Marinara di Bufala','Provola di bufala, crema di pomodoro arrosto, alici di Cetara, pesto di aglio orsino, olive nere Caiazzane, origano di montagna, basilico, olio EVO','images/piatti/marinara-di-bufala.jpg','[{"variante":"Unica","prezzo":12.0}]',1,3),
('pizze-lievito-reale','Lievito Reale Rivisitata','Fior di latte di Agerola, pancetta, cipolla rossa di Tropea caramellata, crema di formaggio, basilico, olio EVO','images/piatti/lievito-reale-rivisitata.jpg','[{"variante":"Unica","prezzo":12.0}]',1,4),
('pizze-lievito-reale','Quattro Sfumature di Cipolla','Fior di latte, cipolla rossa di Tropea in quattro varianti: fresca, marmellata, caramellata e croccante, basilico, olio EVO','images/piatti/quattro-sfumature-cipolla.jpg','[{"variante":"Unica","prezzo":12.0}]',1,5),
('pizze-lievito-reale','Adriatica','Fior di latte di Agerola, mortadella IGP di Bologna, stracciatella di bufala, crema di pistacchio, olio EVO','images/piatti/adriatica.jpg','[{"variante":"Unica","prezzo":12.0}]',1,6),
('pizze-lievito-reale','La Mia Calabria','Fior di latte di Agerola, ''Nduja di Spilinga, cipolla rossa di Tropea, origano di montagna, olio EVO','images/piatti/la-mia-calabria.jpg','[{"variante":"Unica","prezzo":12.0}]',1,7),
('pizze-lievito-reale','Ricordi d''Infanzia','Scarola, provola, pomodorini rossi, capperi, alici di Cetara, olive Caiazzane, olio EVO','images/piatti/ricordi-infanzia.jpg','[{"variante":"Unica","prezzo":12.0}]',1,8),
('pizze-lievito-reale','Carciofara','Provola affumicata, crema di carciofi, carciofi a spicchi, speck, scaglie di caciocavallo, basilico, olio EVO','images/piatti/carciofara.jpg','[{"variante":"Unica","prezzo":12.0}]',1,9),
('pizze-lievito-reale','Burrata e Capocollo','Fior di latte di Agerola, pomodorini gialli, capocollo, burrata, scaglie di parmigiano, basilico, olio EVO','images/piatti/burrata-capocollo.jpg','[{"variante":"Unica","prezzo":12.0}]',1,10),
('pizze-lievito-reale','La Rapata','Provola affumicata, crema di rapa rossa, pancetta croccante, gorgonzola, scaglie di parmigiano, basilico, olio EVO','images/piatti/la-rapata.jpg','[{"variante":"Unica","prezzo":12.0}]',1,11),
('pizze-lievito-reale','Sotto Bosco','Provola affumicata, crema di porcini, salsiccia nostrana, pesto di aglio orsino, scaglie di parmigiano, basilico, olio EVO','images/piatti/sotto-bosco.jpg','[{"variante":"Unica","prezzo":12.0}]',1,12),
('pizze-lievito-reale','Baccalà','Fior di latte di Agerola, baccalà, capperi, olive nere di Gaeta, pesto di aglio orsino, pomodorini arrosto, basilico, olio EVO','images/piatti/baccala.jpg','[{"variante":"Unica","prezzo":12.0}]',1,13);

-- ============================================================================
-- SEED — PRODOTTI: PIZZE SPECIALI
-- ============================================================================
INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, rimozione_ingredienti, ordine) VALUES
('pizze-speciali','Mimosa','Fior di latte, panna fresca, prosciutto cotto, mais, basilico, olio EVO','images/piatti/mimosa.jpg','[{"variante":"Unica","prezzo":9.0}]',1,1),
('pizze-speciali','Rucolina','Fior di latte e pomodorini; all''uscita prosciutto crudo, rucola, parmigiano reggiano DOP, basilico, olio EVO','images/piatti/rucolina.jpg','[{"variante":"Unica","prezzo":10.0}]',1,2),
('pizze-speciali','Cotto e Funghi','Fior di latte, pomodoro San Marzano DOP, prosciutto cotto, funghi freschi, basilico, olio EVO','images/piatti/cotto-e-funghi.jpg','[{"variante":"Unica","prezzo":9.0}]',1,3),
('pizze-speciali','Bufalina','Mozzarella di bufala DOP, pomodoro San Marzano DOP, basilico, olio EVO','images/piatti/bufalina.jpg','[{"variante":"Unica","prezzo":9.0}]',1,4),
('pizze-speciali','Margherita Verace','Mozzarella di bufala DOP, pomodoro del Piennolo Vesuviano, Parmigiano Reggiano DOP, basilico, olio EVO','images/piatti/margherita-verace.jpg','[{"variante":"Unica","prezzo":10.0}]',1,5),
('pizze-speciali','5 Formaggi','Fior di latte, scamorza affumicata, taleggio DOP, gorgonzola DOP, Parmigiano Reggiano DOP, basilico, olio EVO','images/piatti/cinque-formaggi.jpg','[{"variante":"Unica","prezzo":10.0}]',1,6),
('pizze-speciali','Crocchettara','Fior di latte, provola affumicata, crocchè, prosciutto cotto, panna fresca, basilico, olio EVO','images/piatti/crocchettara.jpg','[{"variante":"Unica","prezzo":10.0}]',1,7),
('pizze-speciali','Tropeana','Fior di latte, tonno, cipolla di Tropea, basilico, olio EVO','images/piatti/tropeana.jpg','[{"variante":"Unica","prezzo":10.0}]',1,8),
('pizze-speciali','Aglio e Olio','Fior di latte, fiocchi di pomodoro, aglio rosso di Nubia, tarallo sbriciolato, peperoncino, basilico, olio EVO','images/piatti/aglio-e-olio.jpg','[{"variante":"Unica","prezzo":9.0}]',1,9);

-- ============================================================================
-- SEED — PRODOTTI: PIZZE CLASSICHE
-- ============================================================================
INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, rimozione_ingredienti, ordine) VALUES
('pizze-classiche','Margherita','Fior di latte, pomodoro San Marzano DOP, basilico, olio EVO','images/piatti/margherita.jpg','[{"variante":"Unica","prezzo":6.0}]',1,1),
('pizze-classiche','Marinara','Pomodoro San Marzano DOP, origano fresco, aglio rosso di Nubia, olio EVO','images/piatti/marinara.jpg','[{"variante":"Unica","prezzo":5.5}]',1,2),
('pizze-classiche','Napoletana','Pomodoro San Marzano DOP, pomodorini del Piennolo, alici di Cetara, capperi, olive Caiazzane, aglio rosso di Nubia, olio EVO','images/piatti/napoletana.jpg','[{"variante":"Unica","prezzo":8.5}]',1,3),
('pizze-classiche','Diavola','Fior di latte, pomodoro San Marzano DOP, salame piccante, basilico, olio EVO','images/piatti/diavola.jpg','[{"variante":"Unica","prezzo":8.0}]',1,4),
('pizze-classiche','4 Stagioni','Fior di latte, pomodoro San Marzano DOP, prosciutto cotto, salame napoli, carciofini, funghi freschi, basilico, olio EVO','images/piatti/quattro-stagioni.jpg','[{"variante":"Unica","prezzo":10.0}]',1,5),
('pizze-classiche','Siciliana','Fior di latte, pomodoro San Marzano DOP, melanzane a funghetto, parmigiano reggiano DOP, basilico, olio EVO','images/piatti/siciliana.jpg','[{"variante":"Unica","prezzo":8.5}]',1,6),
('pizze-classiche','Carrettiera','Fior di latte, friarielli, salsiccia di maiale nostrano, olio EVO','images/piatti/carrettiera.jpg','[{"variante":"Unica","prezzo":10.0}]',1,7),
('pizze-classiche','Cosacca','Pomodoro San Marzano DOP, parmigiano reggiano DOP, basilico, olio EVO','images/piatti/cosacca.jpg','[{"variante":"Unica","prezzo":5.5}]',1,8),
('pizze-classiche','Ortolana','Fior di latte, melanzane, peperoni, zucchine, basilico, olio EVO','images/piatti/ortolana.jpg','[{"variante":"Unica","prezzo":9.0}]',1,9),
('pizze-classiche','Uagliù','Fior di latte, würstel, patate fritte, olio EVO','images/piatti/uagliu.jpg','[{"variante":"Unica","prezzo":8.5}]',1,10);

-- ============================================================================
-- SEED — PRODOTTI: RIPIENI E PIZZE FRITTE
-- ============================================================================
INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, rimozione_ingredienti, ordine) VALUES
('ripieni-pizze-fritte','Napoletano','Fior di latte, ricotta, salame napoli, parmigiano reggiano DOP, pepe, basilico, olio EVO','images/piatti/napoletano-ripieno.jpg','[{"variante":"Unica","prezzo":9.0}]',1,1),
('ripieni-pizze-fritte','Scarola','Fior di latte, scarola, alici di Cetara, olive nere Caiazzane, olio EVO','images/piatti/scarola.jpg','[{"variante":"Unica","prezzo":10.0}]',1,2),
('ripieni-pizze-fritte','Cotto e Funghi','Fior di latte, prosciutto cotto, funghi freschi, Parmigiano Reggiano DOP, basilico, olio EVO','images/piatti/cotto-funghi-ripieno.jpg','[{"variante":"Unica","prezzo":9.0}]',1,3),
('ripieni-pizze-fritte','Ripieno Special','Fior di latte, melanzane a funghetto, pomodoro giallo; all''uscita prosciutto crudo, pesto di basilico, scaglie di ricotta salata, olio EVO','images/piatti/ripieno-special.jpg','[{"variante":"Unica","prezzo":11.0}]',1,4),
('ripieni-pizze-fritte','Cannolo','Fior di latte, funghi porcini, salsiccia di maiale nostrano, basilico, olio EVO','images/piatti/cannolo.jpg','[{"variante":"Unica","prezzo":10.0}]',1,5),
('ripieni-pizze-fritte','Calzone Fritto','Provola, pomodoro San Marzano DOP, Parmigiano Reggiano DOP, pepe, basilico, olio EVO','images/piatti/calzone-fritto.jpg','[{"variante":"Unica","prezzo":9.0}]',1,6),
('ripieni-pizze-fritte','Fritto Napoli','Fior di latte, ricotta, salame napoli, Parmigiano Reggiano DOP, pepe, basilico, olio EVO','images/piatti/fritto-napoli.jpg','[{"variante":"Unica","prezzo":10.0}]',1,7);

-- ============================================================================
-- SEED — PRODOTTI: PIZZE VEGAN
-- ============================================================================
INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, rimozione_ingredienti, ordine) VALUES
('pizze-vegan','Margherita Vegan','Mozzarella vegana, pomodoro San Marzano DOP, basilico, olio EVO','images/piatti/margherita-vegan.jpg','[{"variante":"Unica","prezzo":8.0}]',1,1),
('pizze-vegan','Marinara ai 4 Pomodori Vegan','Pomodoro San Marzano DOP, pomodorino giallo, pomodorino del Piennolo, pomodoro semidry, origano, aglio, basilico, olio EVO','images/piatti/marinara-4-pomodori-vegan.jpg','[{"variante":"Unica","prezzo":12.0}]',1,2),
('pizze-vegan','Sfumature di Cipolle Vegan','Mozzarella vegana, cipolla rossa di Tropea in quattro varianti: fresca, caramellata, marmellata e croccante, basilico, olio EVO','images/piatti/sfumature-cipolle-vegan.jpg','[{"variante":"Unica","prezzo":12.0}]',1,3);

-- ============================================================================
-- SEED — PRODOTTI: PIZZE DESSERT
-- ============================================================================
INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, ordine) VALUES
('pizze-dessert','Pizza alla Nutella','','images/piatti/pizza-nutella.jpg','[{"variante":"Unica","prezzo":10.0}]',1),
('pizze-dessert','Straccetti alla Nutella','','images/piatti/straccetti-nutella.jpg','[{"variante":"Unica","prezzo":9.0}]',2);

-- ============================================================================
-- SEED — PRODOTTI: BEVANDE
-- ============================================================================
INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, ordine) VALUES
('bevande','Acqua 75cl','','images/piatti/acqua-75cl.jpg','[{"variante":"Unica","prezzo":2.0}]',1),
('bevande','Coca Cola 33cl','','images/piatti/coca-cola.jpg','[{"variante":"Unica","prezzo":3.0}]',2),
('bevande','Coca Cola Zero 33cl','','images/piatti/coca-cola-zero.jpg','[{"variante":"Unica","prezzo":3.0}]',3),
('bevande','Fanta 33cl','','images/piatti/fanta.jpg','[{"variante":"Unica","prezzo":3.0}]',4),
('bevande','Amari e Digestivi','','images/piatti/amari-digestivi.jpg','[{"variante":"Unica","prezzo":2.5}]',5);

-- ============================================================================
-- SEED — PRODOTTI: BIRRE
-- ============================================================================
INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, ordine) VALUES
('birre','Ceres 33cl','','images/piatti/birra-ceres.jpg','[{"variante":"Unica","prezzo":4.0}]',1),
('birre','Tennent''s 33cl','','images/piatti/birra-tennents.jpg','[{"variante":"Unica","prezzo":4.0}]',2),
('birre','Nastro Azzurro 33cl','','images/piatti/birra-nastro-azzurro.jpg','[{"variante":"Unica","prezzo":2.5}]',3),
('birre','Ichnusa 33cl','','images/piatti/birra-ichnusa.jpg','[{"variante":"Unica","prezzo":3.5}]',4),
('birre','Leffe Rossa 33cl','','images/piatti/birra-leffe-rossa.jpg','[{"variante":"Unica","prezzo":4.5}]',5),
('birre','Poretti Chiara 20cl (spillata)','','images/piatti/poretti-chiara-20cl.jpg','[{"variante":"Unica","prezzo":3.0}]',6),
('birre','Poretti Chiara 40cl (spillata)','','images/piatti/poretti-chiara-40cl.jpg','[{"variante":"Unica","prezzo":5.0}]',7),
('birre','Poretti Rossa 20cl (spillata)','','images/piatti/poretti-rossa-20cl.jpg','[{"variante":"Unica","prezzo":3.5}]',8),
('birre','Poretti Rossa 40cl (spillata)','','images/piatti/poretti-rossa-40cl.jpg','[{"variante":"Unica","prezzo":7.0}]',9);

-- ============================================================================
-- SEED — MAGAZZINO (fornitori/reparti placeholder, rinominabili in admin)
-- ============================================================================
INSERT INTO magazzino_fornitori (nome, whatsapp, reparto) VALUES
('Fornitore Farina & Impasti (da rinominare)', '390000000000', 'Farina & Impasti'),
('Fornitore Formaggi & Latticini (da rinominare)', '390000000000', 'Formaggi & Latticini'),
('Fornitore Salumi (da rinominare)', '390000000000', 'Salumi'),
('Fornitore Ortofrutta (da rinominare)', '390000000000', 'Ortofrutta'),
('Fornitore Bevande (da rinominare)', '390000000000', 'Bevande');

INSERT INTO magazzino_materie_prime (nome, reparto, unita_misura, prezzo_riferimento) VALUES
('Farina 00','Farina & Impasti','kg',1.2),
('Farina Manitoba','Farina & Impasti','kg',1.8),
('Lievito di birra','Farina & Impasti','kg',6.0),
('Fior di Latte di Agerola','Formaggi & Latticini','kg',8.0),
('Mozzarella di Bufala DOP','Formaggi & Latticini','kg',11.0),
('Provola Affumicata','Formaggi & Latticini','kg',10.0),
('Parmigiano Reggiano DOP','Formaggi & Latticini','kg',18.0),
('Scamorza Affumicata','Formaggi & Latticini','kg',9.5),
('Gorgonzola DOP','Formaggi & Latticini','kg',9.0),
('Prosciutto Cotto','Salumi','kg',11.0),
('Prosciutto Crudo','Salumi','kg',18.0),
('Mortadella IGP di Bologna','Salumi','kg',10.0),
('Speck','Salumi','kg',15.0),
('''Nduja di Spilinga','Salumi','kg',12.0),
('Salsiccia Nostrana','Salumi','kg',9.0),
('Pomodoro San Marzano DOP','Ortofrutta','kg',3.5),
('Pomodorini del Piennolo','Ortofrutta','kg',5.0),
('Basilico Fresco','Ortofrutta','kg',12.0),
('Cipolla Rossa di Tropea','Ortofrutta','kg',2.0),
('Melanzane','Ortofrutta','kg',1.8),
('Friarielli','Ortofrutta','kg',3.0),
('Coca Cola 33cl lattina','Bevande','pz',0.5),
('Birra Ceres 33cl','Bevande','pz',1.5),
('Acqua naturale 75cl','Bevande','pz',0.3);
