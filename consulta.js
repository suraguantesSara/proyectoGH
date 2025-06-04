document.addEventListener("DOMContentLoaded", () => {
  const storedWorker = localStorage.getItem("selectedWorker");
  if (!storedWorker) {
    alert("No hay trabajador seleccionado. Regresa a la página principal.");
    window.location.replace("index.html");
    return;
  }
  document.getElementById("workerName").textContent = storedWorker;

  const url = "https://script.google.com/macros/s/TU_URL_CORRECTA/exec?worker=" + encodeURIComponent(storedWorker);

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === "ERROR") {
        alert("Error al cargar registros: " + data.message);
        return;
      }

      const tableBody = document.querySelector("#historyTable tbody");
      tableBody.innerHTML = ""; 

      let saldoPendiente = data.saldoPendiente || 0;

      data.records.forEach(record => {
        const descuento = Math.min(record.ganancia, saldoPendiente);
        saldoPendiente -= descuento;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${record.fecha}</td>
          <td>${record.cantidadTotal}</td>
          <td>${record.ganancia}</td>
          <td>${record.totalAcumulado}</td>
          <td>${descuento.toFixed(2)}</td>
          <td>${record.fechaRegistro}</td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch(err => alert("Error al obtener datos: " + err));

  document.getElementById("updatePromedioBtn").addEventListener("click", () => {
    const promedio = parseFloat(document.getElementById("promedioInput").value) || 0;
    fetch(url + `&promedio=${promedio}`, { method: "POST" })
      .then(() => alert("Promedio actualizado correctamente."))
      .catch(err => alert("Error al actualizar el promedio: " + err));
  });
});
