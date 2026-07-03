-- ============================================================================
-- Chapeau Burger — schema.sql
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
  ('nome_locale', 'Chapeau Burger'),
  ('citta', 'Aversa (CE)'),
  ('indirizzo', 'Viale Europa, 136, 81031 Aversa (CE)'),
  ('maps_link', 'https://maps.google.com/maps/place//data=!4m2!3m1!1s0x133b01271f1517b1:0xddb667e65a0e51fb?entry=s'),
  ('whatsapp_ordini', '393337812938'),
  ('instagram', 'https://www.instagram.com/chapeauburger'),
  ('facebook', ''),
  ('banner_testo', '🎩 Sconto 10% sul primo ordine online! Scrivi ''BENVENUTO'' nella nota dell''ordine su WhatsApp'),
  ('orario_lun', '12:00–15:00 · 18:00–03:00'),
  ('orario_mar', '12:00–15:00 · 18:00–03:00'),
  ('orario_mer', '12:00–15:00 · 18:00–03:00'),
  ('orario_gio', '12:00–15:00 · 18:00–03:00'),
  ('orario_ven', '12:00–15:00 · 18:00–06:00'),
  ('orario_sab', '12:00–15:00 · 18:00–06:00'),
  ('orario_dom', '12:00–15:00 · 18:00–06:00'),
  ('magazzino_attivo', '1'),
  ('admin_password_avviso', 'changeme123');

-- ============================================================================
-- SEED — CATEGORIE
-- ============================================================================
INSERT INTO categorie (id, nome, icona, ordine, attiva) VALUES
  ('antipasti', 'Antipasti & Fritti', '🥟', 1, 1),
  ('primi',     'Primi Piatti',       '🍝', 2, 1),
  ('secondi',   'Secondi alla Brace', '🍖', 3, 1),
  ('speciali',  'Il Crocchettone & Il Polpettone', '🥙', 4, 1),
  ('panino',    'Componi il tuo Panino', '🍔', 5, 1),
  ('vini',      'Vini', '🍷', 6, 1),
  ('birre',     'Birre', '🍺', 7, 1),
  ('bibite',    'Bibite', '🥤', 8, 1);

-- ============================================================================
-- SEED — PRODOTTI: ANTIPASTI & FRITTI
-- ============================================================================
INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, rimozione_ingredienti, ordine) VALUES
('antipasti','Fritto misto x2','Bruschette, zeppoline alle alghe, panzerotti, polpettine, arancine','images/piatti/fritto-misto.jpg','[{"variante":"Unica","prezzo":8.0}]',1,1),
('antipasti','Tagliere salumi x2','Crudo di Parma, cotto Leoncini, speck, mortadella, mozzarella, salame','images/piatti/tagliere-salumi.jpg','[{"variante":"Unica","prezzo":15.0}]',1,2),
('antipasti','Crudo e mozzarella','Crudo di Parma, mozzarella di Bufala','images/piatti/crudo-mozzarella.jpg','[{"variante":"Unica","prezzo":7.0}]',1,3),
('antipasti','Fagioli alla messicana','','images/piatti/fagioli-messicana.jpg','[{"variante":"Unica","prezzo":7.0}]',0,4),
('antipasti','Polipo all''insalata x2','','images/piatti/polipo-insalata.jpg','[{"variante":"Unica","prezzo":15.0}]',0,5),
('antipasti','Crocchè di patate','','images/piatti/crocche-patate.jpg','[{"variante":"Unica","prezzo":1.5}]',0,6),
('antipasti','Frittatina di zio Frank','','images/piatti/frittatina-zio-frank.jpg','[{"variante":"Unica","prezzo":2.0}]',0,7),
('antipasti','Frittatina pasta, patate e provola','Pasta, patate, provola','images/piatti/frittatina-pasta-patate.jpg','[{"variante":"Unica","prezzo":2.5}]',1,8),
('antipasti','Frittatina salsiccia e friarielli','Salsiccia, friarielli','images/piatti/frittatina-salsiccia-friarielli.jpg','[{"variante":"Unica","prezzo":2.5}]',1,9),
('antipasti','Frittatina carbonara','','images/piatti/frittatina-carbonara.jpg','[{"variante":"Unica","prezzo":2.5}]',0,10),
('antipasti','Arancino','','images/piatti/arancino.jpg','[{"variante":"Unica","prezzo":2.0}]',0,11),
('antipasti','Patatine fritte piccola','','images/piatti/patatine-piccola.jpg','[{"variante":"Unica","prezzo":2.0}]',0,12),
('antipasti','Patatine fritte grande','','images/piatti/patatine-grande.jpg','[{"variante":"Unica","prezzo":4.0}]',0,13),
('antipasti','Patatine fritte e wurstel','Patatine, wurstel','images/piatti/patatine-wurstel.jpg','[{"variante":"Unica","prezzo":5.0}]',1,14),
('antipasti','Kebab e patatine','Kebab, patatine','images/piatti/kebab-patatine.jpg','[{"variante":"Unica","prezzo":7.0}]',1,15),
('antipasti','Kebab, patatine e cheddar','Kebab, patatine, cheddar','images/piatti/kebab-patatine-cheddar.jpg','[{"variante":"Unica","prezzo":8.0}]',1,16),
('antipasti','Polpettine e patate','Polpettine, patate','images/piatti/polpettine-patate.jpg','[{"variante":"Unica","prezzo":6.0}]',1,17),
('antipasti','Polpettine, patate e cheddar','Polpettine, patate, cheddar','images/piatti/polpettine-patate-cheddar.jpg','[{"variante":"Unica","prezzo":7.0}]',1,18),
('antipasti','Polpettine 20pz','','images/piatti/polpettine-20pz.jpg','[{"variante":"Unica","prezzo":5.0}]',0,19),
('antipasti','Polpetta','','images/piatti/polpetta.jpg','[{"variante":"Unica","prezzo":1.0}]',0,20),
('antipasti','Polpetta al sugo','','images/piatti/polpetta-sugo.jpg','[{"variante":"Unica","prezzo":1.5}]',0,21),
('antipasti','Nuggets 8pz','','images/piatti/nuggets-8pz.jpg','[{"variante":"Unica","prezzo":4.0}]',0,22);

