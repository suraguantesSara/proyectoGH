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
      let acumulado = -saldoPendiente;

      data.records.forEach(record => {
        const ganancia = parseFloat(record.ganancia) || 0;

        // Calcular descuento a aplicar
        let descuento = 0;
        if (saldoPendiente > 0) {
          descuento = Math.min(ganancia, saldoPendiente);
          saldoPendiente -= descuento;
        }

        // Sumar al acumulado solo lo que realmente gana
        const gananciaReal = ganancia - descuento;
        acumulado += gananciaReal;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${formatearFecha(record.fecha)}</td>
          <td>${formatearMoneda(record.cantidadTotal)}</td>
          <td>${formatearMoneda(ganancia)}</td>
          <td>${formatearMoneda(acumulado)}</td>
          <td>${formatearMoneda(descuento)}</td>
          <td>${formatearFecha(record.fechaRegistro)}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(err => alert("Error al obtener datos: " + err));

  document.getElementById("updatePromedioBtn").addEventListener("click", () => {
    let saldoPendiente = parseFloat(document.getElementById("promedioInput").value) || 0;
    let acumulado = -saldoPendiente;

    const filas = document.querySelectorAll("#historyTable tbody tr");
    filas.forEach(row => {
      const ganancia = parseFloat(row.cells[2].textContent.replace(/[^0-9.-]/g, "")) || 0;

      let descuento = 0;
      if (saldoPendiente > 0) {
        descuento = Math.min(ganancia, saldoPendiente);
        saldoPendiente -= descuento;
      }

      const gananciaReal = ganancia - descuento;
      acumulado += gananciaReal;

      row.cells[4].textContent = formatearMoneda(descuento);
      row.cells[3].textContent = formatearMoneda(acumulado);
    });

    alert("Promedio actualizado correctamente.");
  });
});

// Formatea moneda colombiana
function formatearMoneda(valor) {
  return `$ ${Number(valor).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
}

// Formatea fecha a dd/mm/yyyy
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-CO");
}
