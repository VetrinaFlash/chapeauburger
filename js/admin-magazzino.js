(function () {
  "use strict";

  let fragmentCaricato = false;
  let fornitoriCache = [];
  let materiePrimeCache = [];
  const STATI_MAGAZZINO = { nuovo: "Nuovo", inviato: "Inviato", completato: "Completato" };
  let filtroOrdiniMagazzino = "";
  let tabAttivo = "ordini-staff";

  function api(url, opts) {
    return window.AdminApp.apiFetch(url, opts);
  }
  function toast(msg, tipo) {
    return window.AdminApp.mostraToast(msg, tipo);
  }
  function esc(str) {
    return window.AdminApp.escapeHtml(str);
  }
  function formatData(iso) {
    return window.AdminApp.formatData(iso);
  }

  async function caricaFragment() {
    if (fragmentCaricato) return;
    const resp = await fetch("admin-magazzino.html");
    const html = await resp.text();
    document.getElementById("contenitore-magazzino").innerHTML = html;
    fragmentCaricato = true;
    collegaEventiFragment();
  }

  function collegaEventiFragment() {
    document.getElementById("magazzino-sub-nav").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-tab]");
      if (!btn) return;
      attivaTab(btn.dataset.tab);
    });

    document.getElementById("magazzino-filtri-ordini").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-stato]");
      if (!btn) return;
      document.querySelectorAll("#magazzino-filtri-ordini button").forEach((b) => b.classList.remove("attivo"));
      btn.classList.add("attivo");
      filtroOrdiniMagazzino = btn.dataset.stato;
      caricaOrdiniStaff();
    });

    document.getElementById("btn-nuovo-fornitore").addEventListener("click", () => apriModaleFornitore(null));
    document.getElementById("btn-nuova-materia").addEventListener("click", () => apriModaleMateria(null));
  }

  function attivaTab(nome) {
    tabAttivo = nome;
    document.querySelectorAll("#magazzino-sub-nav button[data-tab]").forEach((b) => b.classList.toggle("attivo", b.dataset.tab === nome));
    document.querySelectorAll(".magazzino-tab").forEach((t) => (t.style.display = t.id === `magazzino-tab-${nome}` ? "block" : "none"));

    if (nome === "ordini-staff") caricaOrdiniStaff();
    if (nome === "fornitori") caricaFornitori();
    if (nome === "materie-prime") caricaMateriePrime();
    if (nome === "contabilita") caricaContabilita();
  }

  // ============ ORDINI STAFF ============
  async function caricaOrdiniStaff() {
    const cont = document.getElementById("magazzino-lista-ordini");
    if (!cont) return;
    try {
      const [{ ordini }, { fornitori }] = await Promise.all([
        api(filtroOrdiniMagazzino ? `/api/admin/magazzino/ordini?stato=${filtroOrdiniMagazzino}` : "/api/admin/magazzino/ordini"),
        api("/api/admin/magazzino/fornitori"),
      ]);
      fornitoriCache = fornitori;

      if (!ordini.length) {
        cont.innerHTML = `<div class="vuoto">Nessun ordine materie prime dallo staff</div>`;
        return;
      }

      cont.innerHTML = ordini
        .map((o) => {
          const perReparto = {};
          o.items.forEach((it) => {
            if (!perReparto[it.reparto]) perReparto[it.reparto] = [];
            perReparto[it.reparto].push(it);
          });

          const gruppiHtml = Object.entries(perReparto)
            .map(([reparto, items]) => {
              const fornitoreReparto = fornitori.find((f) => f.reparto === reparto && f.attivo);
              const testo = costruisciTestoOrdineFornitore(reparto, items, o);
              const link = fornitoreReparto?.whatsapp
                ? `https://wa.me/${fornitoreReparto.whatsapp}?text=${encodeURIComponent(testo)}`
                : null;
              return `
                <div style="border-top:1px dashed var(--bordo); padding-top:10px; margin-top:10px;">
                  <strong>${esc(reparto)}</strong>${fornitoreReparto ? ` — ${esc(fornitoreReparto.nome)}` : " — <em>nessun fornitore assegnato a questo reparto</em>"}
                  <ul style="padding-left:18px; margin:6px 0;">
                    ${items.map((it) => `<li>${it.quantita} ${esc(it.unita_misura)} — ${esc(it.nome)}${it.note ? ` (${esc(it.note)})` : ""}</li>`).join("")}
                  </ul>
                  ${link ? `<a class="btn btn-secondario btn-piccolo" href="${link}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Invia a ${esc(fornitoreReparto.nome)}</a>` : ""}
                </div>`;
            })
            .join("");

          return `
          <div class="card">
            <div class="card-header">
              <h3>Richiesta #${o.id} — ${esc(o.creato_da)}</h3>
              <span class="chip-stato chip-${o.stato === "completato" ? "consegnato" : o.stato === "inviato" ? "in_preparazione" : "nuovo"}">${STATI_MAGAZZINO[o.stato]}</span>
            </div>
            <p style="font-size:0.85rem; opacity:0.65;">${formatData(o.creato_il)}</p>
            ${gruppiHtml}
            <div style="display:flex; gap:8px; margin-top:14px;">
              ${o.stato === "nuovo" ? `<button class="btn btn-primario btn-piccolo" data-avanza-magazzino="${o.id}" data-nuovo-stato="inviato">Segna come inviato</button>` : ""}
              ${o.stato === "inviato" ? `<button class="btn btn-primario btn-piccolo" data-avanza-magazzino="${o.id}" data-nuovo-stato="completato">Segna come completato</button>` : ""}
            </div>
          </div>`;
        })
        .join("");

      cont.querySelectorAll("[data-avanza-magazzino]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          try {
            await api(`/api/admin/magazzino/ordini/${btn.dataset.avanzaMagazzino}`, { method: "PUT", body: JSON.stringify({ stato: btn.dataset.nuovoStato }) });
            caricaOrdiniStaff();
            aggiornaBadge();
          } catch (err) {
            toast(err.message, "errore");
          }
        });
      });
    } catch (err) {
      cont.innerHTML = `<div class="vuoto">Errore: ${esc(err.message)}</div>`;
    }
  }

  function costruisciTestoOrdineFornitore(reparto, items, ordine) {
    let testo = `Ordine materie prime — Reparto ${reparto}\n\n`;
    testo += items.map((it) => `• ${it.quantita} ${it.unita_misura} — ${it.nome}${it.note ? ` (${it.note})` : ""}`).join("\n");
    testo += `\n\nRichiesto da: ${ordine.creato_da || "Staff"}\nGrazie, Chapeau Burger`;
    return testo;
  }

  // ============ FORNITORI ============
  async function caricaFornitori() {
    const tbody = document.getElementById("tabella-fornitori");
    try {
      const { fornitori } = await api("/api/admin/magazzino/fornitori");
      fornitoriCache = fornitori;
      if (!fornitori.length) {
        tbody.innerHTML = `<tr><td colspan="5" class="vuoto">Nessun fornitore</td></tr>`;
        return;
      }
      tbody.innerHTML = fornitori
        .map(
          (f) => `<tr>
        <td>${esc(f.nome)}</td>
        <td>${esc(f.reparto)}</td>
        <td>${esc(f.whatsapp)}</td>
        <td>${f.attivo ? "✅" : "⛔️"}</td>
        <td><button class="btn btn-secondario btn-piccolo" data-modifica-fornitore="${f.id}">Modifica</button> <button class="btn btn-pericolo btn-piccolo" data-elimina-fornitore="${f.id}">Elimina</button></td>
      </tr>`
        )
        .join("");
      tbody.querySelectorAll("[data-modifica-fornitore]").forEach((btn) => btn.addEventListener("click", () => apriModaleFornitore(Number(btn.dataset.modificaFornitore))));
      tbody.querySelectorAll("[data-elimina-fornitore]").forEach((btn) =>
        btn.addEventListener("click", async () => {
          if (!confirm("Eliminare questo fornitore?")) return;
          await api(`/api/admin/magazzino/fornitori/${btn.dataset.eliminaFornitore}`, { method: "DELETE" });
          caricaFornitori();
        })
      );
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" class="vuoto">Errore: ${esc(err.message)}</td></tr>`;
    }
  }

  function apriModaleFornitore(id) {
    const fornitore = id ? fornitoriCache.find((f) => f.id === id) : null;
    window.AdminApp.apriModale(`
      <h2>${fornitore ? "Modifica fornitore" : "Nuovo fornitore"}</h2>
      <div class="form-grid">
        <div><label>Nome fornitore</label><input id="forn-nome" value="${esc(fornitore?.nome || "")}"></div>
        <div><label>Reparto</label><input id="forn-reparto" value="${esc(fornitore?.reparto || "")}" placeholder="Es. Carne, Ortofrutta..."></div>
        <div><label>Numero WhatsApp (con prefisso, es. 393331234567)</label><input id="forn-whatsapp" value="${esc(fornitore?.whatsapp || "")}"></div>
        ${fornitore ? `<div style="display:flex; align-items:center; gap:8px;"><input type="checkbox" id="forn-attivo" ${fornitore.attivo ? "checked" : ""} style="width:auto;"><label style="margin:0;">Attivo</label></div>` : ""}
      </div>
      <button class="btn btn-primario" id="forn-salva" style="margin-top:14px;">Salva</button>
    `);
    document.getElementById("forn-salva").addEventListener("click", async () => {
      const payload = {
        nome: document.getElementById("forn-nome").value.trim(),
        reparto: document.getElementById("forn-reparto").value.trim(),
        whatsapp: document.getElementById("forn-whatsapp").value.trim(),
      };
      if (!payload.nome || !payload.reparto) return toast("Nome e reparto sono obbligatori", "errore");
      if (fornitore) payload.attivo = document.getElementById("forn-attivo").checked;
      try {
        if (fornitore) await api(`/api/admin/magazzino/fornitori/${fornitore.id}`, { method: "PUT", body: JSON.stringify(payload) });
        else await api("/api/admin/magazzino/fornitori", { method: "POST", body: JSON.stringify(payload) });
        toast("Fornitore salvato");
        window.AdminApp.chiudiModale();
        caricaFornitori();
      } catch (err) {
        toast(err.message, "errore");
      }
    });
  }

  // ============ MATERIE PRIME ============
  async function caricaMateriePrime() {
    const tbody = document.getElementById("tabella-materie-prime");
    try {
      const { materie_prime } = await api("/api/admin/magazzino/materie-prime");
      materiePrimeCache = materie_prime;
      if (!materie_prime.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="vuoto">Nessuna materia prima</td></tr>`;
        return;
      }
      tbody.innerHTML = materie_prime
        .map(
          (m) => `<tr>
        <td>${esc(m.nome)}</td>
        <td>${esc(m.reparto)}</td>
        <td>${esc(m.unita_misura)}</td>
        <td>${m.prezzo_riferimento.toFixed(2)} €</td>
        <td>${m.attivo ? "✅" : "⛔️"}</td>
        <td><button class="btn btn-secondario btn-piccolo" data-modifica-materia="${m.id}">Modifica</button> <button class="btn btn-pericolo btn-piccolo" data-elimina-materia="${m.id}">Elimina</button></td>
      </tr>`
        )
        .join("");
      tbody.querySelectorAll("[data-modifica-materia]").forEach((btn) => btn.addEventListener("click", () => apriModaleMateria(Number(btn.dataset.modificaMateria))));
      tbody.querySelectorAll("[data-elimina-materia]").forEach((btn) =>
        btn.addEventListener("click", async () => {
          if (!confirm("Eliminare questa materia prima?")) return;
          await api(`/api/admin/magazzino/materie-prime/${btn.dataset.eliminaMateria}`, { method: "DELETE" });
          caricaMateriePrime();
        })
      );
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="6" class="vuoto">Errore: ${esc(err.message)}</td></tr>`;
    }
  }

  function apriModaleMateria(id) {
    const materia = id ? materiePrimeCache.find((m) => m.id === id) : null;
    window.AdminApp.apriModale(`
      <h2>${materia ? "Modifica materia prima" : "Nuova materia prima"}</h2>
      <div class="form-grid due-col">
        <div><label>Nome</label><input id="mat-nome" value="${esc(materia?.nome || "")}"></div>
        <div><label>Reparto</label><input id="mat-reparto" value="${esc(materia?.reparto || "")}"></div>
        <div><label>Unità di misura</label><input id="mat-um" value="${esc(materia?.unita_misura || "pz")}"></div>
        <div><label>Prezzo di riferimento (€)</label><input id="mat-prezzo" type="number" step="0.01" value="${materia?.prezzo_riferimento ?? 0}"></div>
        ${materia ? `<div style="display:flex; align-items:center; gap:8px;"><input type="checkbox" id="mat-attivo" ${materia.attivo ? "checked" : ""} style="width:auto;"><label style="margin:0;">Attivo</label></div>` : ""}
      </div>
      <button class="btn btn-primario" id="mat-salva" style="margin-top:14px;">Salva</button>
    `);
    document.getElementById("mat-salva").addEventListener("click", async () => {
      const payload = {
        nome: document.getElementById("mat-nome").value.trim(),
        reparto: document.getElementById("mat-reparto").value.trim(),
        unita_misura: document.getElementById("mat-um").value.trim() || "pz",
        prezzo_riferimento: Number(document.getElementById("mat-prezzo").value) || 0,
      };
      if (!payload.nome || !payload.reparto) return toast("Nome e reparto sono obbligatori", "errore");
      if (materia) payload.attivo = document.getElementById("mat-attivo").checked;
      try {
        if (materia) await api(`/api/admin/magazzino/materie-prime/${materia.id}`, { method: "PUT", body: JSON.stringify(payload) });
        else await api("/api/admin/magazzino/materie-prime", { method: "POST", body: JSON.stringify(payload) });
        toast("Materia prima salvata");
        window.AdminApp.chiudiModale();
        caricaMateriePrime();
      } catch (err) {
        toast(err.message, "errore");
      }
    });
  }

  // ============ CONTABILITA ============
  async function caricaContabilita() {
    try {
      const report = await api("/api/admin/magazzino/report");

      document.getElementById("report-per-reparto").innerHTML = report.per_reparto
        .map((r) => `<div class="kpi-card"><div class="valore">${r.totale_spesa.toFixed(2)} €</div><div class="etichetta">${esc(r.reparto)} (${r.numero_ordini} ordini)</div></div>`)
        .join("") || `<div class="vuoto">Nessun dato</div>`;

      document.getElementById("report-per-settimana").innerHTML =
        report.per_settimana.map((r) => `<tr><td>${esc(r.periodo)}</td><td>${r.totale_spesa.toFixed(2)} €</td></tr>`).join("") ||
        `<tr><td colspan="2" class="vuoto">Nessun dato</td></tr>`;

      document.getElementById("report-per-mese").innerHTML =
        report.per_mese.map((r) => `<tr><td>${esc(r.periodo)}</td><td>${r.totale_spesa.toFixed(2)} €</td></tr>`).join("") ||
        `<tr><td colspan="2" class="vuoto">Nessun dato</td></tr>`;

      document.getElementById("report-per-ordine").innerHTML =
        report.per_ordine.map((r) => `<tr><td>#${r.ordine_id}</td><td>${formatData(r.creato_il)}</td><td>${esc(STATI_MAGAZZINO[r.stato] || r.stato)}</td><td>${r.totale_spesa.toFixed(2)} €</td></tr>`).join("") ||
        `<tr><td colspan="4" class="vuoto">Nessun dato</td></tr>`;
    } catch (err) {
      toast(err.message, "errore");
    }
  }

  // ============ Badge notifiche ============
  async function aggiornaBadge() {
    try {
      const { ordini } = await api("/api/admin/magazzino/ordini?stato=nuovo");
      const n = ordini.length;
      const badgeEsterno = document.getElementById("badge-magazzino");
      badgeEsterno.textContent = n;
      badgeEsterno.style.display = n > 0 ? "inline-block" : "none";
      const badgeInterno = document.getElementById("badge-magazzino-interno");
      if (badgeInterno) {
        badgeInterno.textContent = n;
        badgeInterno.style.display = n > 0 ? "inline-block" : "none";
      }
    } catch {
      /* silenzioso */
    }
  }

  window.AdminMagazzino = {
    attiva: async function () {
      await caricaFragment();
      attivaTab(tabAttivo);
    },
    aggiornaBadge,
  };
})();
