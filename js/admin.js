(function () {
  "use strict";

  // ============ Helpers generici ============
  async function apiFetch(url, opts = {}) {
    const resp = await fetch(url, {
      ...opts,
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
      credentials: "same-origin",
    });
    let data = null;
    try {
      data = await resp.json();
    } catch {
      data = null;
    }
    if (!resp.ok) {
      const errore = new Error((data && data.errore) || `Errore ${resp.status}`);
      errore.status = resp.status;
      errore.data = data;
      throw errore;
    }
    return data;
  }

  function mostraToast(msg, tipo = "ok") {
    const t = document.getElementById("toast-admin");
    t.textContent = msg;
    t.className = "toast-admin visibile" + (tipo === "errore" ? " errore" : "");
    setTimeout(() => t.classList.remove("visibile"), 2600);
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatData(iso) {
    if (!iso) return "";
    const d = new Date(iso.replace(" ", "T") + "Z");
    return d.toLocaleString("it-IT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  const modaleOverlay = document.getElementById("modal-generico");
  const modaleContenuto = document.getElementById("modal-generico-contenuto");
  function apriModale(html) {
    modaleContenuto.innerHTML = html;
    modaleOverlay.classList.add("aperto");
  }
  function chiudiModale() {
    modaleOverlay.classList.remove("aperto");
    modaleContenuto.innerHTML = "";
  }
  modaleOverlay.addEventListener("click", (e) => {
    if (e.target === modaleOverlay) chiudiModale();
  });

  window.AdminApp = { apiFetch, mostraToast, escapeHtml, formatData, apriModale, chiudiModale };

  // ============ Login / Sessione ============
  const schermataLogin = document.getElementById("schermata-login");
  const appEl = document.getElementById("app");

  async function verificaSessione() {
    try {
      await apiFetch("/api/admin/impostazioni");
      mostraApp();
    } catch {
      schermataLogin.style.display = "flex";
      appEl.classList.remove("attivo");
    }
  }

  function mostraApp() {
    schermataLogin.style.display = "none";
    appEl.classList.add("attivo");
    inizializzaApp();
  }

  document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = document.getElementById("login-password").value;
    const erroreEl = document.getElementById("login-errore");
    erroreEl.textContent = "";
    try {
      await apiFetch("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
      mostraApp();
    } catch (err) {
      erroreEl.textContent = err.message || "Password errata";
    }
  });

  document.getElementById("btn-logout").addEventListener("click", async () => {
    await apiFetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  });

  // ============ Navigazione sezioni ============
  let appInizializzata = false;
  function inizializzaApp() {
    if (appInizializzata) return;
    appInizializzata = true;

    document.querySelectorAll(".admin-nav button[data-sezione]").forEach((btn) => {
      btn.addEventListener("click", () => attivaSezione(btn.dataset.sezione));
    });

    caricaImpostazioniInForm();
    caricaOrdini();
    if (window.AdminMagazzino) window.AdminMagazzino.aggiornaBadge();
    avviaPolling();
  }

  function attivaSezione(nome) {
    document.querySelectorAll(".admin-nav button[data-sezione]").forEach((b) => b.classList.toggle("attivo", b.dataset.sezione === nome));
    document.querySelectorAll(".sezione-admin").forEach((s) => s.classList.toggle("attiva", s.id === `sezione-${nome}`));

    if (nome === "ordini") caricaOrdini();
    if (nome === "cucina") caricaCucina();
    if (nome === "menu") caricaMenuAdmin();
    if (nome === "clienti") caricaClienti();
    if (nome === "promo") caricaPromo();
    if (nome === "magazzino" && window.AdminMagazzino) window.AdminMagazzino.attiva();
  }

  // ============ ORDINI ============
  let filtroOrdiniAttivo = "";
  const CHIP_STATI = { nuovo: "Nuovo", in_preparazione: "In preparazione", pronto: "Pronto", consegnato: "Consegnato", annullato: "Annullato" };

  document.getElementById("filtri-ordini").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-stato]");
    if (!btn) return;
    document.querySelectorAll("#filtri-ordini button").forEach((b) => b.classList.remove("attivo"));
    btn.classList.add("attivo");
    filtroOrdiniAttivo = btn.dataset.stato;
    caricaOrdini();
  });

  async function caricaOrdini() {
    const tbody = document.getElementById("tabella-ordini");
    try {
      const url = filtroOrdiniAttivo ? `/api/admin/ordini?stato=${filtroOrdiniAttivo}` : "/api/admin/ordini";
      const { ordini } = await apiFetch(url);
      if (!ordini.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="vuoto">Nessun ordine</td></tr>`;
        return;
      }
      tbody.innerHTML = ordini
        .map(
          (o) => `
        <tr>
          <td>#${o.id}</td>
          <td>${escapeHtml(o.cliente_nome)}<br><small style="opacity:0.6;">${escapeHtml(o.cliente_telefono)}</small></td>
          <td>${o.tipo === "domicilio" ? "Domicilio" : "Asporto"}</td>
          <td>${o.totale.toFixed(2)} €</td>
          <td><span class="chip-stato chip-${o.stato}">${CHIP_STATI[o.stato] || o.stato}</span></td>
          <td>${formatData(o.creato_il)}</td>
          <td><button class="btn btn-secondario btn-piccolo" data-apri-ordine="${o.id}">Dettaglio</button></td>
        </tr>`
        )
        .join("");
      tbody.querySelectorAll("[data-apri-ordine]").forEach((btn) => {
        btn.addEventListener("click", () => apriDettaglioOrdine(btn.dataset.apriOrdine));
      });
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="7" class="vuoto">Errore: ${escapeHtml(err.message)}</td></tr>`;
    }
  }

  async function apriDettaglioOrdine(id) {
    const { ordine } = await apiFetch(`/api/admin/ordini/${id}`);
    const righeItems = ordine.items
      .map((it) => `<li>${it.quantita}x ${escapeHtml(it.nome)} ${it.dettagli && it.dettagli.length ? `<br><small style="opacity:0.65;">${escapeHtml(it.dettagli.join(" · "))}</small>` : ""} — ${(it.prezzo_totale * it.quantita).toFixed(2)} €</li>`)
      .join("");

    apriModale(`
      <h2>Ordine #${ordine.id}</h2>
      <p><strong>${escapeHtml(ordine.cliente_nome)}</strong> — ${escapeHtml(ordine.cliente_telefono)}</p>
      ${ordine.cliente_indirizzo ? `<p>${escapeHtml(ordine.cliente_indirizzo)}</p>` : ""}
      <p>Tipo: ${ordine.tipo === "domicilio" ? "Domicilio" : "Asporto"} · Ricevuto: ${formatData(ordine.creato_il)}</p>
      <ul style="padding-left:18px;">${righeItems}</ul>
      <p style="font-weight:800; font-size:1.1rem;">Totale: ${ordine.totale.toFixed(2)} €${ordine.sconto ? ` (sconto ${ordine.sconto.toFixed(2)} € con ${escapeHtml(ordine.promo_codice)})` : ""}</p>
      ${ordine.note ? `<p><strong>Note:</strong> ${escapeHtml(ordine.note)}</p>` : ""}
      <label>Cambia stato</label>
      <select id="select-stato-ordine" style="width:100%; padding:9px; border-radius:8px; border:1px solid var(--bordo); margin-bottom:14px;">
        ${Object.entries(CHIP_STATI).map(([v, l]) => `<option value="${v}" ${ordine.stato === v ? "selected" : ""}>${l}</option>`).join("")}
      </select>
      <button class="btn btn-primario" id="btn-salva-stato-ordine">Salva stato</button>
    `);

    document.getElementById("btn-salva-stato-ordine").addEventListener("click", async () => {
      const stato = document.getElementById("select-stato-ordine").value;
      try {
        await apiFetch(`/api/admin/ordini/${ordine.id}`, { method: "PUT", body: JSON.stringify({ stato }) });
        mostraToast("Stato aggiornato");
        chiudiModale();
        caricaOrdini();
        caricaCucina();
      } catch (err) {
        mostraToast(err.message, "errore");
      }
    });
  }

  // ---- Nuovo ordine manuale ----
  document.getElementById("btn-nuovo-ordine-manuale").addEventListener("click", apriModaleNuovoOrdine);

  let catalogoPerOrdineManuale = null;
  let carrelloManuale = [];

  async function apriModaleNuovoOrdine() {
    if (!catalogoPerOrdineManuale) {
      const data = await apiFetch("/api/menu");
      catalogoPerOrdineManuale = data.categorie;
    }
    carrelloManuale = [];
    renderModaleNuovoOrdine();
  }

  function renderModaleNuovoOrdine() {
    const opzioniProdotti = catalogoPerOrdineManuale
      .map((cat) => `<optgroup label="${escapeHtml(cat.nome)}">${cat.prodotti.map((p) => `<option value="${cat.id}::${p.id}">${escapeHtml(p.nome)} — da ${Math.min(...p.prezzi.map((x) => x.prezzo)).toFixed(2)} €</option>`).join("")}</optgroup>`)
      .join("");

    const totale = carrelloManuale.reduce((acc, r) => acc + r.prezzo_totale * r.quantita, 0);

    apriModale(`
      <h2>Nuovo ordine manuale</h2>
      <div class="form-grid due-col">
        <div><label>Nome cliente</label><input id="manuale-nome"></div>
        <div><label>Telefono</label><input id="manuale-telefono"></div>
        <div><label>Tipo</label><select id="manuale-tipo"><option value="asporto">Asporto</option><option value="domicilio">Domicilio</option></select></div>
        <div><label>Indirizzo</label><input id="manuale-indirizzo"></div>
      </div>
      <hr style="margin:16px 0; border-color:var(--bordo);">
      <label>Aggiungi prodotto dal catalogo</label>
      <select id="manuale-select-prodotto" style="width:100%; padding:9px; border-radius:8px; border:1px solid var(--bordo);">
        <option value="">— seleziona un prodotto —</option>
        ${opzioniProdotti}
      </select>
      <button class="btn btn-secondario btn-piccolo" id="manuale-aggiungi-prodotto" style="margin-top:8px;">Aggiungi (quantità 1, prezzo base)</button>
      <ul id="manuale-lista-carrello" style="padding-left:18px; margin-top:14px;">
        ${carrelloManuale.map((r, idx) => `<li>${r.quantita}x ${escapeHtml(r.nome)} — ${(r.prezzo_totale * r.quantita).toFixed(2)} € <button data-rimuovi-manuale="${idx}" style="border:none;background:none;color:var(--rosso);cursor:pointer;">rimuovi</button></li>`).join("") || "<li style='opacity:0.6;'>Nessun prodotto aggiunto</li>"}
      </ul>
      <p style="font-weight:800;">Totale: ${totale.toFixed(2)} €</p>
      <label>Note</label>
      <textarea id="manuale-note" rows="2" style="width:100%; padding:9px; border-radius:8px; border:1px solid var(--bordo);"></textarea>
      <button class="btn btn-primario" id="manuale-conferma" style="margin-top:14px;">Crea ordine</button>
    `);

    document.getElementById("manuale-aggiungi-prodotto").addEventListener("click", () => {
      const val = document.getElementById("manuale-select-prodotto").value;
      if (!val) return;
      const [catId, prodId] = val.split("::");
      const cat = catalogoPerOrdineManuale.find((c) => c.id === catId);
      const prod = cat.prodotti.find((p) => String(p.id) === prodId);
      const prezzoBase = Math.min(...prod.prezzi.map((x) => x.prezzo));
      carrelloManuale.push({ nome: prod.nome, quantita: 1, prezzo_totale: prezzoBase, dettagli: prod.prezzi.length > 1 ? [`Formato: ${prod.prezzi[0].variante}`] : [] });
      renderModaleNuovoOrdine();
    });

    modaleContenuto.querySelectorAll("[data-rimuovi-manuale]").forEach((btn) => {
      btn.addEventListener("click", () => {
        carrelloManuale.splice(Number(btn.dataset.rimuoviManuale), 1);
        renderModaleNuovoOrdine();
      });
    });

    document.getElementById("manuale-conferma").addEventListener("click", async () => {
      if (carrelloManuale.length === 0) return mostraToast("Aggiungi almeno un prodotto", "errore");
      const payload = {
        cliente: {
          nome: document.getElementById("manuale-nome").value || "Cliente banco",
          telefono: document.getElementById("manuale-telefono").value || "",
          indirizzo: document.getElementById("manuale-indirizzo").value || "",
        },
        tipo: document.getElementById("manuale-tipo").value,
        note: document.getElementById("manuale-note").value,
        items: carrelloManuale,
      };
      try {
        await apiFetch("/api/admin/ordini", { method: "POST", body: JSON.stringify(payload) });
        mostraToast("Ordine creato");
        chiudiModale();
        caricaOrdini();
      } catch (err) {
        mostraToast(err.message, "errore");
      }
    });
  }

  // ============ CUCINA ============
  let filtroCucinaAttivo = "nuovo";
  document.getElementById("filtri-cucina").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-stato]");
    if (!btn) return;
    document.querySelectorAll("#filtri-cucina button").forEach((b) => b.classList.remove("attivo"));
    btn.classList.add("attivo");
    filtroCucinaAttivo = btn.dataset.stato;
    caricaCucina();
  });

  const PROSSIMO_STATO = { nuovo: "in_preparazione", in_preparazione: "pronto", pronto: "consegnato" };
  const LABEL_AZIONE = { nuovo: "Avvia preparazione", in_preparazione: "Segna pronto", pronto: "Consegna" };

  async function caricaCucina() {
    const cont = document.getElementById("lista-cucina");
    try {
      const { ordini } = await apiFetch(`/api/admin/ordini?stato=${filtroCucinaAttivo}`);
      if (!ordini.length) {
        cont.innerHTML = `<div class="vuoto">Nessun ordine in questo stato</div>`;
        return;
      }
      cont.innerHTML = ordini
        .map(
          (o) => `
        <div class="card">
          <div class="card-header">
            <h3>#${o.id} — ${escapeHtml(o.cliente_nome)}</h3>
            <span class="chip-stato chip-${o.stato}">${CHIP_STATI[o.stato]}</span>
          </div>
          <ul style="padding-left:18px; margin:0 0 12px;">
            ${o.items.map((it) => `<li>${it.quantita}x ${escapeHtml(it.nome)}${it.dettagli && it.dettagli.length ? ` — ${escapeHtml(it.dettagli.join(", "))}` : ""}</li>`).join("")}
          </ul>
          ${o.note ? `<p><strong>Note:</strong> ${escapeHtml(o.note)}</p>` : ""}
          ${PROSSIMO_STATO[o.stato] ? `<button class="btn btn-primario" data-avanza="${o.id}" data-nuovo-stato="${PROSSIMO_STATO[o.stato]}">${LABEL_AZIONE[o.stato]}</button>` : ""}
        </div>`
        )
        .join("");

      cont.querySelectorAll("[data-avanza]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          try {
            await apiFetch(`/api/admin/ordini/${btn.dataset.avanza}`, { method: "PUT", body: JSON.stringify({ stato: btn.dataset.nuovoStato }) });
            caricaCucina();
            caricaOrdini();
          } catch (err) {
            mostraToast(err.message, "errore");
          }
        });
      });
    } catch (err) {
      cont.innerHTML = `<div class="vuoto">Errore: ${escapeHtml(err.message)}</div>`;
    }
  }

  // ============ MENU (categorie/prodotti) ============
  async function caricaMenuAdmin() {
    const cont = document.getElementById("lista-categorie-menu");
    try {
      const [{ categorie }, { prodotti }] = await Promise.all([apiFetch("/api/admin/categorie"), apiFetch("/api/admin/prodotti")]);
      window.AdminMenuState = { categorie, prodotti };

      cont.innerHTML = categorie
        .map(
          (cat) => `
        <div class="card">
          <div class="card-header">
            <h3>${cat.icona} ${escapeHtml(cat.nome)} ${cat.attiva ? "" : '<span style="opacity:0.5; font-size:0.8rem;">(disattivata)</span>'}</h3>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-secondario btn-piccolo" data-modifica-categoria="${cat.id}">Modifica categoria</button>
              <button class="btn btn-pericolo btn-piccolo" data-elimina-categoria="${cat.id}">Elimina</button>
            </div>
          </div>
          <div class="tabella-scroll">
            <table>
              <thead><tr><th>Nome</th><th>Prezzo</th><th>Attivo</th><th></th></tr></thead>
              <tbody>
                ${prodotti
                  .filter((p) => p.categoria_id === cat.id)
                  .map((p) => {
                    const prezzoLabel = p.prezzi.length > 1 ? `da ${Math.min(...p.prezzi.map((x) => x.prezzo)).toFixed(2)} €` : `${(p.prezzi[0]?.prezzo || 0).toFixed(2)} €`;
                    return `<tr>
                      <td>${escapeHtml(p.nome)}</td>
                      <td>${prezzoLabel}</td>
                      <td>${p.attivo ? "✅" : "⛔️"}</td>
                      <td style="white-space:nowrap;">
                        <button class="btn btn-secondario btn-piccolo" data-modifica-prodotto="${p.id}">Modifica</button>
                        <button class="btn btn-pericolo btn-piccolo" data-elimina-prodotto="${p.id}">Elimina</button>
                      </td>
                    </tr>`;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>`
        )
        .join("");

      cont.querySelectorAll("[data-modifica-categoria]").forEach((btn) => btn.addEventListener("click", () => apriModaleCategoria(btn.dataset.modificaCategoria)));
      cont.querySelectorAll("[data-elimina-categoria]").forEach((btn) => btn.addEventListener("click", () => eliminaCategoria(btn.dataset.eliminaCategoria)));
      cont.querySelectorAll("[data-modifica-prodotto]").forEach((btn) => btn.addEventListener("click", () => apriModaleProdotto(Number(btn.dataset.modificaProdotto))));
      cont.querySelectorAll("[data-elimina-prodotto]").forEach((btn) => btn.addEventListener("click", () => eliminaProdotto(Number(btn.dataset.eliminaProdotto))));
    } catch (err) {
      cont.innerHTML = `<div class="vuoto">Errore: ${escapeHtml(err.message)}</div>`;
    }
  }

  document.getElementById("btn-nuova-categoria").addEventListener("click", () => apriModaleCategoria(null));
  document.getElementById("btn-nuovo-prodotto").addEventListener("click", () => apriModaleProdotto(null));

  function apriModaleCategoria(id) {
    const cat = id ? window.AdminMenuState.categorie.find((c) => c.id === id) : null;
    apriModale(`
      <h2>${cat ? "Modifica categoria" : "Nuova categoria"}</h2>
      <div class="form-grid">
        <div><label>Nome</label><input id="cat-nome" value="${escapeHtml(cat?.nome || "")}"></div>
        <div><label>Icona (emoji)</label><input id="cat-icona" value="${escapeHtml(cat?.icona || "🍽️")}"></div>
        ${cat ? `<div style="display:flex; align-items:center; gap:8px;"><input type="checkbox" id="cat-attiva" ${cat.attiva ? "checked" : ""} style="width:auto;"><label style="margin:0;">Categoria attiva</label></div>` : ""}
      </div>
      <button class="btn btn-primario" id="cat-salva" style="margin-top:14px;">Salva</button>
    `);
    document.getElementById("cat-salva").addEventListener("click", async () => {
      const nome = document.getElementById("cat-nome").value.trim();
      const icona = document.getElementById("cat-icona").value.trim() || "🍽️";
      if (!nome) return mostraToast("Il nome è obbligatorio", "errore");
      try {
        if (cat) {
          const attiva = document.getElementById("cat-attiva").checked;
          await apiFetch(`/api/admin/categorie/${cat.id}`, { method: "PUT", body: JSON.stringify({ nome, icona, attiva }) });
        } else {
          await apiFetch("/api/admin/categorie", { method: "POST", body: JSON.stringify({ nome, icona }) });
        }
        mostraToast("Categoria salvata");
        chiudiModale();
        caricaMenuAdmin();
      } catch (err) {
        mostraToast(err.message, "errore");
      }
    });
  }

  async function eliminaCategoria(id) {
    if (!confirm("Eliminare questa categoria? Deve essere vuota (senza prodotti collegati).")) return;
    try {
      await apiFetch(`/api/admin/categorie/${id}`, { method: "DELETE" });
      mostraToast("Categoria eliminata");
      caricaMenuAdmin();
    } catch (err) {
      mostraToast(err.message, "errore");
    }
  }

  async function eliminaProdotto(id) {
    if (!confirm("Eliminare questo prodotto?")) return;
    try {
      await apiFetch(`/api/admin/prodotti/${id}`, { method: "DELETE" });
      mostraToast("Prodotto eliminato");
      caricaMenuAdmin();
    } catch (err) {
      mostraToast(err.message, "errore");
    }
  }

  // ---- Editor prodotto (con formato/scelte obbligatorie/multiple) ----
  function apriModaleProdotto(id) {
    const prodotto = id ? window.AdminMenuState.prodotti.find((p) => p.id === id) : null;
    const categorie = window.AdminMenuState.categorie;

    apriModale(`
      <h2>${prodotto ? "Modifica prodotto" : "Nuovo prodotto"}</h2>
      <div class="form-grid due-col">
        <div><label>Nome</label><input id="prod-nome" value="${escapeHtml(prodotto?.nome || "")}"></div>
        <div><label>Categoria</label>
          <select id="prod-categoria">
            ${categorie.map((c) => `<option value="${c.id}" ${prodotto?.categoria_id === c.id ? "selected" : ""}>${c.icona} ${escapeHtml(c.nome)}</option>`).join("")}
          </select>
        </div>
        <div style="grid-column:1/-1;"><label>Descrizione (usata anche per generare gli ingredienti rimovibili, separati da virgola)</label><input id="prod-descrizione" value="${escapeHtml(prodotto?.descrizione || "")}"></div>
        <div style="grid-column:1/-1;"><label>Immagine (percorso, es. images/piatti/nome.jpg)</label><input id="prod-immagine" value="${escapeHtml(prodotto?.immagine || "")}"></div>
        <div style="display:flex; align-items:center; gap:8px;"><input type="checkbox" id="prod-rimozione" ${prodotto?.rimozione_ingredienti ? "checked" : ""} style="width:auto;"><label style="margin:0;">Genera rimozione ingredienti dalla descrizione</label></div>
        ${prodotto ? `<div style="display:flex; align-items:center; gap:8px;"><input type="checkbox" id="prod-attivo" ${prodotto.attivo ? "checked" : ""} style="width:auto;"><label style="margin:0;">Prodotto attivo</label></div>` : ""}
      </div>

      <h3 style="margin-top:20px;">Formato / Varianti di prezzo</h3>
      <p style="font-size:0.82rem; opacity:0.7;">Se aggiungi più di una variante, il cliente dovrà sceglierne obbligatoriamente una (es. formati diversi, tipi di impasto, basi di un panino: tienile tutte in questa unica lista).</p>
      <div id="editor-prezzi"></div>
      <button class="btn btn-secondario btn-piccolo" id="btn-aggiungi-prezzo" style="margin-top:6px;">+ Aggiungi variante</button>

      <h3 style="margin-top:20px;">Scelte obbligatorie (radio, una per gruppo)</h3>
      <div id="editor-obbligatorie"></div>
      <button class="btn btn-secondario btn-piccolo" id="btn-aggiungi-obbligatoria" style="margin-top:6px;">+ Aggiungi gruppo obbligatorio</button>

      <h3 style="margin-top:20px;">Scelte multiple (checkbox, con minimo/massimo)</h3>
      <div id="editor-multiple"></div>
      <button class="btn btn-secondario btn-piccolo" id="btn-aggiungi-multipla" style="margin-top:6px;">+ Aggiungi gruppo a scelta multipla</button>

      <button class="btn btn-primario" id="prod-salva" style="margin-top:20px; width:100%;">Salva prodotto</button>
    `);

    const editorPrezzi = document.getElementById("editor-prezzi");
    const editorObbligatorie = document.getElementById("editor-obbligatorie");
    const editorMultiple = document.getElementById("editor-multiple");

    function rigaPrezzo(variante = "", prezzo = "") {
      const riga = document.createElement("div");
      riga.className = "gruppo-editor-riga";
      riga.innerHTML = `<input class="input-variante" placeholder="Nome variante (es. Unica, Piccola...)" value="${escapeHtml(variante)}">
        <input class="input-prezzo" type="number" step="0.01" min="0" placeholder="Prezzo" value="${escapeHtml(prezzo)}">
        <button type="button" data-rimuovi-riga>×</button>`;
      riga.querySelector("[data-rimuovi-riga]").addEventListener("click", () => riga.remove());
      editorPrezzi.appendChild(riga);
    }
    (prodotto?.prezzi.length ? prodotto.prezzi : [{ variante: "Unica", prezzo: "" }]).forEach((p) => rigaPrezzo(p.variante, p.prezzo));
    document.getElementById("btn-aggiungi-prezzo").addEventListener("click", () => rigaPrezzo());

    function bloccoObbligatoria(gruppo = { nome: "", opzioni: [{ nome: "", supplemento: 0 }] }) {
      const blocco = document.createElement("div");
      blocco.className = "gruppo-editor";
      blocco.innerHTML = `
        <input class="input-nome-gruppo" placeholder="Nome gruppo (es. Gusto, Contorno...)" value="${escapeHtml(gruppo.nome)}" style="margin-bottom:8px;">
        <div class="opzioni-container"></div>
        <div style="display:flex; gap:8px; margin-top:6px;">
          <button type="button" class="btn btn-secondario btn-piccolo" data-aggiungi-opzione>+ opzione</button>
          <button type="button" class="btn btn-pericolo btn-piccolo" data-rimuovi-gruppo>Rimuovi gruppo</button>
        </div>`;
      const opzContainer = blocco.querySelector(".opzioni-container");
      function rigaOpzione(nome = "", supplemento = 0) {
        const riga = document.createElement("div");
        riga.className = "gruppo-editor-riga";
        riga.innerHTML = `<input class="input-opzione-nome" placeholder="Nome opzione" value="${escapeHtml(nome)}">
          <input class="input-prezzo input-opzione-supplemento" type="number" step="0.01" placeholder="Supplemento €" value="${escapeHtml(supplemento)}">
          <button type="button" data-rimuovi-riga>×</button>`;
        riga.querySelector("[data-rimuovi-riga]").addEventListener("click", () => riga.remove());
        opzContainer.appendChild(riga);
      }
      gruppo.opzioni.forEach((o) => rigaOpzione(o.nome, o.supplemento));
      blocco.querySelector("[data-aggiungi-opzione]").addEventListener("click", () => rigaOpzione());
      blocco.querySelector("[data-rimuovi-gruppo]").addEventListener("click", () => blocco.remove());
      editorObbligatorie.appendChild(blocco);
    }
    (prodotto?.scelte_obbligatorie || []).forEach(bloccoObbligatoria);
    document.getElementById("btn-aggiungi-obbligatoria").addEventListener("click", () => bloccoObbligatoria());

    function bloccoMultipla(gruppo = { nome: "", min: 0, max: null, opzioni: [{ nome: "", supplemento: 0 }] }) {
      const blocco = document.createElement("div");
      blocco.className = "gruppo-editor";
      blocco.innerHTML = `
        <input class="input-nome-gruppo" placeholder="Nome gruppo (es. Extra, Formaggi...)" value="${escapeHtml(gruppo.nome)}" style="margin-bottom:8px;">
        <div style="display:flex; gap:8px; margin-bottom:8px;">
          <input class="input-min" type="number" min="0" placeholder="Min (0 = facoltativo)" value="${gruppo.min ?? 0}" style="max-width:160px;">
          <input class="input-max" type="number" min="0" placeholder="Max (vuoto = illimitato)" value="${gruppo.max ?? ""}" style="max-width:160px;">
        </div>
        <div class="opzioni-container"></div>
        <div style="display:flex; gap:8px; margin-top:6px;">
          <button type="button" class="btn btn-secondario btn-piccolo" data-aggiungi-opzione>+ opzione</button>
          <button type="button" class="btn btn-pericolo btn-piccolo" data-rimuovi-gruppo>Rimuovi gruppo</button>
        </div>`;
      const opzContainer = blocco.querySelector(".opzioni-container");
      function rigaOpzione(nome = "", supplemento = 0) {
        const riga = document.createElement("div");
        riga.className = "gruppo-editor-riga";
        riga.innerHTML = `<input class="input-opzione-nome" placeholder="Nome opzione" value="${escapeHtml(nome)}">
          <input class="input-prezzo input-opzione-supplemento" type="number" step="0.01" placeholder="Supplemento €" value="${escapeHtml(supplemento)}">
          <button type="button" data-rimuovi-riga>×</button>`;
        riga.querySelector("[data-rimuovi-riga]").addEventListener("click", () => riga.remove());
        opzContainer.appendChild(riga);
      }
      gruppo.opzioni.forEach((o) => rigaOpzione(o.nome, o.supplemento));
      blocco.querySelector("[data-aggiungi-opzione]").addEventListener("click", () => rigaOpzione());
      blocco.querySelector("[data-rimuovi-gruppo]").addEventListener("click", () => blocco.remove());
      editorMultiple.appendChild(blocco);
    }
    (prodotto?.scelte_multiple || []).forEach(bloccoMultipla);
    document.getElementById("btn-aggiungi-multipla").addEventListener("click", () => bloccoMultipla());

    document.getElementById("prod-salva").addEventListener("click", async () => {
      const prezzi = [...editorPrezzi.querySelectorAll(".gruppo-editor-riga")]
        .map((r) => ({ variante: r.querySelector(".input-variante").value.trim(), prezzo: Number(r.querySelector(".input-prezzo").value) || 0 }))
        .filter((p) => p.variante);

      if (prezzi.length === 0) return mostraToast("Aggiungi almeno una variante di prezzo", "errore");

      const scelteObbligatorie = [...editorObbligatorie.querySelectorAll(".gruppo-editor")]
        .map((blocco) => ({
          nome: blocco.querySelector(".input-nome-gruppo").value.trim(),
          opzioni: [...blocco.querySelectorAll(".gruppo-editor-riga")]
            .map((r) => ({ nome: r.querySelector(".input-opzione-nome").value.trim(), supplemento: Number(r.querySelector(".input-opzione-supplemento").value) || 0 }))
            .filter((o) => o.nome),
        }))
        .filter((g) => g.nome && g.opzioni.length);

      const scelteMultiple = [...editorMultiple.querySelectorAll(".gruppo-editor")]
        .map((blocco) => ({
          nome: blocco.querySelector(".input-nome-gruppo").value.trim(),
          min: Number(blocco.querySelector(".input-min").value) || 0,
          max: blocco.querySelector(".input-max").value ? Number(blocco.querySelector(".input-max").value) : null,
          opzioni: [...blocco.querySelectorAll(".gruppo-editor-riga")]
            .map((r) => ({ nome: r.querySelector(".input-opzione-nome").value.trim(), supplemento: Number(r.querySelector(".input-opzione-supplemento").value) || 0 }))
            .filter((o) => o.nome),
        }))
        .filter((g) => g.nome && g.opzioni.length);

      const payload = {
        nome: document.getElementById("prod-nome").value.trim(),
        categoria_id: document.getElementById("prod-categoria").value,
        descrizione: document.getElementById("prod-descrizione").value.trim(),
        immagine: document.getElementById("prod-immagine").value.trim(),
        rimozione_ingredienti: document.getElementById("prod-rimozione").checked,
        prezzi,
        scelte_obbligatorie: scelteObbligatorie,
        scelte_multiple: scelteMultiple,
      };
      if (prodotto) payload.attivo = document.getElementById("prod-attivo").checked;

      if (!payload.nome) return mostraToast("Il nome è obbligatorio", "errore");

      try {
        if (prodotto) {
          await apiFetch(`/api/admin/prodotti/${prodotto.id}`, { method: "PUT", body: JSON.stringify(payload) });
        } else {
          await apiFetch("/api/admin/prodotti", { method: "POST", body: JSON.stringify(payload) });
        }
        mostraToast("Prodotto salvato");
        chiudiModale();
        caricaMenuAdmin();
      } catch (err) {
        mostraToast(err.message, "errore");
      }
    });
  }

  // ---- Diagnosi ----
  document.getElementById("btn-diagnosi").addEventListener("click", async () => {
    apriModale(`<h2>Auto-diagnosi menu</h2><p>Analisi in corso...</p>`);
    try {
      const { sano, correzioni } = await apiFetch("/api/admin/diagnosi");
      if (sano) {
        apriModale(`<h2>Auto-diagnosi menu</h2><p>✅ Tutto in ordine: nessuna correzione necessaria.</p><button class="btn btn-secondario" id="diag-chiudi">Chiudi</button>`);
        document.getElementById("diag-chiudi").addEventListener("click", chiudiModale);
        return;
      }
      apriModale(`
        <h2>Auto-diagnosi menu</h2>
        <p>Trovate <strong>${correzioni.length}</strong> differenze rispetto al riferimento noto buono:</p>
        ${correzioni.map((c) => `<div class="diagnosi-item"><strong>${escapeHtml(c.motivo)}</strong>${escapeHtml(c.azione)}</div>`).join("")}
        <p style="font-size:0.85rem; opacity:0.7;">Immagine, ordinamento e stato attivo/disattivo dei prodotti non vengono mai toccati.</p>
        <div style="display:flex; gap:10px; margin-top:16px;">
          <button class="btn btn-secondario" id="diag-annulla">Annulla</button>
          <button class="btn btn-primario" id="diag-applica">Applica correzioni</button>
        </div>
      `);
      document.getElementById("diag-annulla").addEventListener("click", chiudiModale);
      document.getElementById("diag-applica").addEventListener("click", async () => {
        try {
          const res = await apiFetch("/api/admin/diagnosi", { method: "POST" });
          mostraToast(`${res.corrette} correzioni applicate`);
          chiudiModale();
          caricaMenuAdmin();
        } catch (err) {
          mostraToast(err.message, "errore");
        }
      });
    } catch (err) {
      apriModale(`<h2>Auto-diagnosi menu</h2><p>Errore: ${escapeHtml(err.message)}</p>`);
    }
  });

  // ============ CLIENTI ============
  async function caricaClienti() {
    const tbody = document.getElementById("tabella-clienti");
    document.getElementById("dettaglio-cliente").innerHTML = "";
    try {
      const { clienti } = await apiFetch("/api/admin/clienti");
      if (!clienti.length) {
        tbody.innerHTML = `<tr><td colspan="5" class="vuoto">Nessun cliente ancora</td></tr>`;
        return;
      }
      tbody.innerHTML = clienti
        .map(
          (c) => `<tr>
        <td>${escapeHtml(c.nome)}</td>
        <td>${escapeHtml(c.telefono)}</td>
        <td>${c.numero_ordini}</td>
        <td>${Number(c.totale_speso).toFixed(2)} €</td>
        <td><button class="btn btn-secondario btn-piccolo" data-storico="${c.id}">Storico ordini</button></td>
      </tr>`
        )
        .join("");
      tbody.querySelectorAll("[data-storico]").forEach((btn) => btn.addEventListener("click", () => mostraStoricoCliente(btn.dataset.storico)));
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" class="vuoto">Errore: ${escapeHtml(err.message)}</td></tr>`;
    }
  }

  async function mostraStoricoCliente(id) {
    const cont = document.getElementById("dettaglio-cliente");
    const { cliente, ordini } = await apiFetch(`/api/admin/clienti/${id}`);
    cont.innerHTML = `
      <div class="card">
        <h3>Storico ordini — ${escapeHtml(cliente.nome)}</h3>
        ${ordini.length ? `<div class="tabella-scroll"><table><thead><tr><th>#</th><th>Data</th><th>Totale</th><th>Stato</th></tr></thead><tbody>
          ${ordini.map((o) => `<tr><td>#${o.id}</td><td>${formatData(o.creato_il)}</td><td>${o.totale.toFixed(2)} €</td><td><span class="chip-stato chip-${o.stato}">${CHIP_STATI[o.stato] || o.stato}</span></td></tr>`).join("")}
        </tbody></table></div>` : `<div class="vuoto">Nessun ordine</div>`}
      </div>`;
    cont.scrollIntoView({ behavior: "smooth" });
  }

  // ============ PROMO ============
  document.getElementById("btn-nuovo-promo").addEventListener("click", () => apriModalePromo(null));

  async function caricaPromo() {
    const tbody = document.getElementById("tabella-promo");
    try {
      const { promo } = await apiFetch("/api/admin/promo");
      window.AdminPromoState = promo;
      if (!promo.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="vuoto">Nessun codice sconto</td></tr>`;
        return;
      }
      tbody.innerHTML = promo
        .map(
          (p) => `<tr>
        <td><strong>${escapeHtml(p.codice)}</strong></td>
        <td>${p.tipo === "percentuale" ? "Percentuale" : "Fisso"}</td>
        <td>${p.tipo === "percentuale" ? p.valore + "%" : p.valore.toFixed(2) + " €"}</td>
        <td>${p.min_ordine.toFixed(2)} €</td>
        <td>${escapeHtml(p.scadenza || "—")}</td>
        <td>${p.attivo ? "✅" : "⛔️"}</td>
        <td><button class="btn btn-secondario btn-piccolo" data-modifica-promo="${p.id}">Modifica</button> <button class="btn btn-pericolo btn-piccolo" data-elimina-promo="${p.id}">Elimina</button></td>
      </tr>`
        )
        .join("");
      tbody.querySelectorAll("[data-modifica-promo]").forEach((btn) => btn.addEventListener("click", () => apriModalePromo(Number(btn.dataset.modificaPromo))));
      tbody.querySelectorAll("[data-elimina-promo]").forEach((btn) =>
        btn.addEventListener("click", async () => {
          if (!confirm("Eliminare questo codice sconto?")) return;
          await apiFetch(`/api/admin/promo/${btn.dataset.eliminaPromo}`, { method: "DELETE" });
          caricaPromo();
        })
      );
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="7" class="vuoto">Errore: ${escapeHtml(err.message)}</td></tr>`;
    }
  }

  function apriModalePromo(id) {
    const promo = id ? window.AdminPromoState.find((p) => p.id === id) : null;
    apriModale(`
      <h2>${promo ? "Modifica codice" : "Nuovo codice sconto"}</h2>
      <div class="form-grid due-col">
        <div><label>Codice</label><input id="promo-codice" value="${escapeHtml(promo?.codice || "")}"></div>
        <div><label>Tipo</label><select id="promo-tipo">
          <option value="percentuale" ${promo?.tipo === "percentuale" ? "selected" : ""}>Percentuale</option>
          <option value="fisso" ${promo?.tipo === "fisso" ? "selected" : ""}>Sconto fisso (€)</option>
        </select></div>
        <div><label>Valore</label><input id="promo-valore" type="number" step="0.01" value="${promo?.valore ?? ""}"></div>
        <div><label>Ordine minimo (€)</label><input id="promo-min" type="number" step="0.01" value="${promo?.min_ordine ?? 0}"></div>
        <div><label>Scadenza (AAAA-MM-GG, opzionale)</label><input id="promo-scadenza" value="${escapeHtml(promo?.scadenza || "")}"></div>
        ${promo ? `<div style="display:flex; align-items:center; gap:8px;"><input type="checkbox" id="promo-attivo" ${promo.attivo ? "checked" : ""} style="width:auto;"><label style="margin:0;">Attivo</label></div>` : ""}
      </div>
      <button class="btn btn-primario" id="promo-salva" style="margin-top:14px;">Salva</button>
    `);

    document.getElementById("promo-salva").addEventListener("click", async () => {
      const payload = {
        codice: document.getElementById("promo-codice").value.trim(),
        tipo: document.getElementById("promo-tipo").value,
        valore: Number(document.getElementById("promo-valore").value) || 0,
        min_ordine: Number(document.getElementById("promo-min").value) || 0,
        scadenza: document.getElementById("promo-scadenza").value.trim(),
      };
      if (!payload.codice) return mostraToast("Il codice è obbligatorio", "errore");
      if (promo) payload.attivo = document.getElementById("promo-attivo").checked;

      try {
        if (promo) await apiFetch(`/api/admin/promo/${promo.id}`, { method: "PUT", body: JSON.stringify(payload) });
        else await apiFetch("/api/admin/promo", { method: "POST", body: JSON.stringify(payload) });
        mostraToast("Codice salvato");
        chiudiModale();
        caricaPromo();
      } catch (err) {
        mostraToast(err.message, "errore");
      }
    });
  }

  // ============ IMPOSTAZIONI ============
  async function caricaImpostazioniInForm() {
    try {
      const { impostazioni } = await apiFetch("/api/admin/impostazioni");
      const form = document.getElementById("form-impostazioni");
      Object.entries(impostazioni).forEach(([chiave, valore]) => {
        const campo = form.elements[chiave];
        if (!campo) return;
        if (campo.type === "checkbox") campo.checked = valore === "1";
        else campo.value = valore;
      });
      document.getElementById("nav-magazzino").style.display = impostazioni.magazzino_attivo === "1" ? "flex" : "none";
    } catch (err) {
      console.warn("Impossibile caricare impostazioni", err);
    }
  }

  document.getElementById("form-impostazioni").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const dati = {};
    [...form.elements].forEach((el) => {
      if (!el.name) return;
      dati[el.name] = el.type === "checkbox" ? (el.checked ? "1" : "0") : el.value;
    });
    try {
      await apiFetch("/api/admin/impostazioni", { method: "PUT", body: JSON.stringify(dati) });
      mostraToast("Impostazioni salvate");
      document.getElementById("nav-magazzino").style.display = dati.magazzino_attivo === "1" ? "flex" : "none";
    } catch (err) {
      mostraToast(err.message, "errore");
    }
  });

  // ============ Notifiche nuovi ordini (polling) ============
  let ultimoIdOrdineNoto = null;
  async function avviaPolling() {
    setInterval(async () => {
      try {
        const { ordini } = await apiFetch("/api/admin/ordini?stato=nuovo");
        if (ordini.length) {
          const massimoId = Math.max(...ordini.map((o) => o.id));
          if (ultimoIdOrdineNoto !== null && massimoId > ultimoIdOrdineNoto) {
            document.getElementById("audio-notifica").play().catch(() => {});
            mostraToast("🔔 Nuovo ordine ricevuto!");
            caricaOrdini();
            caricaCucina();
          }
          ultimoIdOrdineNoto = massimoId;
        }
      } catch {
        /* silenzioso: non bloccare l'admin se il polling fallisce una volta */
      }
      if (window.AdminMagazzino) window.AdminMagazzino.aggiornaBadge();
    }, 20000);
  }

  verificaSessione();
})();
