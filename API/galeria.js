console.log("JS cargado correctamente: galeria.js");

async function obtenerPersonajes() {
  try {
    const respuesta = await fetch("https://rickandmortyapi.com/api/character");
    const informacion = await respuesta.json();
    renderizarPersonajes(informacion.results);

    // Ocultar loader y mostrar contenido
    document.getElementById("loader").style.display = "none";
    document.getElementById("contenido").classList.remove("d-none");
  } catch (error) {
    console.error("Hubo un error: ", error);
  }
}

function renderizarPersonajes(personajes) {
  const contenedor = document.getElementById("contenedorPersonajes");
  contenedor.innerHTML = "";

  personajes.forEach((personaje, index) => {
    contenedor.innerHTML += `
      <div class="col-lg-3 col-md-4 col-sm-6 mb-4 fade-in" style="animation-delay:${index * 0.1}s">
        <div class="card premium-card h-100">
          <div class="card-header fw-bold">${personaje.name}</div>
          <img src="${personaje.image}" class="card-img-top" alt="${personaje.name}">
          <div class="card-body">
            <p>Especie: <span>${personaje.species}</span></p>
            <p>Estado: <span>${personaje.status}</span></p>
            <p>Género: <span>${personaje.gender}</span></p>
          </div>
        </div>
      </div>`;
  });
}

obtenerPersonajes();

// Toggle modo oscuro/claro
document.getElementById("toggleModo").addEventListener("click", () => {
  document.body.classList.toggle("modo-oscuro");
  document.body.classList.toggle("modo-claro");
});
