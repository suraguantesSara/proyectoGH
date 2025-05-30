// ─── LOGIN & ADMIN ────────────────────────────────────────────────────────────
// Referencias a elementos DOM
const loginPanel      = document.getElementById("loginPanel");
const adminPanel      = document.getElementById("adminPanel");
const adminBtn        = document.getElementById("adminBtn");
const welcomeMessage  = document.getElementById("welcomeMessage");
const referenceSection= document.getElementById("referenceSection");
const workerSection   = document.getElementById("workerSection");

// Muestra el panel de login
function showLoginPanel() {
  loginPanel.style.display = "block";
}

// Valida credenciales de administrador
function validateAdmin() {
  const userName = document.getElementById("adminUser").value.trim();
  const pass     = document.getElementById("adminPass").value;

  if (pass === "2025") {
    loginPanel.style.display = "none";
    adminBtn.disabled = false;                            // Habilita botón Admin
    welcomeMessage.textContent = `Bienvenido, ${userName}`;// Muestra nombre
  } else {
    alert("Contraseña incorrecta.");
  }
}

// Muestra el panel de administración
function showAdminPanel() {
  adminPanel.style.display = "block";
  // Al entrar, oculta ambas secciones y deja que el usuario elija
  referenceSection.style.display = "none";
  workerSection.style.display    = "none";
}

// Muestra sección de Referencias
function showReferences() {
  referenceSection.style.display = "block";
  workerSection.style.display    = "none";
}

// Muestra sección de Trabajadores (edición)
function showWorkers() {
  workerSection.style.display    = "block";
  referenceSection.style.display = "none";
}

// ─── GESTIÓN DE TRABAJADORES ──────────────────────────────────────────────────
// Datos de trabajadores
const workers = [
  { nombre: "Luis Oliveros",     area: "Volteado", genero: "hombre" },
  { nombre: "Fernando Arias",    area: "Volteado", genero: "hombre" },
  { nombre: "Jesus Arteaga",     area: "Volteado", genero: "hombre" },
  { nombre: "David Parra",       area: "Volteado", genero: "hombre" },
  { nombre: "Alex (nuevo)",      area: "Volteado", genero: "hombre" },
  { nombre: "Nataly Rodriguez",  area: "Cerrado",  genero: "mujer"  },
  { nombre: "Gustavo Alvarado",  area: "Cerrado",  genero: "hombre" },
  { nombre: "Carlos Caicedo",    area: "Cerrado",  genero: "hombre" },
  { nombre: "Kevin Lozano",      area: "Cerrado",  genero: "hombre" },
  { nombre: "Angela Pacheco",    area: "Cerrado",  genero: "mujer"  },
  { nombre: "Liliana Diaz",      area: "Armado",   genero: "mujer"  },
  { nombre: "Claudia Gonzales",  area: "Armado",   genero: "mujer"  },
  { nombre: "Johanna Zuñiga",    area: "Armado",   genero: "mujer"  },
  { nombre: "Solveida Gesama",   area: "Armado",   genero: "mujer"  },
  { nombre: "Nancy Arias",       area: "Armado",   genero: "mujer"  },
  { nombre: "Karolie Luna",      area: "Armado",   genero: "mujer"  },
  { nombre: "Amanda Cardona",    area: "Armado",   genero: "mujer"  },
  { nombre: "Alexander Moran",   area: "Armado",   genero: "hombre" },
  { nombre: "Blanca Andrade",    area: "Armado",   genero: "mujer"  }
];

// Referencias DOM para la lista y perfil
const workerList = document.getElementById("workerList");
const workerName = document.getElementById("workerName");
const workerArea = document.getElementById("workerArea");
const workerImg  = document.getElementById("workerImg");
const profile    = document.querySelector(".profile");
const options    = document.querySelector(".options");

// Genera la lista lateral de trabajadores
workers.forEach(w => {
  const li = document.createElement("li");
  li.textContent = w.nombre;
  li.onclick = () => selectWorker(w);
  workerList.appendChild(li);
});

// Selecciona un trabajador, actualiza UI y guarda en localStorage
function selectWorker(worker) {
  // Actualiza la UI
  workerName.textContent = worker.nombre;
  workerArea.textContent = `Área: ${worker.area}`;
  workerImg.src = worker.genero === "hombre"
    ? "https://www.w3schools.com/howto/img_avatar.png"
    : "https://www.w3schools.com/howto/img_avatar2.png";
  profile.style.display = "block";
  options.style.display = "block";

  // Guarda selección para la página de registro
  localStorage.setItem("selectedWorker", worker.nombre);
}

// Intento de restaurar selección al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("selectedWorker");
  if (stored) {
    // Busca en la lista el objeto correspondiente
    const w = workers.find(x => x.nombre === stored);
    if (w) selectWorker(w);
  }
});

// ─── NAVEGACIÓN & ACCIONES ────────────────────────────────────────────────────
// Registro de producción diaria: guarda y redirige sin historial
function registerProduction() {
  const stored = localStorage.getItem("selectedWorker");
  if (!stored) {
    alert("Por favor, selecciona un trabajador primero.");
    return;
  }
  // Redirige reemplazando la entrada actual (no permite volver atrás)
  window.location.replace("registroP.html");
}

// Otras acciones (puedes personalizarlas)
function viewData() {
  alert(`Consulta de datos quincenales de ${workerName.textContent}`);
}
function checkEfficiency() {
  alert(`Revisión de eficiencia de ${workerName.textContent}`);
}
function generateReport() {
  alert(`Generación de informe quincenal de ${workerName.textContent}`);
}
