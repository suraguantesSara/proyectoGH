const referencias = {
  "C2D + PLUS": 30.0,
  "D2-2 TP C/CH UÑAS": 73.2,
  "C2PC-5(15)OJ ALUM sin pegar ojalete": 82.3,
  "C1D-2 TIPO PISTOLA": 73.2,
  "REMACHADA DE GUANTE": 45.0
};

const trabajadores = [
  "Luis Oliveros", "Fernando Arias", "Jesus Arteaga",
  "Nataly Rodriguez", "Angela Pacheco", "Alex (nuevo)"
];

let currentWorker = null;

// Pantalla 1
const workerButtons = document.getElementById("workerButtons");
trabajadores.forEach(t => {
  const btn = document.createElement("button");
  btn.textContent = t;
  btn.className = "select-btn";
  btn.onclick = () => startEficiencia(t);
  workerButtons.appendChild(btn);
});

function startEficiencia(trabajador) {
  currentWorker = trabajador;
  document.getElementById("selectedWorker").textContent = trabajador;
  document.getElementById("effDate").valueAsDate = new Date();
  document.getElementById("selectScreen").classList.add("hidden");
  document.getElementById("efficiencyScreen").classList.remove("hidden");
  renderEntryRows();
}

function renderEntryRows() {
  const table = document.getElementById("entryTable");
  table.innerHTML = "";
  for (let i = 1; i <= 7; i++) {
    const tr = document.createElement("tr");

    const tdNum = document.createElement("td");
    tdNum.textContent = i;

    const ref = document.createElement("input");
    const tdRef = document.createElement("td");
    tdRef.appendChild(ref);

    const qty = document.createElement("input");
    qty.type = "number";
    const tdQty = document.createElement("td");
    tdQty.appendChild(qty);

    const tdMin = document.createElement("td");
    const tdEff = document.createElement("td");
    const tdMsg = document.createElement("td");

    const calc = () => {
      const r = ref.value.trim();
      const q = parseFloat(qty.value);
      const minDay = parseInt(document.getElementById("workMinutes").value);
      if (!r || isNaN(q)) {
        tdEff.textContent = "-";
        tdMin.textContent = "-";
        tdMsg.textContent = "Completa los campos";
        tdEff.className = "";
        return;
      }
      if (!(r in referencias)) {
        tdEff.textContent = "-";
        tdMin.textContent = "-";
        tdMsg.textContent = "Referencia no encontrada";
        tdEff.className = "";
        return;
      }
      const minutos = referencias[r];
      const totalMin = minutos * q;
      const eficiencia = totalMin / minDay;
      const porcentaje = (eficiencia * 100).toFixed(1);
      tdEff.textContent = porcentaje + "%";
      tdMin.textContent = minutos;
      tdMsg.textContent = "";
      tdEff.className = eficiencia < 0.86 ? "low" : "high";
    };

    ref.oninput = calc;
    qty.oninput = calc;
    document.getElementById("workMinutes").onchange = calc;

    tr.append(tdNum, tdRef, tdQty, tdMin, tdEff, tdMsg);
    table.appendChild(tr);
  }
}

function saveEntries() {
  const rows = document.querySelectorAll("#entryTable tr");
  const data = [];
  const fecha = document.getElementById("effDate").value;
  const minDay = parseInt(document.getElementById("workMinutes").value);

  rows.forEach(row => {
    const cells = row.querySelectorAll("input");
    const ref = cells[0].value.trim();
    const qty = parseFloat(cells[1].value);
    if (ref && !isNaN(qty) && referencias[ref]) {
      const tiempo = referencias[ref];
      const eficiencia = (tiempo * qty) / minDay;
      data.push({ referencia: ref, cantidad: qty, tiempo, eficiencia });
    }
  });

  const promedio = data.length
    ? (data.reduce((sum, r) => sum + r.eficiencia, 0) / data.length) * 100
    : 0;

  const key = `${fecha}:${currentWorker}`;
  localStorage.setItem(key, JSON.stringify({ fecha, trabajador: currentWorker, registros: data, promedio: promedio.toFixed(1) }));
  alert("Registro guardado");
  goBack();
}

function showHistory() {
  document.getElementById("selectScreen").classList.add("hidden");
  document.getElementById("historyScreen").classList.remove("hidden");
  renderHistory();
}

function renderHistory() {
  const table = document.getElementById("historyTable");
  table.innerHTML = "";
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.includes(":")) {
      const data = JSON.parse(localStorage.getItem(key));
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${data.fecha}</td><td>${data.trabajador}</td><td>${data.registros.length}</td><td>${data.promedio}%</td>`;
      table.appendChild(tr);
    }
  }
}

function goBack() {
  document.getElementById("efficiencyScreen").classList.add("hidden");
  document.getElementById("historyScreen").classList.add("hidden");
  document.getElementById("selectScreen").classList.remove("hidden");
}
