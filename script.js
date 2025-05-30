function showLoginPanel() {
    document.getElementById("loginPanel").style.display = "block";
}

function validateAdmin() {
    const userName = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;

    if (pass === "2025") {
        document.getElementById("loginPanel").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
        document.getElementById("welcomeMessage").textContent = "Bienvenido, " + userName;
    } else {
        alert("Contraseña incorrecta.");
    }
}

function showAdminPanel() {
    document.getElementById("adminPanel").style.display = "block";
}

// Lista de trabajadores
const workers = [
    { nombre: "Luis Oliveros", area: "Volteado", genero: "hombre" },
    { nombre: "Fernando Arias", area: "Volteado", genero: "hombre" },
    { nombre: "Jesus Arteaga", area: "Volteado", genero: "hombre" },
    { nombre: "David Parra", area: "Volteado", genero: "hombre" },
    { nombre: "Alex (nuevo)", area: "Volteado", genero: "hombre" },
    { nombre: "Nataly Rodriguez", area: "Cerrado", genero: "mujer" },
    { nombre: "Gustavo Alvarado", area: "Cerrado", genero: "hombre" },
    { nombre: "Carlos Caicedo", area: "Cerrado", genero: "hombre" },
    { nombre: "Kevin Lozano", area: "Cerrado", genero: "hombre" },
    { nombre: "Angela Pacheco", area: "Cerrado", genero: "mujer" },
    { nombre: "Liliana Diaz", area: "Armado", genero: "mujer" },
    { nombre: "Claudia Gonzales", area: "Armado", genero: "mujer" },
    { nombre: "Johanna Zuñiga", area: "Armado", genero: "mujer" },
    { nombre: "Solveida Gesama", area: "Armado", genero: "mujer" },
    { nombre: "Nancy Arias", area: "Armado", genero: "mujer" },
    { nombre: "Karolie Luna", area: "Armado", genero: "mujer" },
    { nombre: "Amanda Cardona", area: "Armado", genero: "mujer" },
    { nombre: "Alexander Moran", area: "Armado", genero: "hombre" },
    { nombre: "Blanca Andrade", area: "Armado", genero: "mujer" }
];

const workerList = document.getElementById("workerList");
const workerName = document.getElementById("workerName");
const workerArea = document.getElementById("workerArea");
const workerImg = document.getElementById("workerImg");
const profile = document.querySelector(".profile");
const options = document.querySelector(".options");

// Generar lista de trabajadores
workers.forEach(worker => {
    const li = document.createElement("li");
    li.textContent = worker.nombre;
    li.onclick = () => selectWorker(worker);
    workerList.appendChild(li);
});

function selectWorker(worker) {
    workerName.textContent = worker.nombre;
    workerArea.textContent = "Área: " + worker.area;
    workerImg.src = worker.genero === "hombre" ? "https://www.w3schools.com/howto/img_avatar.png" : "https://www.w3schools.com/howto/img_avatar2.png";

    profile.style.display = "block";
    options.style.display = "block";
}

function registerProduction() {
    window.location.href = "registroP.html";
}

function viewData() {
    alert("Consulta de datos quincenales de " + workerName.textContent);
}

function checkEfficiency() {
    alert("Revisión de eficiencia de " + workerName.textContent);
}

function generateReport() {
    alert("Generación de informe quincenal de " + workerName.textContent);
}

function showLoginPanel() {
    document.getElementById("loginPanel").style.display = "block";
}

function validateAdmin() {
    const userName = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;

    if (pass === "2025") {
        document.getElementById("loginPanel").style.display = "none";
        document.getElementById("welcomeMessage").textContent = "Bienvenido, " + userName;
        document.getElementById("adminBtn").disabled = false; // Activar botón de administrador
    } else {
        alert("Contraseña incorrecta.");
    }
}

function showAdminPanel() {
    document.getElementById("adminPanel").style.display = "block";
}

function showReferences() {
    document.getElementById("referenceSection").style.display = "block";
    document.getElementById("workerSection").style.display = "none";
}

function showWorkers() {
    document.getElementById("workerSection").style.display = "block";
    document.getElementById("referenceSection").style.display = "none";
}
