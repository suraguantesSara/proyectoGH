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

      const promedioInicial = parseFloat(document.getElementById("promedioInput").value) || 0;
      let saldoPendiente = promedioInicial;
      let acumulado = -promedioInicial;

      data.records.forEach((record, index) => {
        const ganancia = parseFloat(record.ganancia) || 0;
        const descuento = Math.min(ganancia, saldoPendiente);
        saldoPendiente -= descuento;
        const neto = ganancia - descuento;
        acumulado += neto;

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
    let promedioInicial = parseFloat(document.getElementById("promedioInput").value) || 0;
    let saldoPendiente = promedioInicial;
    let acumulado = -promedioInicial;

    const filas = document.querySelectorAll("#historyTable tbody tr");

    filas.forEach(row => {
      const ganancia = parseFloat(row.cells[2].textContent.replace(/[^0-9.-]+/g, "")) || 0;
      const descuento = Math.min(ganancia, saldoPendiente);
      saldoPendiente -= descuento;
      const neto = ganancia - descuento;
      acumulado += neto;

      row.cells[4].textContent = formatearMoneda(descuento);
      row.cells[3].textContent = formatearMoneda(acumulado);
    });

    alert("Promedio actualizado en la interfaz.");
  });
});

function formatearMoneda(valor) {
  return `$ ${Number(valor).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