-- ============================================================================
-- SEED — PRODOTTI: PRIMI PIATTI
-- ============================================================================
INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, rimozione_ingredienti, ordine) VALUES
('primi','Paccheri pesce spada e melanzane','Paccheri, pesce spada, melanzane','images/piatti/paccheri-pesce-spada.jpg','[{"variante":"Unica","prezzo":14.0}]',1,1),
('primi','Bolognese','','images/piatti/bolognese.jpg','[{"variante":"Unica","prezzo":10.0}]',0,2),
('primi','Boscaiola','','images/piatti/boscaiola.jpg','[{"variante":"Unica","prezzo":10.0}]',0,3),
('primi','Genovese','','images/piatti/genovese.jpg','[{"variante":"Unica","prezzo":10.0}]',0,4),
('primi','Pennette salsiccia e peperoni','Pennette, salsiccia, peperoni','images/piatti/pennette-salsiccia-peperoni.jpg','[{"variante":"Unica","prezzo":9.0}]',1,5),
('primi','Pennette speck, zucchine e mozzarella','Pennette, speck, zucchine, mozzarella','images/piatti/pennette-speck-zucchine.jpg','[{"variante":"Unica","prezzo":9.0}]',1,6),
('primi','Carbonara','','images/piatti/carbonara.jpg','[{"variante":"Unica","prezzo":9.0}]',0,7),
('primi','Pasta e patate con provola','Pasta, patate, provola','images/piatti/pasta-patate-provola.jpg','[{"variante":"Unica","prezzo":9.0}]',1,8),
('primi','Spaghetti alle vongole','','images/piatti/spaghetti-vongole.jpg','[{"variante":"Unica","prezzo":15.0}]',0,9),
('primi','Pomodoro fresco','','images/piatti/pomodoro-fresco.jpg','[{"variante":"Unica","prezzo":8.0}]',0,10),
('primi','Scarpariello','','images/piatti/scarpariello.jpg','[{"variante":"Unica","prezzo":8.0}]',0,11),
('primi','Siciliana','','images/piatti/siciliana.jpg','[{"variante":"Unica","prezzo":9.0}]',0,12),
('primi','Ragù Napoletano','','images/piatti/ragu-napoletano.jpg','[{"variante":"Unica","prezzo":10.0}]',0,13),
('primi','Arrabbiata','','images/piatti/arrabbiata.jpg','[{"variante":"Unica","prezzo":8.0}]',0,14),
('primi','Bucatini all''Amatriciana','','images/piatti/bucatini-amatriciana.jpg','[{"variante":"Unica","prezzo":9.0}]',0,15);

