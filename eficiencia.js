 const trabajadores = [
      "Luis Oliveros",
      "Fernando Arias",
      "Jesus Arteaga",
      "Nataly Rodriguez",
      "Angela Pacheco"
    ];

    const tiemposReferencia = {
      "C2D + PLUS": 30.0,
      "D2-2 TP C/CH UÑAS": 73.2,
      "C2PC-5(15)OJ ALUM sin pegar ojalete": 82.3,
      "C1D-2 TIPO PISTOLA": 73.2,
      "REMACHADA DE GUANTE": 45.0
    };

    const tableBody = document.getElementById("tableBody");

    trabajadores.forEach(trabajador => {
      const row = document.createElement("tr");

      const tdNombre = document.createElement("td");
      tdNombre.textContent = trabajador;

      const tdRef = document.createElement("td");
      const inputRef = document.createElement("input");
      inputRef.placeholder = "Referencia";
      tdRef.appendChild(inputRef);

      const tdCant = document.createElement("td");
      const inputCant = document.createElement("input");
      inputCant.type = "number";
      inputCant.placeholder = "Docenas";
      tdCant.appendChild(inputCant);

      const tdEfic = document.createElement("td");
      tdEfic.textContent = "-";

      const tdMsg = document.createElement("td");
      tdMsg.classList.add("error");

      // Evento de cálculo
      const calcular = () => {
        const ref = inputRef.value.trim();
        const cant = parseFloat(inputCant.value);
        const minutosDia = parseInt(document.getElementById("daySelect").value);

        if (!ref || isNaN(cant)) {
          tdEfic.textContent = "-";
          tdMsg.textContent = "Completa ambos campos";
          tdEfic.className = "";
          return;
        }

        if (!tiemposReferencia[ref]) {
          tdEfic.textContent = "-";
          tdMsg.textContent = "Referencia no registrada";
          tdEfic.className = "";
          return;
        }

        const minutosTotal = cant * tiemposReferencia[ref];
        const eficiencia = minutosTotal / minutosDia;
        const porcentaje = (eficiencia * 100).toFixed(1);

        tdEfic.textContent = porcentaje + "%";
        tdMsg.textContent = "";
        tdEfic.className = eficiencia < 0.86 ? "low-efficiency" : "high-efficiency";
      };

      inputRef.addEventListener("input", calcular);
      inputCant.addEventListener("input", calcular);
      document.getElementById("daySelect").addEventListener("change", calcular);

      row.appendChild(tdNombre);
      row.appendChild(tdRef);
      row.appendChild(tdCant);
      row.appendChild(tdEfic);
      row.appendChild(tdMsg);
      tableBody.appendChild(row);
    });
