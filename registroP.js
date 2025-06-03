document.addEventListener("DOMContentLoaded", () => {
  // ─── 1) LEER TRABAJADOR SELECCIONADO ──────────────────────────────────────
  const stored = localStorage.getItem("selectedWorker");
  if (!stored) {
    alert("No hay trabajador seleccionado. Regresa a la página principal.");
    window.location.replace("index.html");
    return;
  }
  document.getElementById("workerNameDisplay").textContent = stored;
  document.getElementById("workerInSidebar").textContent  = stored;

  // ─── 2) INICIALIZAR FECHA HOY ──────────────────────────────────────────────
  const dateInput = document.getElementById("dateInput");
  dateInput.value = new Date().toISOString().slice(0,10);

  // ─── 3) GENERAR 12 FILAS DE ENTRADA ────────────────────────────────────────
  const tbody = document.querySelector("#productionTable tbody");
  const grandTotalEl = document.getElementById("grandTotal");

  if (!tbody) {
    console.error("Error: No se encontró el elemento tbody.");
    return;
  }

  for (let i = 1; i <= 12; i++) {
    const tr = document.createElement("tr");

    // Celda del número de fila
    const tdNum = document.createElement("td");
    tdNum.textContent = i;
    tr.appendChild(tdNum);

    // Celda para ingresar Cantidad
    const tdQty = document.createElement("td");
    const inputQty = document.createElement("input");
    inputQty.type = "number";
    inputQty.min = "0";
    inputQty.value = "0";
    inputQty.addEventListener("input", updateRow);
    tdQty.appendChild(inputQty);
    tr.appendChild(tdQty);

    // Celda para ingresar Valor Unitario
    const tdVal = document.createElement("td");
    const inputVal = document.createElement("input");
    inputVal.type = "number";
    inputVal.min = "0";
    inputVal.value = "0";
    inputVal.addEventListener("input", updateRow);
    tdVal.appendChild(inputVal);
    tr.appendChild(tdVal);

    // Celda de Total
    const tdTot = document.createElement("td");
    tdTot.textContent = "0.00";
    tr.appendChild(tdTot);

    // Agregar la fila al tbody
    tbody.appendChild(tr);
  }

  // ─── 4) CÁLCULOS ──────────────────────────────────────────────────────────
  function updateRow() {
    const row = this.closest("tr");
    const qty = parseFloat(row.cells[1].querySelector("input").value) || 0;
    const val = parseFloat(row.cells[2].querySelector("input").value) || 0;
    row.cells[3].textContent = (qty * val).toFixed(2);
    updateGrandTotal();
  }

  function updateGrandTotal() {
    let sum = 0;
    tbody.querySelectorAll("tr").forEach(row => {
      sum += parseFloat(row.cells[3].textContent) || 0;
    });
    grandTotalEl.textContent = sum.toFixed(2);
  }

  // ─── 5) GUARDAR REGISTRO ──────────────────────────────────────────────────
  document.getElementById("saveBtn").addEventListener("click", () => {
    if (!dateInput.value) {
      alert("Selecciona una fecha.");
      return;
    }
    
    // Armo sólo filas con datos
    const registros = [];
    tbody.querySelectorAll("tr").forEach((row, idx) => {
      const qty = parseFloat(row.cells[1].querySelector("input").value) || 0;
      const val = parseFloat(row.cells[2].querySelector("input").value) || 0;
      const tot = parseFloat(row.cells[3].textContent) || 0;
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
      alert("Debes ingresar al menos una Cantidad y Valor.");
      return;
    }

    const payload = {
      trabajador: stored,
      fecha: dateInput.value,
      registros: registros,
      totalGeneral: grandTotalEl.textContent
    };

    // URL de tu Web App de Google Apps Script
    const url = "https://script.google.com/macros/s/AKfycbw1CzoIUPxReNzfLoHEzFbhS3pU0_qL7MVx6hkzJ5fsg-SI_vRoRt8i0fkRnP63_bgh8g/exec"; 

    fetch(url, {
      method: "POST",
      mode: "no-cors",  // Evita bloqueos por CORS
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(() => {
      alert("Registro guardado correctamente.");
      resetForm();
    })
    .catch(err => {
      console.error("Error en la conexión:", err);
      alert("Error al enviar datos. Verifica la URL y los permisos en Apps Script.");
    });
  });

  // ─── 6) Función para reiniciar el formulario ──────────────────────────────
  function resetForm() {
    document.getElementById("dateInput").value = new Date().toISOString().slice(0,10);
    tbody.querySelectorAll("tr").forEach(row => {
      row.cells[1].querySelector("input").value = 0;
      row.cells[2].querySelector("input").value = 0;
      row.cells[3].textContent = "0.00";
    });
    grandTotalEl.textContent = "0.00";
  }
});