-- ============================================================================
-- SEED — PRODOTTI: SECONDI ALLA BRACE
-- (Costoletta/Salsiccia/Tris di carne: contorno incluso -> scelta_obbligatoria "Contorno" a supplemento 0)
-- ============================================================================
INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, scelte_obbligatorie, rimozione_ingredienti, ordine) VALUES
('secondi','Frittura di gamberi e calamari','Gamberi, calamari','images/piatti/frittura-gamberi-calamari.jpg','[{"variante":"Unica","prezzo":15.0}]','[]',1,1),
('secondi','Zuppa di cozze','','images/piatti/zuppa-cozze.jpg','[{"variante":"Unica","prezzo":15.0}]','[]',0,2),
('secondi','Pesce spada alla brace','','images/piatti/pesce-spada-brace.jpg','[{"variante":"Unica","prezzo":11.0}]','[]',0,3),
('secondi','Costoletta di maiale','Alla brace con contorno a scelta','images/piatti/costoletta-maiale.jpg','[{"variante":"Unica","prezzo":8.0}]','[{"nome":"Contorno","opzioni":[{"nome":"Rucola","supplemento":0},{"nome":"Peperoni","supplemento":0},{"nome":"Friarielli","supplemento":0},{"nome":"Pomodori","supplemento":0},{"nome":"Patate fritte","supplemento":0},{"nome":"Insalata","supplemento":0},{"nome":"Melanzane a funghetto","supplemento":0},{"nome":"Melanzane a filetto","supplemento":0},{"nome":"Melanzane grigliate","supplemento":0},{"nome":"Cipolla caramellata","supplemento":0},{"nome":"Funghi trifolati","supplemento":0},{"nome":"Zucchine alla scapece","supplemento":0},{"nome":"Zucchine grigliate","supplemento":0},{"nome":"Parmigiana di melanzane","supplemento":0},{"nome":"Parmigiana bianca","supplemento":0}]}]',0,4),
('secondi','Salsiccia di maiale nero','Alla brace con contorno a scelta','images/piatti/salsiccia-maiale-nero.jpg','[{"variante":"Unica","prezzo":7.0}]','[{"nome":"Contorno","opzioni":[{"nome":"Rucola","supplemento":0},{"nome":"Peperoni","supplemento":0},{"nome":"Friarielli","supplemento":0},{"nome":"Pomodori","supplemento":0},{"nome":"Patate fritte","supplemento":0},{"nome":"Insalata","supplemento":0},{"nome":"Melanzane a funghetto","supplemento":0},{"nome":"Melanzane a filetto","supplemento":0},{"nome":"Melanzane grigliate","supplemento":0},{"nome":"Cipolla caramellata","supplemento":0},{"nome":"Funghi trifolati","supplemento":0},{"nome":"Zucchine alla scapece","supplemento":0},{"nome":"Zucchine grigliate","supplemento":0},{"nome":"Parmigiana di melanzane","supplemento":0},{"nome":"Parmigiana bianca","supplemento":0}]}]',0,5),
('secondi','Tris di pesce alla brace','Gamberi, calamari, pesce spada','images/piatti/tris-pesce-brace.jpg','[{"variante":"Unica","prezzo":15.0}]','[]',1,6),
('secondi','Tris di carne alla brace','Hamburger di Scottona 180gr, salsiccia di maiale nero, costoletta di maiale, contorno a scelta','images/piatti/tris-carne-brace.jpg','[{"variante":"Unica","prezzo":15.0}]','[{"nome":"Contorno","opzioni":[{"nome":"Rucola","supplemento":0},{"nome":"Peperoni","supplemento":0},{"nome":"Friarielli","supplemento":0},{"nome":"Pomodori","supplemento":0},{"nome":"Patate fritte","supplemento":0},{"nome":"Insalata","supplemento":0},{"nome":"Melanzane a funghetto","supplemento":0},{"nome":"Melanzane a filetto","supplemento":0},{"nome":"Melanzane grigliate","supplemento":0},{"nome":"Cipolla caramellata","supplemento":0},{"nome":"Funghi trifolati","supplemento":0},{"nome":"Zucchine alla scapece","supplemento":0},{"nome":"Zucchine grigliate","supplemento":0},{"nome":"Parmigiana di melanzane","supplemento":0},{"nome":"Parmigiana bianca","supplemento":0}]}]',1,7),
('secondi','Cotoletta e patatine','Cotoletta, patatine','images/piatti/cotoletta-patatine.jpg','[{"variante":"Unica","prezzo":7.0}]','[]',1,8);

