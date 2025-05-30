document.addEventListener("DOMContentLoaded", () => {
  // Recuperar el nombre del trabajador desde la URL
  const params = new URLSearchParams(window.location.search);
  let worker = params.get("worker");
  if (!worker) {
    worker = "No identificado";
  }
  document.getElementById("workerNameDisplay").textContent = worker;

  const tbody = document.querySelector("#productionTable tbody");

  // Crear 15 filas en la tabla
  for (let i = 1; i <= 15; i++) {
    let tr = document.createElement("tr");

    // Celda con número de fila
    let cellNum = document.createElement("td");
    cellNum.textContent = i;

    // Celda para ingresar Cantidad
    let cellCantidad = document.createElement("td");
    let inputCantidad = document.createElement("input");
    inputCantidad.type = "number";
    inputCantidad.min = "0";
    inputCantidad.value = "0";
    inputCantidad.addEventListener("input", updateRowTotal);
    cellCantidad.appendChild(inputCantidad);

    // Celda para ingresar Valor Unitario
    let cellValor = document.createElement("td");
    let inputValor = document.createElement("input");
    inputValor.type = "number";
    inputValor.min = "0";
    inputValor.value = "0";
    inputValor.addEventListener("input", updateRowTotal);
    cellValor.appendChild(inputValor);

    // Celda que muestra el Total de la fila (Cantidad * Valor)
    let cellTotal = document.createElement("td");
    cellTotal.textContent = "0.00";

    tr.appendChild(cellNum);
    tr.appendChild(cellCantidad);
    tr.appendChild(cellValor);
    tr.appendChild(cellTotal);
    tbody.appendChild(tr);
  }

  // Función que actualiza el total de la fila donde se modifique un input
  function updateRowTotal() {
    const row = this.closest("tr");
    const quantity = parseFloat(row.cells[1].querySelector("input").value) || 0;
    const unitPrice = parseFloat(row.cells[2].querySelector("input").value) || 0;
    const total = quantity * unitPrice;
    row.cells[3].textContent = total.toFixed(2);
    updateGrandTotal();
  }

  // Sumar todos los totales de las filas y mostrarlos en "grandTotal"
  function updateGrandTotal() {
    let grandTotal = 0;
    const rows = document.querySelectorAll("#productionTable tbody tr");
    rows.forEach(row => {
      grandTotal += parseFloat(row.cells[3].textContent) || 0;
    });
    document.getElementById("grandTotal").textContent = grandTotal.toFixed(2);
  }

  // Manejo del envío del formulario
  const productionForm = document.getElementById("productionForm");
  productionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const dateVal = document.getElementById("date").value;
    if (!dateVal) {
      alert("Por favor ingresa la fecha.");
      return;
    }

    // Crear un arreglo con los datos de cada fila
    const data = [];
    const rows = document.querySelectorAll("#productionTable tbody tr");
    rows.forEach((row, index) => {
      const quantity = row.cells[1].querySelector("input").value;
      const unitPrice = row.cells[2].querySelector("input").value;
      const total = row.cells[3].textContent;
      data.push({ fila: index + 1, cantidad: quantity, valor_unitario: unitPrice, total: total });
    });
    const grandTotal = document.getElementById("grandTotal").textContent;

    const payload = {
      trabajador: worker,
      fecha: dateVal,
      registros: data,
      totalGeneral: grandTotal,
    };

    // Reemplaza la siguiente URL por la de tu Web App de Google Apps Script
    const url = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(() => {
        alert("Registro guardado exitosamente.");
        productionForm.reset();
        // Opcional: Reiniciar totales (si fuera necesario)
        updateGrandTotal();
      })
      .catch((error) => {
        alert("Error al guardar el registro: " + error.message);
      });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // 1) Mostrar nombre del trabajador desde la URL
  const params = new URLSearchParams(window.location.search);
  const worker = params.get("worker") || "Sin identificar";
  document.getElementById("workerNameDisplay").textContent = worker;

  // 2) Inicializar selector de fecha al día de hoy
  const dateInput = document.getElementById("date");
  dateInput.value = new Date().toISOString().slice(0, 10);

  // 3) Crear 15 filas opcionales en la tabla
  const tbody = document.querySelector("#productionTable tbody");
  for (let i = 1; i <= 15; i++) {
    const tr = document.createElement("tr");

    // Celda # 
    const tdNum = document.createElement("td");
    tdNum.textContent = i;
    tr
