document.addEventListener("DOMContentLoaded", () => {
  const storedWorker = localStorage.getItem("selectedWorker");
  if (!storedWorker) {
    alert("No hay trabajador seleccionado. Regresa a la página principal.");
    window.location.replace("index.html");
    return;
  }
  document.getElementById("workerName").textContent = storedWorker;

  function cargarTabla() {
    let deudaInicial = parseFloat(document.getElementById("promedioInput").value) || 0;
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
          const ganancia = parseFloat(record.ganancia) || 0;

          let descuento = Math.min(ganancia, saldoPendiente);
          saldoPendiente -= descuento;

          acumulado += ganancia - descuento;

          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${formatearFecha(record.fecha)}</td>
            <td>${formatearMoneda(record.cantidadTotal)}</td>
            <td>${formatearMoneda(ganancia)}</td>
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

  document.getElementById("updatePromedioBtn").addEventListener("click", () => {
    cargarTabla(); // Recalcula la tabla con el nuevo promedio ingresado
    alert("Promedio actualizado correctamente.");
  });

  cargarTabla(); // Carga inicial

});

// Función para formatear números como moneda con símbolo "$" y separadores de miles
function formatearMoneda(valor) {
  return `$ ${Number(valor).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
}

// Función para formatear fecha a dd/mm/yyyy
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-CO");
}
