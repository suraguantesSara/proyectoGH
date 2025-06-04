@@ -17,23 +17,25 @@ document.addEventListener("DOMContentLoaded", () => {
        return;
      }

      document.getElementById("promedioInput").value = data.saldoPendiente || 0;

      const tableBody = document.querySelector("#historyTable tbody");
      tableBody.innerHTML = ""; 
      
      let saldoPendiente = parseFloat(document.getElementById("promedioInput").value) || 0;

      let saldoPendiente = data.saldoPendiente || 0;

      // Insertar registros en la tabla y ajustar el acumulado
      data.records.forEach(record => {
        const descuento = Math.min(record.ganancia, saldoPendiente);
        saldoPendiente -= descuento;

        // Calcular el nuevo total acumulado en la interfaz
        const nuevoTotalAcumulado = record.totalAcumulado - descuento;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${record.fecha}</td>
          <td>${record.cantidadTotal}</td>
          <td>${record.ganancia}</td>
          <td>${record.totalAcumulado}</td>
          <td>${nuevoTotalAcumulado.toFixed(2)}</td>
          <td>${descuento.toFixed(2)}</td>
          <td>${record.fechaRegistro}</td>
        `;
@@ -43,10 +45,25 @@ document.addEventListener("DOMContentLoaded", () => {
    })
    .catch(err => alert("Error al obtener datos: " + err));

  // Función para actualizar el promedio en la interfaz sin afectar Sheets
  document.getElementById("updatePromedioBtn").addEventListener("click", () => {
    const promedio = parseFloat(document.getElementById("promedioInput").value) || 0;
    fetch(url + `&promedio=${promedio}`, { method: "POST" })
      .then(() => alert("Promedio actualizado correctamente."))
      .catch(err => alert("Error al actualizar el promedio: " + err));
    let nuevoPromedio = parseFloat(document.getElementById("promedioInput").value) || 0;
    
    const filas = document.querySelectorAll("#historyTable tbody tr");
    let saldoPendiente = nuevoPromedio;

    filas.forEach(row => {
      const ganancia = parseFloat(row.cells[2].textContent) || 0;
      const totalAcumulado = parseFloat(row.cells[3].textContent) || 0;
      
      const descuento = Math.min(ganancia, saldoPendiente);
      saldoPendiente -= descuento;

      // Actualizar la columna de "Promedio a pagar" y el nuevo total acumulado en la interfaz
      row.cells[4].textContent = descuento.toFixed(2);
      row.cells[3].textContent = (totalAcumulado - descuento).toFixed(2);
    });

    alert("Promedio actualizado en la interfaz.");
  });
});
