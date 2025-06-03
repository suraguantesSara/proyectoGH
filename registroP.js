document.addEventListener("DOMContentLoaded", () => {
  // ─── 1) LEER TRABAJADOR SELECCIONADO ──────────────────────────────────────
  const stored = localStorage.getItem("selectedWorker");
  if (!stored) {
    alert("No hay trabajador seleccionado. Regresa a la página principal.");
    window.location.replace("index.html");
    return;
  }
  // Pinto el nombre en encabezado y sidebar
  document.getElementById("workerNameDisplay").textContent = stored;
  document.getElementById("workerInSidebar").textContent  = stored;

  // ─── 2) INICIALIZAR FECHA HOY ──────────────────────────────────────────────
  const dateInput = document.getElementById("dateInput");
  dateInput.value = new Date().toISOString().slice(0,10);

  // ─── 3) GENERAR 12 FILAS DE ENTRADA ────────────────────────────────────────
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
    // Cada vez que cambie un input recalculo
    tr.querySelectorAll("input").forEach(inp =>
      inp.addEventListener("input", updateRow)
    );
    tbody.appendChild(tr);
  }

  // ─── 4) CÁLCULOS ──────────────────────────────────────────────────────────
  function updateRow() {
    const row = this.closest("tr");
    const qty = parseFloat(row.cells[1].firstChild.value) || 0;
    const val = parseFloat(row.cells[2].firstChild.value) || 0;
    row.cells[3].textContent = (qty * val).toFixed(2);
    updateGrandTotal();
  }

  function updateGrandTotal() {
    let sum = 0;
    tbody.querySelectorAll("tr").forEach(r => {
      sum += parseFloat(r.cells[3].textContent) || 0;
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

    if (registros.length === 0) {
      alert("Debes ingresar al menos una Cantidad y Valor.");
      return;
    }

    const payload = {
      trabajador:   stored,
      fecha:        dateInput.value,
      registros:    registros,
      totalGeneral: grandTotalEl.textContent
    };

    // URL de tu Web App de Google Apps Script
const url = "https://script.google.com/macros/s/TU_URL_CORRECTA/exec"; // Asegúrate de que sea la URL correcta

fetch(url, {
  method: "POST",
  mode:   "no-cors",  // Evita bloqueos por CORS
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

// Función para reiniciar el formulario
function resetForm() {
  document.getElementById("dateInput").value = new Date().toISOString().slice(0,10);
  const tbody = document.querySelector("#productionTable tbody");
  tbody.querySelectorAll("tr").forEach(r => {
    r.cells[1].firstChild.value = 0;
    r.cells[2].firstChild.value = 0;
    r.cells[3].textContent = "0.00";
  });
  document.getElementById("grandTotal").textContent = "0.00";
}
}
