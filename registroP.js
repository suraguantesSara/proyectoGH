document.addEventListener("DOMContentLoaded", () => {
  // 1) Mostrar nombre del trabajador desde la URL
  const params = new URLSearchParams(window.location.search);
  const worker = params.get("worker") || "Sin identificar";
  document.getElementById("workerNameDisplay").textContent = worker;

  // 2) Inicializar selector de fecha al día de hoy
  const dateInput = document.getElementById("date");
  dateInput.value = new Date().toISOString().slice(0, 10);

  // 3) Crear 15 filas opcionales en la tabla
  const tbody = document.querySelector("#productionTable tbody");
  for (let i = 1; i <= 15; i++) {
    const tr = document.createElement("tr");

    // Celda # 
    const tdNum = document.createElement("td");
    tdNum.textContent = i;
    tr
