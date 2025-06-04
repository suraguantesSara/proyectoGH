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

      let deudaInicial = parseFloat(document.getElementById("promedioInput").value) || 0;
      let saldoPendiente = deudaInicial;
      let acumulado = -deudaInicial;

      data.records.forEach((record) => {
        const gananciaOriginal = parseFloat(record.ganancia) || 0;

        let descuento = 0;
        if (saldoPendiente > 0) {
          descuento = Math.min(gananciaOriginal, saldoPendiente);
          saldoPendiente -= descuento;
        }

        const gananciaReal = gananciaOriginal - descuento;
        acumulado += gananciaReal;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${record.fecha}</td>
          <td>${formatearMoneda(record.cantidadTotal)}</td>
          <td>${formatearMoneda(gananciaOriginal)}</td>
          <td>${formatearMoneda(acumulado)}</td>
          <td>${formatearMoneda(descuento)}</td>
          <td>${formatearMoneda(saldoPendiente)}</td>
          <td>${record.fechaRegistro}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(err => alert("Error al obtener datos: " + err));
});

// Función para recalcular la tabla cuando se guarda el promedio
document.getElementById("updatePromedioBtn").addEventListener("click", () => {
  cargarTabla(); // Vuelve a cargar la tabla con el nuevo promedio ingresado
});

// Función para formatear números como moneda con símbolo "$" y separadores de miles
function formatearMoneda(valor) {
  return `$ ${Number(valor).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
}
