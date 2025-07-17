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
