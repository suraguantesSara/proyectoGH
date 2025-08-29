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

  // ─── 3) CONFIGURACIÓN DE TIEMPOS ──────────────────────────────────────────
  const tiemposReferencia = {
    "2.253": 16, "2.943": 24.6, "2.704": 22, "3.106": 26, "3.298": 29,
    "2.834": 23, "1.993": 20, "2.478": 23, "2.946": 25, "849": 7,
    "5.033": 45, "2.351": 23, "1.926": 20, "2.100": 20, "2.523": 26,
    "2.180": 20, "4.111": 30, "9.394": 73.2, "10.369": 82.3, "9.934": 81.8,
    "9.024": 73.2, "5.909": 45, "9.023": 70.2, "5.095": 40, "7.025": 53.6,
    "7.090": 54, "7.849": 62, "2.730": 20, "5.774": 45, "6.343": 50,
    "3.850": 30, "9.191": 73.2, "5.719": 45, "6.996": 54.52, "7.871": 62.5,
    "10.878": 87.3, "4.923": 40, "10.140": 85.7, "10.058": 82.9,
    "7.026": 53.6, "6.439": 55.6, "3.576": 34.6, "2.822": 24.6,
    "8.057": 62, "5.368": 52, "4.002": 25, "4.287": 30, "2.266": 20,
    "4.859": 42, "6.083": 40, "322": 1.99, "423": 3.3, "6.878": 54,
    "1.078": 8.4, "1.232": 9.6, "2.436": 19, "3.841": 30, "6.792": 53,
    "10.920": 90, "4.006": 32, "5.833": 52, "5.187": 44, "2.854": 25,
    "11.100": 88
  };

  let minutosDia = 480; // por defecto entre semana
  dateInput.addEventListener("change", () => {
    const day = new Date(dateInput.value).getDay();
    minutosDia = (day === 6) ? 285 : 480; // sábado = 6
  });

  // ─── 4) GENERAR 12 FILAS DE ENTRADA ────────────────────────────────────────
  const tbody = document.querySelector("#productionTable tbody");
  const grandTotalEl = document.getElementById("grandTotal");
  const grandEfficiencyEl = document.getElementById("grandEfficiency");

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

    // 🔹 Celda de Tiempo/ref
    const tdTiempo = document.createElement("td");
    tdTiempo.textContent = "-";
    tr.appendChild(tdTiempo);

    // 🔹 Celda de Eficiencia
    const tdEff = document.createElement("td");
    tdEff.textContent = "-";
    tr.appendChild(tdEff);

    // Agregar la fila al tbody
    tbody.appendChild(tr);
  }

  // ─── 5) CÁLCULOS ──────────────────────────────────────────────────────────
  function updateRow() {
    const row = this.closest("tr");
    const qty = parseFloat(row.cells[1].querySelector("input").value) || 0;
    const val = row.cells[2].querySelector("input").value.trim();
    const totalEl = row.cells[3];
    const tiempoEl = row.cells[4];
    const effEl = row.cells[5];

    let total = 0, tiempo = 0, eficiencia = 0;

    if (qty > 0 && val) {
      total = qty * parseFloat(val);
      if (tiemposReferencia[val]) {
        tiempo = tiemposReferencia[val];
        eficiencia = ((qty * tiempo) / minutosDia) * 100;
      }
    }

    totalEl.textContent = total.toFixed(2);
    tiempoEl.textContent = tiempo ? tiempo : "-";

    if (tiempo) {
      effEl.textContent = eficiencia.toFixed(1) + "%";
      effEl.className = (eficiencia < 86) ? "efficiency-low" : "efficiency-ok";
    } else {
      effEl.textContent = "-";
      effEl.className = "";
    }

    updateGrandTotal();
    updateGrandEfficiency();
  }

  function updateGrandTotal() {
    let sum = 0;
    tbody.querySelectorAll("tr").forEach(row => {
      sum += parseFloat(row.cells[3].textContent) || 0;
    });
    grandTotalEl.textContent = sum.toFixed(2);
  }

  function updateGrandEfficiency() {
    let sumEff = 0;
    tbody.querySelectorAll("tr").forEach(row => {
      const effText = row.cells[5].textContent;
      if (effText && effText.includes("%")) {
        sumEff += parseFloat(effText.replace("%", ""));
      }
    });
    grandEfficiencyEl.textContent = sumEff.toFixed(1) + "%";
    grandEfficiencyEl.className = (sumEff < 86) ? "efficiency-low" : "efficiency-ok";
  }

  // ─── 6) GUARDAR REGISTRO ──────────────────────────────────────────────────
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
      totalGeneral: grandTotalEl.textContent,
      eficienciaTotal: grandEfficiencyEl.textContent
    };

    // URL de tu Web App de Google Apps Script
    const url = "https://script.google.com/macros/s/AKfycbw1CzoIUPxReNzfLoHEzFbhS3pU0_qL7MVx6hkzJ5fsg-SI_vRoRt8i0fkRnP63_bgh8g/exec"; 

    fetch(url, {
      method: "POST",
      mode: "no-cors",
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

  // ─── 7) Función para reiniciar el formulario ──────────────────────────────
  function resetForm() {
    document.getElementById("dateInput").value = new Date().toISOString().slice(0,10);
    tbody.querySelectorAll("tr").forEach(row => {
      row.cells[1].querySelector("input").value = 0;
      row.cells[2].querySelector("input").value = 0;
      row.cells[3].textContent = "0.00";
      row.cells[4].textContent = "-";
      row.cells[5].textContent = "-";
      row.cells[5].className = "";
    });
    grandTotalEl.textContent = "0.00";
    grandEfficiencyEl.textContent = "0%";
    grandEfficiencyEl.className = "";
  }
});
