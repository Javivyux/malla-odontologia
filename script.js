const estados = ["pendiente", "cursando", "aprobado"];
let ramosPorNombre = {};

document.addEventListener("DOMContentLoaded", () => {
  fetch("malla.json")
    .then(res => res.json())
    .then(data => cargarMalla(data))
    .catch(error => console.error("Error cargando la malla:", error));
});

function cargarMalla(data) {
  const contenedor = document.getElementById("malla");
  contenedor.innerHTML = "";

  data.forEach((semestre, index) => {
    const divSemestre = document.createElement("div");
    divSemestre.className = "semestre";

    const titulo = document.createElement("h2");
    titulo.textContent = `Semestre ${index + 1}`;
    divSemestre.appendChild(titulo);

    semestre.forEach(ramo => {
      const divRamo = crearElementoRamo(ramo);
      divSemestre.appendChild(divRamo);
    });

    contenedor.appendChild(divSemestre);
  });

  actualizarDependientes();
}

function crearElementoRamo(ramo) {
  const divRamo = document.createElement("div");
  const estadoGuardado = localStorage.getItem(ramo.nombre) || "pendiente";
  
  divRamo.className = `ramo ${estadoGuardado}`;
  divRamo.textContent = ramo.nombre;
  divRamo.dataset.nombre = ramo.nombre;
  divRamo.dataset.estado = estadoGuardado;
  divRamo.dataset.requisitos = JSON.stringify(ramo.requisitos || []);

  ramosPorNombre[ramo.nombre] = divRamo;

  divRamo.addEventListener("click", () => {
    cambiarEstado(divRamo);
    actualizarDependientes();
  });

  return divRamo;
}

function cambiarEstado(ramoEl) {
  const estadoActual = ramoEl.dataset.estado;
  const nuevoEstado = estados[(estados.indexOf(estadoActual) + 1) % estados.length];
  
  ramoEl.classList.remove(estadoActual);
  ramoEl.classList.add(nuevoEstado);
  ramoEl.dataset.estado = nuevoEstado;
  localStorage.setItem(ramoEl.dataset.nombre, nuevoEstado);
}

function actualizarDependientes() {
  Object.values(ramosPorNombre).forEach(ramoEl => {
    if (ramoEl.dataset.estado === "aprobado") return;

    const requisitos = JSON.parse(ramoEl.dataset.requisitos);
    const puedeCursar = requisitos.every(req => {
      const reqEl = ramosPorNombre[req];
      return reqEl && reqEl.dataset.estado === "aprobado";
    });

    const nuevoEstado = puedeCursar ? "cursando" : "pendiente";
    
    if (ramoEl.dataset.estado !== nuevoEstado) {
      ramoEl.classList.remove(ramoEl.dataset.estado);
      ramoEl.classList.add(nuevoEstado);
      ramoEl.dataset.estado = nuevoEstado;
      localStorage.setItem(ramoEl.dataset.nombre, nuevoEstado);
    }
  });
}

function descargarAvance() {
  const data = {};
  document.querySelectorAll(".ramo").forEach(ramo => {
    data[ramo.textContent] = ramo.dataset.estado;
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `avance_odontologia_${new Date().toISOString().slice(0,10)}.json`;
  link.click();
}

// Animación del título
const frases = [
  "✨ Malla Odonto UNAB 🍃",
  "🫠 ¿Dónde está mi café?",
  "🥹 Cursando la vida",
  "🍃 ¡Vamos que se puede!",
];

let i = 0;
setInterval(() => {
  document.title = frases[i % frases.length];
  i++;
}, 2500);
