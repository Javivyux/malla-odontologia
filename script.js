const estados = ["pendiente", "cursando", "aprobado"];

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
        const estadoActual = localStorage.getItem(ramo.nombre) || "pendiente";
        divRamo.classList.add("ramo", estadoActual);
        divRamo.textContent = ramo.nombre;

        divRamo.addEventListener("click", () => {
          let current = estados.indexOf(divRamo.classList[1]);
          divRamo.classList.remove(estados[current]);
          current = (current + 1) % estados.length;
          divRamo.classList.add(estados[current]);
          localStorage.setItem(ramo.nombre, estados[current]);
        });

        div.appendChild(divRamo);
      });

      contenedor.appendChild(div);
    });
  });
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
function descargarAvance() {
  const data = {};
  document.querySelectorAll(".ramo").forEach(ramo => {
    data[ramo.textContent] = ramo.classList[1]; // estado
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "mi_avance_malla.json";
  link.click();
}
