// ─── ELEMENTOS DOM ─────────────────────────────────────────────────────────────
const loginPanel     = document.getElementById("loginPanel");
const adminPanel     = document.getElementById("adminPanel");
const adminBtn       = document.getElementById("adminBtn");
const welcomeMessage = document.getElementById("welcomeMessage");

const workerListEl   = document.getElementById("workerList");
const profileCard    = document.querySelector(".profile");
const optionsBar     = document.querySelector(".options");
const workerNameEl   = document.getElementById("workerName");
const workerAreaEl   = document.getElementById("workerArea");
const workerImgEl    = document.getElementById("workerImg");

// ─── DATOS DE TRABAJADORES ──────────────────────────────────────────────────────
const workers = [
  { nombre: "Luis Oliveros",    area: "Volteado", genero: "hombre" },
  { nombre: "Fernando Arias",   area: "Volteado", genero: "hombre" },
  { nombre: "Jesus Arteaga",    area: "Volteado", genero: "hombre" },
  { nombre: "David Parra",      area: "Volteado", genero: "hombre" },
  { nombre: "Alex (nuevo)",     area: "Volteado", genero: "hombre" },
  { nombre: "Nataly Rodriguez", area: "Cerrado",  genero: "mujer"  },
  { nombre: "Gustavo Alvarado", area: "Cerrado",  genero: "hombre" },
  { nombre: "Carlos Caicedo",   area: "Cerrado",  genero: "hombre" },
  { nombre: "Kevin Lozano",     area: "Cerrado",  genero: "hombre" },
  { nombre: "Angela Pacheco",   area: "Cerrado",  genero: "mujer"  },
  { nombre: "Liliana Diaz",     area: "Armado",   genero: "mujer"  },
  { nombre: "Claudia Gonzales", area: "Armado",   genero: "mujer"  },
  { nombre: "Johanna Zuñiga",   area: "Armado",   genero: "mujer"  },
  { nombre: "Solveida Gesama",  area: "Armado",   genero: "mujer"  },
  { nombre: "Nancy Arias",      area: "Armado",   genero: "mujer"  },
  { nombre: "Karolie Luna",     area: "Armado",   genero: "mujer"  },
  { nombre: "Amanda Cardona",   area: "Armado",   genero: "mujer"  },
  { nombre: "Paola Diaz",       area: "Armado",   genero: "mujer"  },
  { nombre: "Blanca Andrade",   area: "Armado",   genero: "mujer"  },
  { nombre: "Marcela Escobar",  area: "Armado",   genero: "mujer"  }
];

// ─── INICIALIZACIÓN AL CARGAR ───────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // 1) Oculto inicialmente panels
  loginPanel.style.display   = "none";
  adminPanel.style.display   = "none";
  adminBtn.disabled          = true;

  // 2) Genero menú lateral de trabajadores
  workers.forEach(w => {
    const li = document.createElement("li");
    li.textContent = w.nombre;
    li.addEventListener("click", () => selectWorker(w));
    workerListEl.appendChild(li);
  });

  // 3) Si ya hay uno en localStorage, lo reaplico
  const stored = localStorage.getItem("selectedWorker");
  if (stored) {
    const w = workers.find(x => x.nombre === stored);
    if (w) selectWorker(w);
  }
});

// ─── FUNCIONES DE LOGIN / ADMIN ─────────────────────────────────────────────────
function showLoginPanel() {
  loginPanel.style.display = "block";
}

function validateAdmin() {
  const userName = document.getElementById("adminUser").value.trim();
  const pass     = document.getElementById("adminPass").value;
  if (pass === "2025") {
    loginPanel.style.display   = "none";
    adminBtn.disabled          = false;
    welcomeMessage.textContent  = `Bienvenido, ${userName}`;
  } else {
    alert("Contraseña incorrecta.");
  }
}

function showAdminPanel() {
  adminPanel.style.display = "block";
  // Opcional: ocultar secciones internas hasta que el usuario elija
  document.getElementById("referenceSection").style.display = "none";
  document.getElementById("workerSection").style.display    = "none";
}

function showReferences() {
  document.getElementById("referenceSection").style.display = "block";
  document.getElementById("workerSection").style.display    = "none";
}

function showWorkers() {
  document.getElementById("workerSection").style.display    = "block";
  document.getElementById("referenceSection").style.display = "none";
}

// ─── SELECCIÓN DE TRABAJADOR ────────────────────────────────────────────────────
function selectWorker(worker) {
  // Actualizo UI
  workerNameEl.textContent = worker.nombre;
  workerAreaEl.textContent = "Área: " + worker.area;
  workerImgEl.src = worker.genero === "hombre"
    ? "https://www.w3schools.com/howto/img_avatar.png"
    : "https://www.w3schools.com/howto/img_avatar2.png";
  profileCard.style.display = "block";
  optionsBar.style.display  = "block";

  // Guardo la selección
  localStorage.setItem("selectedWorker", worker.nombre);
}

// ─── NAVEGACIÓN: Registro de Producción ────────────────────────────────────────
function registerProduction() {
  const stored = localStorage.getItem("selectedWorker");
  if (!stored) {
    alert("Selecciona un trabajador primero.");
    return;
  }
  // Redirijo sin historial para bloquear "volver atrás"
  window.location.replace("registroP.html");
}

// ─── NAVEGACIÓN: Consulta Quincenal────────────────────────────────────────
function viewData() {
  // Verificar si el trabajador ha sido seleccionado
  const storedWorker = localStorage.getItem("selectedWorker");
  if (!storedWorker) {
    alert("No hay trabajador seleccionado. Regresa a la página principal.");
    return;
  }

  // Redirigir a consulta.html con el trabajador en la URL
  window.location.href = `consulta.html?worker=${encodeURIComponent(storedWorker)}`;
}


//Redirigir a eficiencias ____________________________________________________________
function checkEfficiency() {
  const stored = localStorage.getItem("selectedWorker");
  if (!stored) {
    alert("Selecciona un trabajador primero.");
    return;
  }
  // Redirigir al archivo eficiencia.html
  window.location.href = "eficiencia.html?worker=" + encodeURIComponent(stored);
}

function generateReport() {
  const stored = localStorage.getItem("selectedWorker");
  if (!stored) {
    alert("Selecciona un trabajador primero.");
    return;
  }
  alert(`Informe quincenal de ${stored}`);
}

// ─── OTRAS FUNCIONES (sólo alert por ahora) ───────────────────────────────────
function generateReport() { alert(`Informe quincenal de ${workerNameEl.textContent}`); }