-- ============================================================================
-- SEED — PRODOTTI: IL CROCCHETTONE & IL POLPETTONE (7€, gusto a scelta obbligatoria)
-- ============================================================================
INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, scelte_obbligatorie, ordine) VALUES
('speciali','Il Crocchettone','Crocchè gigante ripieno, scegli il gusto','images/piatti/il-crocchettone.jpg','[{"variante":"Unica","prezzo":7.0}]','[{"nome":"Gusto","opzioni":[{"nome":"Salsiccia e Friarielli","supplemento":0},{"nome":"Parmigiana e Provola","supplemento":0},{"nome":"Prosciutto Cotto e Mozzarella","supplemento":0},{"nome":"Mortadella e Crema di Pistacchio","supplemento":0},{"nome":"Polpette al Ragù","supplemento":0},{"nome":"Bacon e Cheddar","supplemento":0}]}]',1),
('speciali','Il Polpettone','Polpettone gigante ripieno, scegli il gusto','images/piatti/il-polpettone.jpg','[{"variante":"Unica","prezzo":7.0}]','[{"nome":"Gusto","opzioni":[{"nome":"Porchetta e Funghi","supplemento":0},{"nome":"Prosciutto Cotto e Mozzarella","supplemento":0},{"nome":"Salsiccia e Friarielli","supplemento":0},{"nome":"Parmigiana e Provola","supplemento":0},{"nome":"Mortadella e Crema di Pistacchio","supplemento":0},{"nome":"Bacon e Cheddar","supplemento":0}]}]',2);

-- ============================================================================
-- SEED — PRODOTTI: COMPONI IL TUO PANINO
-- (11 basi come "prezzi" -> radio obbligatorio; Formaggi/Extra/Contorni come scelte_multiple opzionali a supplemento)
-- ============================================================================
INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, scelte_multiple, ordine) VALUES
('panino','Componi il tuo Panino','Scegli la base e personalizza con formaggi, contorni ed extra','images/piatti/componi-panino.jpg',
'[{"variante":"Hamburger Fassona 180gr","prezzo":9.0},{"variante":"Hamburger Black Angus USA 180gr","prezzo":9.0},{"variante":"Hamburger Chianina 180gr","prezzo":7.0},{"variante":"Hamburger Marchigiana 180gr","prezzo":6.0},{"variante":"Hamburger Scottona 180gr","prezzo":5.0},{"variante":"Petto di Pollo a fette","prezzo":5.0},{"variante":"Salsiccia di Maiale Nero","prezzo":5.0},{"variante":"Porchetta","prezzo":5.0},{"variante":"Cotoletta di Pollo","prezzo":5.0},{"variante":"Wurstel","prezzo":4.0},{"variante":"Kebab","prezzo":5.0}]',
'[{"nome":"Formaggi","min":0,"max":null,"opzioni":[{"nome":"Mozzarella","supplemento":0.5},{"nome":"Cheddar","supplemento":0.5},{"nome":"Sottilette","supplemento":0.5},{"nome":"Provola affumicata","supplemento":0.5}]},
{"nome":"Extra","min":0,"max":null,"opzioni":[{"nome":"Uova occhio di bue","supplemento":1.0},{"nome":"Anelli di cipolla 3pz","supplemento":1.0},{"nome":"Crema di pistacchio","supplemento":1.0},{"nome":"Mortadella IGP","supplemento":1.0},{"nome":"Scaglie di grana","supplemento":1.0},{"nome":"Bacon IGP","supplemento":1.0},{"nome":"Pesto","supplemento":1.0},{"nome":"Speck IGP","supplemento":1.0},{"nome":"Crema di noci","supplemento":1.0},{"nome":"Bocconcini di mozzarella","supplemento":2.0}]},
{"nome":"I tuoi contorni","min":0,"max":null,"opzioni":[{"nome":"Rucola","supplemento":0.5},{"nome":"Peperoni","supplemento":0.5},{"nome":"Friarielli","supplemento":0.5},{"nome":"Pomodori","supplemento":0.5},{"nome":"Patate fritte","supplemento":0.5},{"nome":"Insalata","supplemento":0.5},{"nome":"Melanzane a funghetto","supplemento":0.5},{"nome":"Melanzane a filetto","supplemento":0.5},{"nome":"Melanzane grigliate","supplemento":0.5},{"nome":"Cipolla caramellata","supplemento":0.5},{"nome":"Funghi trifolati","supplemento":0.5},{"nome":"Zucchine alla scapece","supplemento":0.5},{"nome":"Zucchine grigliate","supplemento":0.5},{"nome":"Parmigiana di melanzane","supplemento":0.5},{"nome":"Parmigiana bianca","supplemento":0.5}]}]',
1);

