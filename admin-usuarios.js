document.addEventListener("DOMContentLoaded", cargarTrabajadores);

// ✅ Cambia esta URL por la de tu nueva implementación desplegada
const scriptURL = "https://script.google.com/macros/s/AKfycbyjrpkFWU2Nf22yJiY_WRVTU33YMvp0S6Nx66to21ARSFDoSU59PUAbMzXC0DZWAildxw/exec";

function cargarTrabajadores() {
    fetch(`${scriptURL}?action=getWorkers`)
        .then(response => response.json())
        .then(data => {
            const workerList = document.getElementById("workerList");
            workerList.innerHTML = "";

            if (!data.workers || data.workers.length === 0) {
                workerList.innerHTML = "<li>No hay trabajadores registrados.</li>";
                return;
            }

            data.workers.forEach(worker => {
                const li = document.createElement("li");
                li.innerHTML = `
                    ${worker.name}
                    <button onclick="eliminarTrabajador('${worker.name}')">Eliminar</button>
                `;
                workerList.appendChild(li);
            });
        })
        .catch(err => {
            console.error("Error al cargar trabajadores:", err);
            alert("❌ No se pudo cargar la lista de trabajadores.");
        });
}

function agregarTrabajador() {
    const input = document.getElementById("workerNameInput");
    const workerName = input.value.trim();

    if (!workerName) return alert("⚠️ Ingrese un nombre válido.");

    fetch(`${scriptURL}?action=addWorker&name=${encodeURIComponent(workerName)}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("✅ Trabajador agregado correctamente.");
                input.value = "";
                cargarTrabajadores();
            } else {
                alert("⚠️ Error: " + data.message);
            }
        })
        .catch(err => {
            console.error("Error al agregar trabajador:", err);
            alert("❌ No se pudo agregar el trabajador.");
        });
}

function eliminarTrabajador(workerName) {
    if (!confirm(`¿Seguro que deseas eliminar a "${workerName}"? Esta acción no se puede deshacer.`)) return;

    fetch(`${scriptURL}?action=deleteWorker&name=${encodeURIComponent(workerName)}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("🗑️ Trabajador eliminado correctamente.");
                cargarTrabajadores();
            } else {
                alert("⚠️ Error: " + data.message);
            }
        })
        .catch(err => {
            console.error("Error al eliminar trabajador:", err);
            alert("❌ No se pudo eliminar al trabajador.");
        });
}
