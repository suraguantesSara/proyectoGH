function cargarTabla() {
  deudaInicial = parseFloat(document.getElementById("promedioInput").value) || 0;
  let saldoPendiente = deudaInicial;
  let acumulado = -deudaInicial;

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

      data.records.forEach(record => {
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
          <td>${formatearFecha(record.fecha)}</td>
          <td>${formatearMoneda(record.cantidadTotal)}</td>
          <td>${formatearMoneda(gananciaOriginal)}</td>
          <td>${formatearMoneda(acumulado)}</td>
          <td>${formatearMoneda(descuento)}</td>
          <td>${formatearMoneda(saldoPendiente)}</td>
          <td>${formatearFecha(record.fechaRegistro)}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(err => alert("Error al obtener datos: " + err));
}
