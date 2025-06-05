document.addEventListener("DOMContentLoaded", () => {
  const storedWorker = localStorage.getItem("selectedWorker");
  if (!storedWorker) {
    alert("No hay trabajador seleccionado. Regresa a la página principal.");
    window.location.replace("index.html");
    return;
  }

  document.getElementById("workerName").textContent = storedWorker;

  function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  function formatearMoneda(valor) {
    return `$${valor.toFixed(2)}`;
  }

  function cargarTabla() {
    let promedioIngresado = parseFloat(document.getElementById("promedioInput").value) || 0;
    let saldoRestante = promedioIngresado;
    let gananciaAcumulada = 0;

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

        data.records.forEach((record) => {
          const ganancia = parseFloat(record.ganancia) || 0;
          gananciaAcumulada += ganancia;

          let descuento = 0;
          if (saldoRestante > 0) {
            descuento = Math.min(ganancia, saldoRestante);
            saldoRestante -= descuento;
          }

          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${formatearFecha(record.fecha)}</td>
            <td>${record.cantidadTotal}</td>
            <td>${formatearMoneda(ganancia)}</td>
            <td>${formatearMoneda(gananciaAcumulada)}</td>
            <td>${formatearMoneda(descuento)}</td>
            <td>${formatearMoneda(saldoRestante)}</td>
            <td>${formatearFecha(record.fechaRegistro)}</td>
          `;
          tableBody.appendChild(row);
        });
      })
      .catch(err => alert("Error al obtener datos: " + err));
  }

  document.getElementById("updatePromedioBtn").addEventListener("click", () => {
    cargarTabla();
    alert("Promedio actualizado correctamente.");
  });

  cargarTabla(); // Carga inicial
});

