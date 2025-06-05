document.addEventListener("DOMContentLoaded", cargarTrabajadores);

const scriptURL = "https://script.google.com/macros/s/AKfycbyhjrYKWwbiGtjPT4WzX9vkR0PfI7o6M9-Wo3zDUwRrL56T05rHxKAWc8bryZdYDg9xjQ/exec";

function cargarTrabajadores() {
    fetch(`${scriptURL}?action=getWorkers`)
        .then(response => response.json())
        .then(data => {
            const workerList = document.getElementById("workerList");
            workerList.innerHTML = "";
            data.workers.forEach(worker => {
                const li = document.createElement("li");
                li.textContent = worker.name;
                li.innerHTML += ` <button onclick="eliminarTrabajador('${worker.name}')">Eliminar</button>`;
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
        .then(() => {
            alert("Trabajador agregado correctamente.");
            cargarTrabajadores();
        })
        .catch(err => alert("Error al agregar trabajador: " + err));
}

function eliminarTrabajador(workerName) {
    fetch(`${scriptURL}?action=deleteWorker&name=${encodeURIComponent(workerName)}`)
        .then(response => response.json())
        .then(() => {
            alert("Trabajador eliminado correctamente.");
            cargarTrabajadores();
        })
        .catch(err => alert("Error al eliminar trabajador: " + err));
}
