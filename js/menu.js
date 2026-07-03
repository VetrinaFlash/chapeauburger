(function () {
  "use strict";

  const CATEGORIE_SENZA_RIMOZIONE = ["vini", "birre", "bibite"];
  const CHIAVE_CARRELLO = "cb_carrello";
  const WHATSAPP_ORDINI = "393337812938";

  const stato = {
    catalogo: { categorie: [] },
    carrello: caricaCarrello(),
    categoriaAttiva: null,
    modaleProdotto: null,
    selezioni: null,
  };

  const el = {
    tabs: document.getElementById("categorie-tabs"),
    container: document.getElementById("menu-container"),
    btnCarrello: document.getElementById("btn-carrello"),
    badgeCarrello: document.getElementById("badge-carrello"),
    overlayProdotto: document.getElementById("overlay-prodotto"),
    modalProdotto: document.getElementById("modal-prodotto"),
    drawerCarrello: document.getElementById("drawer-carrello"),
    overlayCarrello: document.getElementById("overlay-carrello"),
    toast: document.getElementById("toast"),
  };

  // ---------- Caricamento catalogo (API con fallback statico) ----------
  async function caricaMenu() {
    try {
      const resp = await fetch("/api/menu");
      if (!resp.ok) throw new Error("risposta non ok");
      const data = await resp.json();
      if (!data.categorie || !data.categorie.length) throw new Error("catalogo vuoto");
      stato.catalogo = data;
    } catch (err) {
      console.warn("Uso catalogo statico di fallback:", err);
      stato.catalogo = window.FALLBACK_MENU;
    }
    stato.categoriaAttiva = stato.catalogo.categorie[0]?.id || null;
    renderTabs();
    renderCategorie();
    mostraSoloCategoria(stato.categoriaAttiva);
  }

  function renderTabs() {
    el.tabs.innerHTML = stato.catalogo.categorie
      .map(
        (cat) => `
      <button class="tab-categoria ${cat.id === stato.categoriaAttiva ? "attiva" : ""}" data-cat="${cat.id}">
        ${cat.icona} ${escapeHtml(cat.nome)}
      </button>`
      )
      .join("");
    el.tabs.querySelectorAll(".tab-categoria").forEach((btn) => {
      btn.addEventListener("click", () => {
        stato.categoriaAttiva = btn.dataset.cat;
        renderTabs();
        mostraSoloCategoria(btn.dataset.cat);
        el.container.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  // Filtra: mostra SOLO la categoria selezionata, nasconde tutte le altre
  // (i tab erano solo un ancoraggio di scroll: su mobile con tante categorie
  // sembrava un elenco confuso invece di un vero filtro).
  function mostraSoloCategoria(catId) {
    el.container.querySelectorAll(".categoria-sezione").forEach((sezione) => {
      sezione.style.display = sezione.id === `sezione-${catId}` ? "block" : "none";
    });
  }

  function renderCategorie() {
    el.container.innerHTML = stato.catalogo.categorie
      .map(
        (cat) => `
      <section class="categoria-sezione" id="sezione-${cat.id}">
        <h2 class="categoria-titolo">${cat.icona} ${escapeHtml(cat.nome)}</h2>
        <div class="prodotti-grid">
          ${cat.prodotti
            .filter((p) => p.attivo !== false)
            .map((p) => renderCardProdotto(cat, p))
            .join("")}
        </div>
      </section>`
      )
      .join("");

    el.container.querySelectorAll("[data-apri-prodotto]").forEach((cardEl) => {
      cardEl.addEventListener("click", () => {
        const catId = cardEl.dataset.cat;
        const prodId = cardEl.dataset.prod;
        const cat = stato.catalogo.categorie.find((c) => c.id === catId);
        const prod = cat.prodotti.find((p) => String(p.id) === String(prodId));
        apriModalProdotto(cat, prod);
      });
    });
  }

  function renderCardProdotto(cat, p) {
    const prezzi = p.prezzi || [];
    const prezzoMin = Math.min(...prezzi.map((pr) => pr.prezzo));
    const daLabel = prezzi.length > 1 ? '<span class="da">da</span> ' : "";
    return `
      <div class="prodotto-card" data-apri-prodotto data-cat="${cat.id}" data-prod="${p.id}">
        ${p.immagine ? `<img src="${p.immagine}" alt="${escapeHtml(p.nome)}" loading="lazy" onerror="this.style.display='none'">` : ""}
        <div class="prodotto-card-info">
          <h3>${escapeHtml(p.nome)}</h3>
          ${p.descrizione ? `<p>${escapeHtml(p.descrizione)}</p>` : ""}
          <div class="prodotto-prezzo">${daLabel}${prezzoMin.toFixed(2)} €</div>
        </div>
        <button class="btn-aggiungi-rapido" aria-label="Apri ${escapeHtml(p.nome)}"><i class="fa-solid fa-plus"></i></button>
      </div>`;
  }

  // ---------- Modale prodotto ----------
  function apriModalProdotto(cat, prodotto) {
    stato.modaleProdotto = { cat, prodotto };
    stato.selezioni = {
      variante: prodotto.prezzi.length === 1 ? 0 : null,
      obbligatorie: {},
      multiple: {},
      ingredientiRimossi: new Set(),
      quantita: 1,
    };
    renderModalProdotto();
    el.overlayProdotto.classList.add("aperto");
  }

  function chiudiModalProdotto() {
    el.overlayProdotto.classList.remove("aperto");
    stato.modaleProdotto = null;
  }

  function ingredientiDaDescrizione(prodotto, categoriaId) {
    if (!prodotto.rimozione_ingredienti) return [];
    if (CATEGORIE_SENZA_RIMOZIONE.includes(categoriaId)) return [];
    if (!prodotto.descrizione) return [];
    return prodotto.descrizione
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function renderModalProdotto() {
    const { cat, prodotto } = stato.modaleProdotto;
    const sel = stato.selezioni;
    const multiVarianti = prodotto.prezzi.length > 1;
    const ingredienti = ingredientiDaDescrizione(prodotto, cat.id);

    let html = "";

    if (multiVarianti) {
      html += `
        <div class="gruppo-scelta" data-gruppo="variante">
          <div class="gruppo-scelta-titolo">Scegli il formato <span class="gruppo-scelta-hint obbligatorio">Obbligatorio</span></div>
          ${prodotto.prezzi
            .map(
              (pr, idx) => `
            <div class="opzione-riga">
              <label>
                <input type="radio" name="variante" value="${idx}" ${sel.variante === idx ? "checked" : ""}>
                ${escapeHtml(pr.variante)}
              </label>
              <span class="opzione-supplemento">${pr.prezzo.toFixed(2)} €</span>
            </div>`
            )
            .join("")}
        </div>`;
    } else if (!prodotto.descrizione) {
      html += `<p class="descrizione">&nbsp;</p>`;
    }

    (prodotto.scelte_obbligatorie || []).forEach((gruppo, gi) => {
      html += `
        <div class="gruppo-scelta" data-gruppo="obbligatoria-${gi}">
          <div class="gruppo-scelta-titolo">${escapeHtml(gruppo.nome)} <span class="gruppo-scelta-hint obbligatorio">Scegline uno</span></div>
          ${gruppo.opzioni
            .map(
              (op) => `
            <div class="opzione-riga">
              <label>
                <input type="radio" name="obbligatoria-${gi}" value="${escapeHtml(op.nome)}" ${sel.obbligatorie[gruppo.nome] === op.nome ? "checked" : ""}>
                ${escapeHtml(op.nome)}
              </label>
              ${op.supplemento ? `<span class="opzione-supplemento">+${op.supplemento.toFixed(2)} €</span>` : ""}
            </div>`
            )
            .join("")}
        </div>`;
    });

    (prodotto.scelte_multiple || []).forEach((gruppo, gi) => {
      const hint = gruppo.min > 0 ? `Scegline almeno ${gruppo.min}` : "Facoltativo";
      const hintClass = gruppo.min > 0 ? "obbligatorio" : "opzionale";
      html += `
        <div class="gruppo-scelta" data-gruppo="multipla-${gi}">
          <div class="gruppo-scelta-titolo">${escapeHtml(gruppo.nome)} <span class="gruppo-scelta-hint ${hintClass}">${hint}</span></div>
          ${gruppo.opzioni
            .map(
              (op) => `
            <div class="opzione-riga">
              <label>
                <input type="checkbox" data-multipla="${gi}" value="${escapeHtml(op.nome)}" ${(sel.multiple[gruppo.nome] || new Set()).has(op.nome) ? "checked" : ""}>
                ${escapeHtml(op.nome)}
              </label>
              ${op.supplemento ? `<span class="opzione-supplemento">+${op.supplemento.toFixed(2)} €</span>` : ""}
            </div>`
            )
            .join("")}
        </div>`;
    });

    if (ingredienti.length) {
      html += `
        <div class="gruppo-scelta" data-gruppo="ingredienti">
          <div class="gruppo-scelta-titolo">Rimuovi ingredienti <span class="gruppo-scelta-hint opzionale">Facoltativo e gratuito</span></div>
          ${ingredienti
            .map(
              (ing) => `
            <div class="opzione-riga rimuovi-ingrediente">
              <label>
                <input type="checkbox" data-ingrediente value="${escapeHtml(ing)}" ${sel.ingredientiRimossi.has(ing) ? "checked" : ""}>
                Senza ${escapeHtml(ing)}
              </label>
            </div>`
            )
            .join("")}
        </div>`;
    }

    document.getElementById("modal-prodotto-img").src = prodotto.immagine || "";
    document.getElementById("modal-prodotto-img").style.display = prodotto.immagine ? "block" : "none";
    document.getElementById("modal-prodotto-nome").textContent = prodotto.nome;
    document.getElementById("modal-prodotto-descrizione").textContent = multiVarianti ? "" : prodotto.descrizione || "";
    document.getElementById("modal-prodotto-scelte").innerHTML = html;
    document.getElementById("modal-prodotto-qta").textContent = sel.quantita;
    aggiornaPrezzoModal();
    collegaEventiModal();
  }

  function collegaEventiModal() {
    const scelteEl = document.getElementById("modal-prodotto-scelte");
    scelteEl.querySelectorAll('input[name="variante"]').forEach((input) => {
      input.addEventListener("change", () => {
        stato.selezioni.variante = Number(input.value);
        aggiornaPrezzoModal();
      });
    });
    scelteEl.querySelectorAll('input[name^="obbligatoria-"]').forEach((input) => {
      input.addEventListener("change", () => {
        const gi = Number(input.name.split("-")[1]);
        const gruppo = stato.modaleProdotto.prodotto.scelte_obbligatorie[gi];
        stato.selezioni.obbligatorie[gruppo.nome] = input.value;
        aggiornaPrezzoModal();
      });
    });
    scelteEl.querySelectorAll("input[data-multipla]").forEach((input) => {
      input.addEventListener("change", () => {
        const gi = Number(input.dataset.multipla);
        const gruppo = stato.modaleProdotto.prodotto.scelte_multiple[gi];
        if (!stato.selezioni.multiple[gruppo.nome]) stato.selezioni.multiple[gruppo.nome] = new Set();
        const set = stato.selezioni.multiple[gruppo.nome];
        if (input.checked) set.add(input.value);
        else set.delete(input.value);
        aggiornaPrezzoModal();
      });
    });
    scelteEl.querySelectorAll("input[data-ingrediente]").forEach((input) => {
      input.addEventListener("change", () => {
        if (input.checked) stato.selezioni.ingredientiRimossi.add(input.value);
        else stato.selezioni.ingredientiRimossi.delete(input.value);
      });
    });
  }

  function selezioniValide() {
    const { prodotto } = stato.modaleProdotto;
    const sel = stato.selezioni;

    if (prodotto.prezzi.length > 1 && sel.variante === null) return false;

    for (const gruppo of prodotto.scelte_obbligatorie || []) {
      if (!sel.obbligatorie[gruppo.nome]) return false;
    }

    for (const gruppo of prodotto.scelte_multiple || []) {
      const scelte = sel.multiple[gruppo.nome] || new Set();
      if (gruppo.min && scelte.size < gruppo.min) return false;
      if (gruppo.max && scelte.size > gruppo.max) return false;
    }

    return true;
  }

  function calcolaPrezzoUnitario() {
    const { prodotto } = stato.modaleProdotto;
    const sel = stato.selezioni;
    let prezzo = 0;

    if (prodotto.prezzi.length > 1) {
      prezzo += sel.variante !== null ? prodotto.prezzi[sel.variante].prezzo : 0;
    } else {
      prezzo += prodotto.prezzi[0].prezzo;
    }

    for (const gruppo of prodotto.scelte_obbligatorie || []) {
      const nomeScelto = sel.obbligatorie[gruppo.nome];
      const opzione = gruppo.opzioni.find((o) => o.nome === nomeScelto);
      if (opzione) prezzo += opzione.supplemento || 0;
    }

    for (const gruppo of prodotto.scelte_multiple || []) {
      const scelte = sel.multiple[gruppo.nome] || new Set();
      for (const nome of scelte) {
        const opzione = gruppo.opzioni.find((o) => o.nome === nome);
        if (opzione) prezzo += opzione.supplemento || 0;
      }
    }

    return prezzo;
  }

  function aggiornaPrezzoModal() {
    const prezzoUnitario = calcolaPrezzoUnitario();
    const totale = prezzoUnitario * stato.selezioni.quantita;
    const btn = document.getElementById("btn-aggiungi-carrello");
    btn.disabled = !selezioniValide();
    btn.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Aggiungi al carrello · ${totale.toFixed(2)} €`;
  }

  function descriviSelezioni() {
    const { prodotto } = stato.modaleProdotto;
    const sel = stato.selezioni;
    const parti = [];

    if (prodotto.prezzi.length > 1 && sel.variante !== null) {
      parti.push(prodotto.prezzi[sel.variante].variante);
    }
    for (const gruppo of prodotto.scelte_obbligatorie || []) {
      if (sel.obbligatorie[gruppo.nome]) parti.push(`${gruppo.nome}: ${sel.obbligatorie[gruppo.nome]}`);
    }
    for (const gruppo of prodotto.scelte_multiple || []) {
      const scelte = [...(sel.multiple[gruppo.nome] || [])];
      if (scelte.length) parti.push(`${gruppo.nome}: ${scelte.join(", ")}`);
    }
    if (sel.ingredientiRimossi.size) {
      parti.push(`Senza: ${[...sel.ingredientiRimossi].join(", ")}`);
    }
    return parti;
  }

  // ---------- Carrello ----------
  function caricaCarrello() {
    try {
      return JSON.parse(localStorage.getItem(CHIAVE_CARRELLO)) || [];
    } catch {
      return [];
    }
  }

  function salvaCarrello() {
    localStorage.setItem(CHIAVE_CARRELLO, JSON.stringify(stato.carrello));
    aggiornaBadgeCarrello();
  }

  function aggiornaBadgeCarrello() {
    const totaleArticoli = stato.carrello.reduce((acc, r) => acc + r.quantita, 0);
    el.badgeCarrello.textContent = totaleArticoli;
    el.badgeCarrello.style.display = totaleArticoli > 0 ? "flex" : "none";
  }

  function aggiungiAlCarrello() {
    if (!selezioniValide()) return;
    const { prodotto } = stato.modaleProdotto;
    const prezzoUnitario = calcolaPrezzoUnitario();
    const sel = stato.selezioni;

    stato.carrello.push({
      id_riga: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      prodotto_id: prodotto.id,
      nome: prodotto.nome,
      dettagli: descriviSelezioni(),
      quantita: sel.quantita,
      prezzo_unitario: prezzoUnitario,
      prezzo_totale: prezzoUnitario,
    });

    salvaCarrello();
    chiudiModalProdotto();
    mostraToast(`${prodotto.nome} aggiunto al carrello`);
  }

  function renderCarrello() {
    const body = document.getElementById("drawer-carrello-body");
    if (stato.carrello.length === 0) {
      body.innerHTML = `<div class="carrello-vuoto"><i class="fa-solid fa-cart-shopping" style="font-size:2rem;"></i><p>Il carrello è vuoto</p></div>`;
    } else {
      body.innerHTML = stato.carrello
        .map(
          (riga, idx) => `
        <div class="riga-carrello">
          <div class="riga-carrello-top">
            <span>${escapeHtml(riga.nome)}</span>
            <span>${(riga.prezzo_totale * riga.quantita).toFixed(2)} €</span>
          </div>
          ${riga.dettagli.length ? `<div class="dettagli">${riga.dettagli.map(escapeHtml).join(" · ")}</div>` : ""}
          <div class="riga-carrello-azioni">
            <div class="riga-carrello-qta">
              <button class="qta-btn" data-azione="meno" data-idx="${idx}">−</button>
              <span class="qta-valore">${riga.quantita}</span>
              <button class="qta-btn" data-azione="piu" data-idx="${idx}">+</button>
            </div>
            <button class="riga-carrello-rimuovi" data-azione="rimuovi" data-idx="${idx}">Rimuovi</button>
          </div>
        </div>`
        )
        .join("");
    }

    const subtotale = stato.carrello.reduce((acc, r) => acc + r.prezzo_totale * r.quantita, 0);
    document.getElementById("carrello-subtotale").textContent = subtotale.toFixed(2) + " €";

    body.querySelectorAll("[data-azione]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.idx);
        if (btn.dataset.azione === "piu") stato.carrello[idx].quantita++;
        if (btn.dataset.azione === "meno") {
          stato.carrello[idx].quantita--;
          if (stato.carrello[idx].quantita <= 0) stato.carrello.splice(idx, 1);
        }
        if (btn.dataset.azione === "rimuovi") stato.carrello.splice(idx, 1);
        salvaCarrello();
        renderCarrello();
      });
    });
  }

  function apriCarrello() {
    renderCarrello();
    el.drawerCarrello.classList.add("aperto");
    el.overlayCarrello.classList.add("aperto");
  }
  function chiudiCarrello() {
    el.drawerCarrello.classList.remove("aperto");
    el.overlayCarrello.classList.remove("aperto");
  }

  // ---------- Checkout ----------
  async function inviaOrdine(ev) {
    ev.preventDefault();
    if (stato.carrello.length === 0) return;

    const form = ev.target;
    const nome = form.nome.value.trim();
    const telefono = form.telefono.value.trim();
    const tipo = form.dataset.tipo || "asporto";
    const indirizzo = form.indirizzo.value.trim();
    const note = form.note.value.trim();
    const promoCodice = form.promo_codice.value.trim();

    const erroreEl = document.getElementById("errore-checkout");
    if (!nome || !telefono) {
      erroreEl.textContent = "Nome e telefono sono obbligatori.";
      erroreEl.classList.add("visibile");
      return;
    }
    if (tipo === "domicilio" && !indirizzo) {
      erroreEl.textContent = "Inserisci l'indirizzo per la consegna a domicilio.";
      erroreEl.classList.add("visibile");
      return;
    }
    erroreEl.classList.remove("visibile");

    const payload = {
      cliente: { nome, telefono, indirizzo },
      tipo,
      note,
      promo_codice: promoCodice,
      items: stato.carrello,
    };

    const btnInvia = document.getElementById("btn-invia-ordine");
    btnInvia.disabled = true;
    btnInvia.textContent = "Invio in corso...";

    let ordineId = null;
    try {
      const resp = await fetch("/api/ordini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (resp.ok) ordineId = data.ordine_id;
    } catch (err) {
      console.warn("Impossibile salvare l'ordine su D1, procedo comunque con WhatsApp:", err);
    }

    const testoWhatsapp = costruisciTestoWhatsapp(payload, ordineId);
    const linkWhatsapp = `https://wa.me/${WHATSAPP_ORDINI}?text=${encodeURIComponent(testoWhatsapp)}`;

    localStorage.removeItem(CHIAVE_CARRELLO);
    window.location.href = ordineId
      ? `successo.html?ordine=${ordineId}&wa=${encodeURIComponent(linkWhatsapp)}`
      : `successo.html?wa=${encodeURIComponent(linkWhatsapp)}`;
  }

  function costruisciTestoWhatsapp(payload, ordineId) {
    const righe = payload.items.map((r) => {
      let riga = `• ${r.quantita}x ${r.nome}`;
      if (r.dettagli.length) riga += ` (${r.dettagli.join(", ")})`;
      riga += ` — ${(r.prezzo_totale * r.quantita).toFixed(2)} €`;
      return riga;
    });
    const subtotale = payload.items.reduce((acc, r) => acc + r.prezzo_totale * r.quantita, 0);

    let testo = `Nuovo ordine Chapeau Burger${ordineId ? " #" + ordineId : ""}\n\n`;
    testo += righe.join("\n") + "\n\n";
    testo += `Totale: ${subtotale.toFixed(2)} €\n\n`;
    testo += `Cliente: ${payload.cliente.nome}\nTelefono: ${payload.cliente.telefono}\n`;
    testo += `Tipo: ${payload.tipo === "domicilio" ? "Consegna a domicilio" : "Asporto"}\n`;
    if (payload.tipo === "domicilio") testo += `Indirizzo: ${payload.cliente.indirizzo}\n`;
    if (payload.note) testo += `Note: ${payload.note}\n`;
    if (payload.promo_codice) testo += `Codice promo: ${payload.promo_codice}\n`;
    return testo;
  }

  // ---------- Utility ----------
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function mostraToast(messaggio) {
    el.toast.textContent = messaggio;
    el.toast.classList.add("visibile");
    setTimeout(() => el.toast.classList.remove("visibile"), 2200);
  }

  // ---------- Collegamento eventi statici ----------
  document.getElementById("modal-chiudi").addEventListener("click", chiudiModalProdotto);
  el.overlayProdotto.addEventListener("click", (e) => {
    if (e.target === el.overlayProdotto) chiudiModalProdotto();
  });
  document.getElementById("qta-meno").addEventListener("click", () => {
    if (stato.selezioni.quantita > 1) stato.selezioni.quantita--;
    document.getElementById("modal-prodotto-qta").textContent = stato.selezioni.quantita;
    aggiornaPrezzoModal();
  });
  document.getElementById("qta-piu").addEventListener("click", () => {
    stato.selezioni.quantita++;
    document.getElementById("modal-prodotto-qta").textContent = stato.selezioni.quantita;
    aggiornaPrezzoModal();
  });
  document.getElementById("btn-aggiungi-carrello").addEventListener("click", aggiungiAlCarrello);

  el.btnCarrello.addEventListener("click", apriCarrello);
  document.getElementById("drawer-chiudi").addEventListener("click", chiudiCarrello);
  el.overlayCarrello.addEventListener("click", chiudiCarrello);

  document.querySelectorAll(".tipo-consegna button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tipo-consegna button").forEach((b) => b.classList.remove("attivo"));
      btn.classList.add("attivo");
      const form = document.getElementById("form-checkout");
      form.dataset.tipo = btn.dataset.tipo;
      document.getElementById("campo-indirizzo").style.display = btn.dataset.tipo === "domicilio" ? "block" : "none";
    });
  });

  document.getElementById("form-checkout").addEventListener("submit", inviaOrdine);

  aggiornaBadgeCarrello();
  caricaMenu();
})();
