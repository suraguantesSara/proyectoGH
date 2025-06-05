// URL del Apps Script (la que me diste y confirmaste como la nueva)
const scriptURL = "https://script.google.com/macros/s/AKfycbyQaRGaen129AAUB70vocRx1jCEztlEr5Vy4OwiB5OoDdlX_vtXW_kHyLy4LSAiPtgIDw/exec";

// Esperar que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  cargarTrabajadores();

  // Escucha el botón para agregar trabajador
  document.getElementById("agregarBtn").addEventListener("click", () => {
    const nombre = document.getElementById("workerNameInput").value.trim();
    if (!nombre) return alert("⚠️ Ingrese un nombre válido.");

    agregarTrabajador(nombre);
  });
});

// Cargar lista de trabajadores
function cargarTrabajadores() {
  fetch(`${scriptURL}?action=getWorkers`)
    .then(res => res.json())
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

// Agregar trabajador
function agregarTrabajador(nombre) {
  fetch(`${scriptURL}?action=addWorker&name=${encodeURIComponent(nombre)}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === "error") {
        alert(`⚠️ ${data.message}`);
        return;
      }

      alert("✅ Trabajador agregado correctamente.");
      document.getElementById("workerNameInput").value = "";
      cargarTrabajadores();
    })
    .catch(err => {
      console.error("Error al agregar trabajador:", err);
      alert("❌ No se pudo agregar el trabajador.");
    });
}

// Eliminar trabajador
function eliminarTrabajador(nombre) {
  if (!confirm(`¿Estás seguro de eliminar a "${nombre}"? Esta acción no se puede deshacer.`)) return;

  fetch(`${scriptURL}?action=deleteWorker&name=${encodeURIComponent(nombre)}`)
    .then(res => res.json())
    .then(() => {
      alert("✅ Trabajador eliminado correctamente.");
      cargarTrabajadores();
    })
    .catch(err => {
      console.error("Error al eliminar trabajador:", err);
      alert("❌ No se pudo eliminar el trabajador.");
    });
}
