const estados = ["pendiente", "aprobado"];
let ramosPorNombre = {};

fetch("malla.json")
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById("malla");

    data.forEach((semestre, index) => {
      const div = document.createElement("div");
      div.classList.add("semestre");

      const titulo = document.createElement("h2");
      titulo.textContent = `Semestre ${index + 1}`;
      div.appendChild(titulo);

      semestre.forEach(ramo => {
        const divRamo = document.createElement("div");
        const estadoGuardado = localStorage.getItem(ramo.nombre) || "pendiente";
        divRamo.classList.add("ramo", estadoGuardado);
        divRamo.textContent = ramo.nombre;

        divRamo.dataset.nombre = ramo.nombre;
        divRamo.dataset.estado = estadoGuardado;
        divRamo.dataset.requisitos = JSON.stringify(ramo.requisitos || []);

        ramosPorNombre[ramo.nombre] = divRamo;

        divRamo.addEventListener("click", () => {
          toggleEstado(divRamo);
          actualizarDependientes();
        });

        div.appendChild(divRamo);
      });

      contenedor.appendChild(div);
    });

    // Primera vez que se carga todo → actualizar dependientes
    actualizarDependientes();
  });

function toggleEstado(ramoEl) {
  let estado = ramoEl.dataset.estado;
  let nuevoEstado = estado === "pendiente" ? "aprobado" : "pendiente";

  ramoEl.classList.remove(estado);
  ramoEl.classList.add(nuevoEstado);
  ramoEl.dataset.estado = nuevoEstado;
  localStorage.setItem(ramoEl.dataset.nombre, nuevoEstado);
}

function actualizarDependientes() {
  for (const nombre in ramosPorNombre) {
    const ramoEl = ramosPorNombre[nombre];
    const requisitos = JSON.parse(ramoEl.dataset.requisitos || "[]");

    if (ramoEl.dataset.estado === "aprobado") continue;

    let todosAprobados = requisitos.every(req => {
      const el = ramosPorNombre[req];
      return el && el.dataset.estado === "aprobado";
    });

    const estadoActual = ramoEl.dataset.estado;
    const nuevoEstado = todosAprobados ? "cursando" : "pendiente";

    if (estadoActual !== nuevoEstado) {
      ramoEl.classList.remove(estadoActual);
      ramoEl.classList.add(nuevoEstado);
      ramoEl.dataset.estado = nuevoEstado;
      localStorage.setItem(nombre, nuevoEstado);
    }
  }
}

function descargarAvance() {
  const data = {};
  document.querySelectorAll(".ramo").forEach(ramo => {
    data[ramo.textContent] = ramo.dataset.estado;
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "mi_avance_malla.json";
  link.click();
}

// Título animado ✨
const frases = [
  "✨ Malla Odonto UNAB 🍃",
  "🩶 Estudiando con estilo...",
  "🫠 ¿Dónde está mi café?",
  "🥹 Cursando la vida",
  "🍃 ¡Vamos que se puede!",
];

let i = 0;
setInterval(() => {
  document.title = frases[i % frases.length];
  i++;
}, 2500);
