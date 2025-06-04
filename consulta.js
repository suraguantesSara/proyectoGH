document.addEventListener("DOMContentLoaded", () => {
  const storedWorker = localStorage.getItem("selectedWorker");
  if (!storedWorker) {
    alert("No hay trabajador seleccionado. Regresa a la página principal.");
    window.location.replace("index.html");
    return;
  }
  document.getElementById("workerName").textContent = storedWorker;

  const url = "https://script.google.com/macros/s/AKfycbwRj9PuCnWGpxhWiXyhdcpP8WlYLIsMsbcE84yAuiWSFZyK8nsDus4SyJjur2le9Vv8/exec?worker=" + encodeURIComponent(storedWorker);

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === "ERROR") {
        alert("Error al cargar registros: " + data.message);
        return;
      }

      const tableBody = document.querySelector("#historyTable tbody");
      tableBody.innerHTML = ""; 
      
      let saldoPendiente = parseFloat(document.getElementById("promedioInput").value) || 0;

      // Insertar registros en la tabla y ajustar el acumulado
      data.records.forEach(record => {
        const descuento = Math.min(record.ganancia, saldoPendiente);
        saldoPendiente -= descuento;

        // Calcular el nuevo total acumulado en la interfaz
        const nuevoTotalAcumulado = record.totalAcumulado - descuento;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${record.fecha}</td>
          <td>${formatearMoneda(record.cantidadTotal)}</td>
          <td>${formatearMoneda(record.ganancia)}</td>
          <td>${formatearMoneda(nuevoTotalAcumulado)}</td>
          <td>${formatearMoneda(descuento)}</td>
          <td>${record.fechaRegistro}</td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch(err => alert("Error al obtener datos: " + err));

  // Función para actualizar el promedio en la interfaz sin afectar Sheets
  document.getElementById("updatePromedioBtn").addEventListener("click", () => {
    let nuevoPromedio = parseFloat(document.getElementById("promedioInput").value) || 0;
    
    const filas = document.querySelectorAll("#historyTable tbody tr");
    let saldoPendiente = nuevoPromedio;

    filas.forEach(row => {
      const ganancia = parseFloat(row.cells[2].textContent.replace(/[^\d]/
