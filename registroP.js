document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const worker = params.get("worker") || "Sin identificar";
  document.getElementById("workerNameDisplay").textContent = worker;

  // Inicializa fecha a hoy
  const dateInput = document.getElementById("date");
  dateInput.value = new Date().toISOString().slice(0,10);

  // Referencias al DOM
  const tbody = document.querySelector("#productionTable tbody");
  const grandTotalEl = document.getElementById("grandTotal");
  const form = document.getElementById("productionForm");

  // Generar 15 filas
  for (let i = 1; i <= 15; i++) {
    const tr = document.createElement("tr");

    // Número de fila
    const tdNum = document.createElement("td");
    tdNum.textContent = i;
    tr.appendChild(tdNum);

    // Input Cantidad
    const tdQty = document.createElement("td");
    const inpQty = document.createElement("input");
    inpQty.type = "number"; inpQty.min = "0"; inpQty.value = "0";
    inpQty.addEventListener("input", updateRow);
    tdQty.appendChild(inpQty);
    tr.appendChild(tdQty);

    // Input Valor unitario
    const tdVal = document.createElement("td");
    const inpVal = document.createElement("input");
    inpVal.type = "number"; inpVal.min = "0"; inpVal.value = "0";
    inpVal.addEventListener("input", updateRow);
    tdVal.appendChild(inpVal);
    tr.appendChild(tdVal);

    // Total fila
    const tdTot = document.createElement("td");
    tdTot.textContent = "0.00";
    tr.appendChild(tdTot);

    tbody.appendChild(tr);
  }

  // Actualiza total de la fila y Total General
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

  // Envío de formulario
  form.addEventListener("submit", e => {
    e.preventDefault();

    const date = dateInput.value;
    if (!date) {
      alert("Debes seleccionar una fecha.");
      return;
    }

    // Recopilar solo filas con datos > 0
    const registros = [];
    tbody.querySelectorAll("tr").forEach((r, idx) => {
      const qty = parseFloat(r.cells[1].firstChild.value) || 0;
      const val = parseFloat(r.cells[2].firstChild.value) || 0;
      const tot = parseFloat(r.cells[3].textContent) || 0;
      if (qty > 0 && val > 0) {
        registros.push({
          fila: idx+1,
          cantidad: qty,
          valor_unitario: val,
          total: tot.toFixed(2)
        });
      }
    });

    // Si no hay ningún registro, prevenimos envío
    if (registros.length === 0) {
      alert("Ingresa al menos un registro con Cantidad y Valor.");
      return;
    }

    const payload = {
      trabajador: worker,
      fecha: date,
      registros,
      totalGeneral: grandTotalEl.textContent
    };

    // Envía a tu Web App de Google Apps Script
    const url = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(() => {
      alert("Registro guardado exitosamente.");
      form.reset();
      // Reiniciar totales
      tbody.querySelectorAll("tr input").forEach(i => i.value = 0);
      tbody.querySelectorAll("tr td:last-child")
           .forEach(td => td.textContent = "0.00");
      updateGrandTotal();
      // volver a fecha de hoy
      dateInput.value = new Date().toISOString().slice(0,10);
    })
    .catch(err => {
      alert("Error al guardar: " + err);
    });
  });
});
