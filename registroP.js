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
    "2253": 16, "2943": 24.6, "2704": 22, "3106": 26, "3298": 29,
    "2834": 23, "1993": 20, "2478": 23, "2946": 25, "849": 7,
    "5033": 45, "2351": 23, "1926": 20, "2100": 20, "2523": 26,
    "2180": 20, "4111": 30, "9394": 73.2, "10369": 82.3, "9934": 81.8,
    "9024": 73.2, "5909": 45, "9023": 70.2, "5095": 40, "7025": 53.6,
    "7090": 54, "7849": 62, "2730": 20, "5774": 45, "6343": 50,
    "3850": 30, "9191": 73.2, "5719": 45, "6996": 54.52, "7871": 62.5,
    "10878": 87.3, "4923": 40, "10140": 85.7, "10058": 82.9,
    "7.026": 53.6, "6.439": 55.6, "3.576": 34.6, "2.822": 24.6,
    "8057": 62, "5368": 52, "4002": 25, "4287": 30, "2266": 20,
    "4859": 42, "6083": 40, "322": 1.99, "423": 3.3, "6878": 54,
    "1078": 8.4, "1232": 9.6, "2436": 19, "3841": 30, "6792": 53,
    "10920": 90, "4006": 32, "5833": 52, "5187": 44, "2854": 25,
    "11100": 881, "2730":25, "935":8.5, "385": 3.5
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
