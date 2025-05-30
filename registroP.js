document.addEventListener("DOMContentLoaded", () => {
  // 1) Lista y selección de trabajadores
  const workers = [
    "Luis Oliveros","Fernando Arias","Jesus Arteaga","David Parra",
    "Alex (nuevo)","Nataly Rodriguez","Gustavo Alvarado","Carlos Caicedo",
    "Kevin Lozano","Angela Pacheco","Liliana Diaz","Claudia Gonzales",
    "Johanna Zuñiga","Solveida Gesama","Nancy Arias","Karolie Luna",
    "Amanda Cardona","Alexander Moran","Blanca Andrade"
  ];
  const listEl   = document.getElementById("workerList");
  const sidebarN = document.getElementById("workerInSidebar");
  const headerN  = document.getElementById("workerNameDisplay");

  // Rellena el menú lateral
  workers.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    li.onclick = () => {
      localStorage.setItem("selectedWorker", name);
      applyWorker(name);
    };
    listEl.appendChild(li);
  });

  // Aplica el trabajador (UI) y guarda en localStorage
  function applyWorker(name) {
    sidebarN.textContent = name;
    headerN.textContent  = name;
  }

  // Restaurar selección anterior
  const stored = localStorage.getItem("selectedWorker");
  if (stored) applyWorker(stored);

  // 2) Inicializar fecha al día de hoy
  const dateInput = document.getElementById("dateInput");
  dateInput.value = new Date().toISOString().slice(0,10);

  // 3) Generar 12 filas dinámicamente
  const tbody        = document.querySelector("#productionTable tbody");
  const grandTotalEl = document.getElementById("grandTotal");

  for (let i = 1; i <= 12; i++) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i}</td>
      <td><input type="number" min="0" value="0"></td>
      <td><input type="number" min="0" value="0"></td>
      <td>0.00</td>
    `;
    // Al cambiar cualquiera de los dos inputs → recalcula fila y total
    const inputs = tr.querySelectorAll("input");
    inputs.forEach(inp => inp.addEventListener("input", updateRow));
    tbody.appendChild(tr);
  }

  // 4) Funciones de cálculo
  function updateRow() {
    const row = this.closest("tr");
    const qty = parseFloat(row.cells[1].firstChild.value) || 0;
    const val = parseFloat(row.cells[2].firstChild.value) || 0;
    const tot = qty * val;
    row.cells[3].textContent = tot.toFixed(2);
    updateGrandTotal();
  }

  function updateGrandTotal() {
    let sum = 0;
    tbody.querySelectorAll("tr").forEach(r => {
      sum += parseFloat(r.cells[3].textContent) || 0;
    });
    grandTotalEl.textContent = sum.toFixed(2);
  }

  // 5) Guardar al servidor
  document.getElementById("saveBtn").onclick = () => {
    // Validaciones
    if (!stored) {
      alert("Selecciona un trabajador en el menú lateral.");
      return;
    }
    if (!dateInput.value) {
      alert("Selecciona una fecha.");
      return;
    }

    // Recopila sólo filas con dato > 0
    const registros = [];
    tbody.querySelectorAll("tr").forEach((r, idx) => {
      const qty = parseFloat(r.cells[1].firstChild.value) || 0;
      const val = parseFloat(r.cells[2].firstChild.value) || 0;
      const tot = parseFloat(r.cells[3].textContent) || 0;
      if (qty > 0 && val > 0) {
        registros.push({
          fila: idx + 1,
          cantidad: qty,
          valor_unitario: val,
          total: tot.toFixed(2)
        });
      }
    });

    if (registros.length === 0) {
      alert("Ingresa al menos un registro con Cantidad y Valor.");
      return;
    }

    const payload = {
      trabajador: stored,
      fecha: dateInput.value,
      registros,
      totalGeneral: grandTotalEl.textContent
    };

    // Envía a tu Web App en Apps Script
    fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(() => {
      alert("Registro guardado.");
      // Reiniciar formulario
      dateInput.value = new Date().toISOString().slice(0,10);
      tbody.querySelectorAll("tr").forEach(r => {
        r.cells[1].firstChild.value = 0;
        r.cells[2].firstChild.value = 0;
        r.cells[3].textContent     = "0.00";
      });
      updateGrandTotal();
    })
    .catch(err => alert("Error al guardar: " + err));
  };
});




document.addEventListener("DOMContentLoaded", () => {
  // 1) Cargar lista de trabajadores y resaltar el seleccionado
  const workers = [
    "Luis Oliveros","Fernando Arias","Jesus Arteaga","David Parra",
    "Alex (nuevo)","Nataly Rodriguez","Gustavo Alvarado","Carlos Caicedo",
    "Kevin Lozano","Angela Pacheco","Liliana Diaz","Claudia Gonzales",
    "Johanna Zuñiga","Solveida Gesama","Nancy Arias","Karolie Luna",
    "Amanda Cardona","Alexander Moran","Blanca Andrade"
  ];
  const listEl = document.getElementById("workerList");
  workers.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    li.onclick = () => {
      localStorage.setItem("selectedWorker", name);
      // refrescar para aplicar cambios
      window.location.reload();
    };
    listEl.appendChild(li);
  });

  // 2) Mostrar trabajador desde localStorage
  const stored = localStorage.getItem("selectedWorker");
  document.getElementById("workerNameDisplay").textContent =
    stored || "—";
  document.getElementById("workerInSidebar").textContent =
    stored || "—";

  // 3) Inicializar fecha hoy
  const dateInput = document.getElementById("dateInput");
  dateInput.value = new Date().toISOString().slice(0,10);

  // 4) Generar 15 filas de la “calculadora”
  const tbody = document.querySelector("#productionTable tbody");
  for (let i = 1; i <= 15; i++) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i}</td>
      <td><input type="number" min="0" value="0"></td>
      <td><input type="number" min="0" value="0"></td>
      <td>0.00</td>
    `;
    // al teclear, actualizar totales
    tr.querySelectorAll("input").forEach(inp =>
      inp.addEventListener("input", updateRow)
    );
    tbody.appendChild(tr);
  }

  const grandTotalEl = document.getElementById("grandTotal");

  function updateRow() {
    const row = this.closest("tr");
    const qty = parseFloat(row.cells[1].firstChild.value) || 0;
    const val = parseFloat(row.cells[2].firstChild.value) || 0;
    const tot = qty * val;
    row.cells[3].textContent = tot.toFixed(2);
    updateGrandTotal();
  }

  function updateGrandTotal() {
    let sum = 0;
    tbody.querySelectorAll("tr").forEach(r => {
      sum += parseFloat(r.cells[3].textContent) || 0;
    });
    grandTotalEl.textContent = sum.toFixed(2);
  }

  // 5) Guardar datos
  document.getElementById("saveBtn").onclick = () => {
    if (!stored) {
      alert("Selecciona un trabajador en el menú lateral.");
      return;
    }
    if (!dateInput.value) {
      alert("Selecciona una fecha.");
      return;
    }
    // Filtrar filas con datos
    const registros = [];
    tbody.querySelectorAll("tr").forEach((r, i) => {
      const qty = parseFloat(r.cells[1].firstChild.value) || 0;
      const val = parseFloat(r.cells[2].firstChild.value) || 0;
      const tot = parseFloat(r.cells[3].textContent) || 0;
      if (qty > 0 && val > 0) {
        registros.push({ fila: i+1, cantidad: qty, valor_unitario: val, total: tot });
      }
    });
    if (registros.length === 0) {
      alert("Ingresa al menos un registro con Cantidad y Valor.");
      return;
    }

    const payload = {
      trabajador: stored,
      fecha: dateInput.value,
      registros,
      totalGeneral: grandTotalEl.textContent
    };

    // URL de tu Web App de Google Apps Script
    const url = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
    fetch(url, {
      method: "POST",
      headers: { "Content-Type":
