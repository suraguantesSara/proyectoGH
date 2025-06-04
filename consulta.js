document.addEventListener("DOMContentLoaded", () => {
  // ─── LEER TRABAJADOR SELECCIONADO ────────────────────────────────────────
  const stored = localStorage.getItem("selectedWorker");
  if (!stored) {
    alert("No hay trabajador seleccionado. Regresa a la página principal.");
    window.location.replace("index.html");
    return;
  }
  document.getElementById("workerName").textContent = stored;

  // ─── RECUPERAR REGISTROS DESDE GOOGLE SHEETS ─────────────────────────────
  const url = "https://script.google.com/macros/s/TU_URL_CORRECTA/exec?worker=" + encodeURIComponent(stored);

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === "ERROR") {
        alert("Error al cargar registros: " + data.message);
        return;
      }

      const tableBody = document.querySelector("#historyTable tbody");
      tableBody.innerHTML = ""; // Limpio la tabla antes de insertar nuevos datos

      data.records.forEach(record => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${record.fecha}</td>
          <td>${record.cantidadTotal}</td>
          <td>${record.ganancia}</td>
          <td>${record.totalAcumulado}</td>
          <td>${record.fechaRegistro}</td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Error al obtener datos:", err);
      alert("Error al conectar con Google Sheets.");
    });
});
