
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
      let acumuladoPrevio = -saldoPendiente;

      data.records.forEach((record, index) => {
        const gananciaNum = parseFloat(record.ganancia) || 0;

        const descuento = Math.min(gananciaNum, saldoPendiente);
        const gananciaReal = gananciaNum - descuento;
        saldoPendiente -= descuento;

        acumuladoPrevio += gananciaReal;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${record.fecha}</td>
          <td>${formatearMoneda(record.cantidadTotal)}</td>
          <td>${formatearMoneda(gananciaNum)}</td>
          <td>${formatearMoneda(acumuladoPrevio)}</td>
          <td>${formatearMoneda(descuento)}</td>
          <td>${record.fechaRegistro}</td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch(err => alert("Error al obtener datos: " + err));

  document.getElementById("updatePromedioBtn").addEventListener("click", () => {
    let saldoPendiente = parseFloat(document.getElementById("promedioInput").value) || 0;

    const filas = document.querySelectorAll("#historyTable tbody tr");
    let acumuladoPrevio = -saldoPendiente;

    filas.forEach(row => {
      const gananciaNum = parseFloat(row.cells[2].textContent.replace(/[^0-9-]/g, "")) || 0;

      const descuento = Math.min(gananciaNum, saldoPendiente);
      const gananciaReal = gananciaNum - descuento;
      saldoPendiente -= descuento;

      acumuladoPrevio += gananciaReal;

      row.cells[4].textContent = formatearMoneda(descuento);
      row.cells[3].textContent = formatearMoneda(acumuladoPrevio);
    });

    alert("Promedio actualizado en la interfaz.");
  });
});

// Función para formatear números como moneda con símbolo "$" y separadores de miles
function formatearMoneda(valor) {
  return `$ ${Number(valor).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
}


