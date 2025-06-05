let rows = [];
let totalGanancia = 0;
let promedioAuxiliar = 0;
let actualizarPromedio = false;

function agregarFila() {
    const gananciaInput = document.getElementById('ganancia');
    const ganancia = parseFloat(gananciaInput.value);
    if (isNaN(ganancia)) return;

    totalGanancia += ganancia;

    if (actualizarPromedio || rows.length === 0) {
        promedioAuxiliar = totalGanancia;
        actualizarPromedio = false;
    }

    const descuento = 0; // Por ahora fijo
    const saldo = ganancia - descuento;
    const acumulado = promedioAuxiliar;

    const nuevaFila = {
        ganancia,
        acumulado,
        descuento,
        saldo,
        auxiliar: 0
    };

    rows.push(nuevaFila);
    actualizarTabla();
    gananciaInput.value = '';
}

function actualizarPromedioSwitch(valor) {
    // valor viene como booleano (true o false)
    actualizarPromedio = valor;
}

function actualizarTabla() {
    const tabla = document.getElementById('tablaBody');
    tabla.innerHTML = '';

    const storedWorker = localStorage.getItem("selectedWorker");
    if (!storedWorker) {
        alert("No hay trabajador seleccionado. Regresa a la página principal.");
        window.location.replace("index.html");
        return;
    }
    document.getElementById("workerName").textContent = storedWorker;

    rows.forEach((fila, index) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${fila.ganancia}</td>
            <td>${fila.acumulado}</td>
            <td>${fila.descuento}</td>
            <td>${fila.saldo}</td>
            <td>${fila.auxiliar}</td>
        `;

        tabla.appendChild(tr);
    });
}
