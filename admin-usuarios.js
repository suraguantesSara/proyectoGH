document.addEventListener("DOMContentLoaded", cargarTrabajadores);

const scriptURL = "https://script.google.com/macros/s/AKfycby3lTyA8G0uAiw3chr30hPxkwA9_ZbbebShZg-MM0JvRqDZgbpoJk81TuVlO-fgbH5OsA/exec";

function cargarTrabajadores() {
  fetch(`${scriptURL}?action=getWorkers`)
    .then(response => response.json())
    .then(data => {
      const workerList = document.getElementById("workerList");
      workerList.innerHTML = "";

      data.workers.forEach(worker => {
        const li = document.createElement("li");
        li.textContent = worker.name;
        const btn = document.createElement("button");
        btn.textContent = "Eliminar";
        btn.onclick = () => eliminarTrabajador(worker.name);
        li.appendChild(btn);
        workerList.appendChild(li);
      });
    })
    .catch(err => alert("Error al cargar trabajadores: " + err));
}

function agregarTrabajador() {
  const workerName = document.getElementById("workerNameInput").value.trim();
  if (!workerName) return alert("Ingrese un nombre válido.");

  fetch(`${scriptURL}?action=addWorker&name=${encodeURIComponent(workerName)}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === "error") {
        alert("Error: " + data.message);
      } else {
        alert("Trabajador agregado correctamente.");
        document.getElementById("workerNameInput").value = "";
        cargarTrabajadores();
      }
    })
    .catch(err => alert("Error al agregar trabajador: " + err));
}

function eliminarTrabajador(workerName) {
  if (!confirm(`¿Estás seguro de eliminar al trabajador "${workerName}"? Esta acción no se puede deshacer.`)) return;

  fetch(`${scriptURL}?action=deleteWorker&name=${encodeURIComponent(workerName)}`)
    .then(response => response.json())
    .then(data => {
      alert("Trabajador eliminado correctamente.");
      cargarTrabajadores();
    })
    .catch(err => alert("Error al eliminar trabajador: " + err));
}
