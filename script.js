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

// ---------------------------------------------------------------------
// SU SELECCIÓN DE TRABAJADOR
// ---------------------------------------------------------------------
const workerList   = document.getElementById("workerList");
const workerNameEl = document.getElementById("workerName");
const workerAreaEl = document.getElementById("workerArea");
const workerImg    = document.getElementById("workerImg");
const profileCard  = document.querySelector(".profile");
const optionsBar   = document.querySelector(".options");

const workers = [
  { nombre: "Luis Oliveros",    area: "Volteado", genero: "hombre" },
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

// 1. Poblar el menú lateral
workers.forEach(w => {
  const li = document.createElement("li");
  li.textContent = w.nombre;
  li.onclick = () => selectWorker(w);
  workerList.appendChild(li);
});

// 2. Al seleccionar un trabajador:
function selectWorker(w) {
  // Actualizo UI
  workerNameEl.textContent = w.nombre;
  workerAreaEl.textContent = "Área: " + w.area;
  workerImg.src = w.genero === "hombre"
    ? "https://www.w3schools.com/howto/img_avatar.png"
    : "https://www.w3schools.com/howto/img_avatar2.png";

  profileCard.style.display = "block";
  optionsBar.style.display  = "block";

  // Guardo en localStorage
  localStorage.setItem("selectedWorker", w.nombre);
}

// 3. Al pulsar “Registro de producción diaria” redirijo pasando el nombre
function registerProduction() {
  const nombre = localStorage.getItem("selectedWorker");
  if (!nombre) {
    alert("Selecciona un trabajador primero.");
    return;
  }
  // paso el nombre como parámetro en la URL
  const url = "registroP.html?worker=" + encodeURIComponent(nombre);
  // uso replace para que el botón atrás no vuelva a index.html
  window.location.replace(url);
}

// (resto de funciones: viewData, checkEfficiency, generateReport, login, admin…)

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