-- ============================================================================
-- SEED — PRODOTTI: VINI / BIRRE / BIBITE (no rimozione ingredienti)
-- ============================================================================
INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, ordine) VALUES
('vini','Aglianico Cecere 75cl','','images/piatti/vino-aglianico-cecere.jpg','[{"variante":"Unica","prezzo":15.0}]',1),
('vini','Fiano di Avellino 75cl','','images/piatti/vino-fiano-avellino.jpg','[{"variante":"Unica","prezzo":15.0}]',2),
('vini','Aglianico 35cl','','images/piatti/vino-aglianico.jpg','[{"variante":"Unica","prezzo":8.0}]',3),
('vini','Falanghina 35cl','','images/piatti/vino-falanghina.jpg','[{"variante":"Unica","prezzo":8.0}]',4),
('vini','Granato Calabrese Rosso 75cl','','images/piatti/vino-granato-calabrese.jpg','[{"variante":"Unica","prezzo":10.0}]',5),
('vini','Malvasia Bianco 75cl','','images/piatti/vino-malvasia.jpg','[{"variante":"Unica","prezzo":10.0}]',6);

INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, ordine) VALUES
('birre','Tennent''s 9% 33cl','','images/piatti/birra-tennents.jpg','[{"variante":"Unica","prezzo":3.0}]',1),
('birre','Heineken 5% 33cl','','images/piatti/birra-heineken.jpg','[{"variante":"Unica","prezzo":3.0}]',2),
('birre','Zi Mari 5.1% 33cl','','images/piatti/birra-zi-mari.jpg','[{"variante":"Unica","prezzo":6.0}]',3),
('birre','Angie 5.4% 33cl','','images/piatti/birra-angie.jpg','[{"variante":"Unica","prezzo":6.0}]',4),
('birre','Don Luis 8% 33cl','','images/piatti/birra-don-luis.jpg','[{"variante":"Unica","prezzo":6.0}]',5);

INSERT INTO prodotti (categoria_id, nome, descrizione, immagine, prezzi, ordine) VALUES
('bibite','Coca Cola 33cl','','images/piatti/coca-cola.jpg','[{"variante":"Unica","prezzo":2.0}]',1),
('bibite','Coca Cola Zero 33cl','','images/piatti/coca-cola-zero.jpg','[{"variante":"Unica","prezzo":2.0}]',2),
('bibite','Fanta 33cl','','images/piatti/fanta.jpg','[{"variante":"Unica","prezzo":2.0}]',3),
('bibite','Tè alla Pesca 33cl','','images/piatti/te-pesca.jpg','[{"variante":"Unica","prezzo":2.0}]',4),
('bibite','Acqua 50cl','','images/piatti/acqua-50cl.jpg','[{"variante":"Unica","prezzo":1.0}]',5),
('bibite','Acqua 1lt','','images/piatti/acqua-1lt.jpg','[{"variante":"Unica","prezzo":2.0}]',6);

-- ============================================================================
-- SEED — MAGAZZINO (fornitori/reparti placeholder, rinominabili in admin)
-- ============================================================================
INSERT INTO magazzino_fornitori (nome, whatsapp, reparto) VALUES
('Fornitore Carne (da rinominare)', '393337812938', 'Carne'),
('Fornitore Panetteria (da rinominare)', '393337812938', 'Panetteria'),
('Fornitore Ortofrutta (da rinominare)', '393337812938', 'Ortofrutta'),
('Fornitore Formaggi & Salumi (da rinominare)', '393337812938', 'Formaggi & Salumi'),
('Fornitore Bevande (da rinominare)', '393337812938', 'Bevande');

INSERT INTO magazzino_materie_prime (nome, reparto, unita_misura, prezzo_riferimento) VALUES
('Hamburger Fassona 180gr','Carne','pz',2.5),
('Hamburger Black Angus 180gr','Carne','pz',2.8),
('Hamburger Chianina 180gr','Carne','pz',2.2),
('Salsiccia di maiale nero','Carne','kg',9.0),
('Pancetta/Bacon IGP','Carne','kg',12.0),
('Panini brioche','Panetteria','pz',0.6),
('Pane per tagliere','Panetteria','pz',0.4),
('Patate fresche','Ortofrutta','kg',1.2),
('Insalata/Rucola','Ortofrutta','kg',2.5),
('Pomodori','Ortofrutta','kg',2.0),
('Cipolle','Ortofrutta','kg',1.0),
('Mozzarella','Formaggi & Salumi','kg',7.0),
('Cheddar','Formaggi & Salumi','kg',9.0),
('Provola affumicata','Formaggi & Salumi','kg',10.0),
('Prosciutto cotto','Formaggi & Salumi','kg',11.0),
('Coca Cola 33cl lattina','Bevande','pz',0.5),
('Birra Heineken 33cl','Bevande','pz',1.0),
('Acqua naturale 50cl','Bevande','pz',0.2);
