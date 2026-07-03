(function () {
  "use strict";

  const CHIAVE_CODICE = "cb_staff_codice";
  let materiePrime = [];
  let richiesta = []; // [{ materia_prima_id, nome, reparto, unita_misura, quantita }]

  const el = {
    schermataLogin: document.getElementById("schermata-login-staff"),
    appStaff: document.getElementById("app-staff"),
    inputRicerca: document.getElementById("input-ricerca"),
    risultati: document.getElementById("risultati-ricerca"),
    richiestaFlottante: document.getElementById("richiesta-flottante"),
    contatoreRichiesta: document.getElementById("contatore-richiesta"),
    overlayRichiesta: document.getElementById("overlay-richiesta"),
    listaRichiesta: document.getElementById("lista-richiesta"),
    toast: document.getElementById("toast-staff"),
  };

  function codiceStaff() {
    return sessionStorage.getItem(CHIAVE_CODICE) || "";
  }

  async function apiStaff(url, opts = {}) {
    const resp = await fetch(url, {
      ...opts,
      headers: { "Content-Type": "application/json", "X-Staff-Code": codiceStaff(), ...(opts.headers || {}) },
    });
    let data = null;
    try {
      data = await resp.json();
    } catch {
      data = null;
    }
    if (!resp.ok) throw new Error((data && data.errore) || `Errore ${resp.status}`);
    return data;
  }

  function mostraToast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add("visibile");
    setTimeout(() => el.toast.classList.remove("visibile"), 2200);
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // ---------- Login ----------
  document.getElementById("form-login-staff").addEventListener("submit", async (e) => {
    e.preventDefault();
    const codice = document.getElementById("input-codice-staff").value.trim();
    const erroreEl = document.getElementById("login-errore-staff");
    try {
      sessionStorage.setItem(CHIAVE_CODICE, codice);
      await apiStaff("/api/staff/login", { method: "POST", body: JSON.stringify({ codice }) });
      mostraApp();
    } catch (err) {
      sessionStorage.removeItem(CHIAVE_CODICE);
      erroreEl.textContent = err.message || "Codice non valido";
    }
  });

  async function mostraApp() {
    el.schermataLogin.style.display = "none";
    el.appStaff.classList.add("attivo");
    try {
      const data = await apiStaff("/api/staff/materie-prime");
      materiePrime = data.materie_prime;
      renderRisultati(materiePrime);
    } catch (err) {
      el.risultati.innerHTML = `<p class="vuoto-staff">Errore nel caricamento: ${escapeHtml(err.message)}</p>`;
    }
  }

  async function verificaCodiceSalvato() {
    if (!codiceStaff()) return;
    try {
      await apiStaff("/api/staff/login", { method: "POST", body: JSON.stringify({ codice: codiceStaff() }) });
      mostraApp();
    } catch {
      sessionStorage.removeItem(CHIAVE_CODICE);
    }
  }

  // ---------- Ricerca (input stabile: MAI ricreare l'elemento input mentre si digita,
  // altrimenti su mobile la tastiera si chiude/riapre ad ogni carattere) ----------
  el.inputRicerca.addEventListener("input", () => {
    const query = el.inputRicerca.value.trim().toLowerCase();
    const filtrate = query
      ? materiePrime.filter((m) => m.nome.toLowerCase().includes(query) || m.reparto.toLowerCase().includes(query))
      : materiePrime;
    renderRisultati(filtrate);
  });

  function renderRisultati(lista) {
    if (!lista.length) {
      el.risultati.innerHTML = `<p class="vuoto-staff">Nessun risultato</p>`;
      return;
    }
    const perReparto = {};
    lista.forEach((m) => {
      if (!perReparto[m.reparto]) perReparto[m.reparto] = [];
      perReparto[m.reparto].push(m);
    });

    el.risultati.innerHTML = Object.entries(perReparto)
      .map(
        ([reparto, materie]) => `
      <div class="reparto-titolo">${escapeHtml(reparto)}</div>
      ${materie
        .map(
          (m) => `
        <div class="materia-riga">
          <div>
            <div class="nome">${escapeHtml(m.nome)}</div>
            <div class="um">${escapeHtml(m.unita_misura)}</div>
          </div>
          <button data-aggiungi="${m.id}" aria-label="Aggiungi ${escapeHtml(m.nome)}"><i class="fa-solid fa-plus"></i></button>
        </div>`
        )
        .join("")}`
      )
      .join("");

    el.risultati.querySelectorAll("[data-aggiungi]").forEach((btn) => {
      btn.addEventListener("click", () => aggiungiAllaRichiesta(Number(btn.dataset.aggiungi)));
    });
  }

  function aggiungiAllaRichiesta(materiaPrimaId) {
    const materia = materiePrime.find((m) => m.id === materiaPrimaId);
    const esistente = richiesta.find((r) => r.materia_prima_id === materiaPrimaId);
    if (esistente) esistente.quantita++;
    else richiesta.push({ materia_prima_id: materia.id, nome: materia.nome, reparto: materia.reparto, unita_misura: materia.unita_misura, quantita: 1 });
    aggiornaContatoreRichiesta();
    mostraToast(`${materia.nome} aggiunto`);
  }

  function aggiornaContatoreRichiesta() {
    const totale = richiesta.reduce((acc, r) => acc + r.quantita, 0);
    el.contatoreRichiesta.textContent = totale;
    el.richiestaFlottante.classList.toggle("visibile", totale > 0);
  }

  // ---------- Pannello richiesta ----------
  document.getElementById("btn-apri-richiesta").addEventListener("click", apriPannelloRichiesta);
  document.getElementById("btn-chiudi-richiesta").addEventListener("click", () => el.overlayRichiesta.classList.remove("aperto"));
  el.overlayRichiesta.addEventListener("click", (e) => {
    if (e.target === el.overlayRichiesta) el.overlayRichiesta.classList.remove("aperto");
  });

  function apriPannelloRichiesta() {
    renderListaRichiesta();
    el.overlayRichiesta.classList.add("aperto");
  }

  function renderListaRichiesta() {
    if (!richiesta.length) {
      el.listaRichiesta.innerHTML = `<p class="vuoto-staff">Nessun prodotto selezionato</p>`;
      return;
    }
    el.listaRichiesta.innerHTML = richiesta
      .map(
        (r, idx) => `
      <div class="riga-richiesta">
        <span>${escapeHtml(r.nome)} <small style="opacity:0.6;">(${escapeHtml(r.reparto)})</small></span>
        <div class="qta-controlli">
          <button data-meno="${idx}">−</button>
          <span>${r.quantita} ${escapeHtml(r.unita_misura)}</span>
          <button data-piu="${idx}">+</button>
        </div>
      </div>`
      )
      .join("");

    el.listaRichiesta.querySelectorAll("[data-piu]").forEach((btn) => btn.addEventListener("click", () => {
      richiesta[Number(btn.dataset.piu)].quantita++;
      renderListaRichiesta();
      aggiornaContatoreRichiesta();
    }));
    el.listaRichiesta.querySelectorAll("[data-meno]").forEach((btn) => btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.meno);
      richiesta[idx].quantita--;
      if (richiesta[idx].quantita <= 0) richiesta.splice(idx, 1);
      renderListaRichiesta();
      aggiornaContatoreRichiesta();
    }));
  }

  document.getElementById("form-invia-richiesta").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!richiesta.length) return mostraToast("Aggiungi almeno un prodotto");

    const creatoDa = document.getElementById("input-nome-staff").value.trim() || "Staff";
    const note = document.getElementById("input-note-staff").value.trim();

    try {
      await apiStaff("/api/staff/ordini", {
        method: "POST",
        body: JSON.stringify({
          creato_da: creatoDa,
          note,
          items: richiesta.map((r) => ({ materia_prima_id: r.materia_prima_id, quantita: r.quantita, note: "" })),
        }),
      });
      mostraToast("Richiesta inviata all'admin!");
      richiesta = [];
      aggiornaContatoreRichiesta();
      el.overlayRichiesta.classList.remove("aperto");
      document.getElementById("input-note-staff").value = "";
    } catch (err) {
      mostraToast("Errore: " + err.message);
    }
  });

  verificaCodiceSalvato();
})();
