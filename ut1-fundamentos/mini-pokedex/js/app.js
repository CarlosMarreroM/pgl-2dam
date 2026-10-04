const formulario = document.querySelector("#formulario-busqueda");
const inputBusqueda = document.querySelector("#busqueda");
const mensaje = document.querySelector("#mensaje");
const resultado = document.querySelector("#resultado");
const botonBuscar = formulario.querySelector("button");

const obtenerPokemon = async (busqueda) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${busqueda}`;
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error("Pokémon no encontrado.");
  }

  const datos =  await respuesta.json();

  return {
    id: datos.id,
    nombre: datos.name,
    imagen: datos.sprites.front_shiny,
    altura: datos.height,
    peso: datos.weight,
    tipos: datos.types.map(({ type }) => type.name),
  };
};

const formatearId = (id) => {
  return String(id).padStart(3, "0");
};

const mostrarPokemon = (pokemon) => {
  const tiposHTML = pokemon.tipos
    .map((tipo) => `<span class="tipo">${tipo}</span>`)
    .join("");

  resultado.innerHTML = `
    <article class="pokemon">
      <p class="pokemon__numero">N.º ${formatearId(pokemon.id)}</p>

      <img
        class="pokemon__imagen"
        src="${pokemon.imagen}"
        alt="Imagen de ${pokemon.nombre}"
      >

      <h2 class="pokemon__nombre">${pokemon.nombre}</h2>

      <div class="pokemon__datos">
        <p><strong>Altura</strong><br>${pokemon.altura / 10} m</p>
        <p><strong>Peso</strong><br>${pokemon.peso / 10} kg</p>
      </div>

      <div class="pokemon__tipos">
        ${tiposHTML}
      </div>
    </article>
  `;
};

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const busqueda = inputBusqueda.value.trim().toLowerCase();

  if (!busqueda) {
    mensaje.textContent = "Introduce un nombre o número.";
    resultado.innerHTML = "";
    return;
  }

  mensaje.textContent = "Cargando...";
  resultado.innerHTML = "";
  botonBuscar.disabled = true;

  try {
    const pokemon = await obtenerPokemon(busqueda);

    mostrarPokemon(pokemon);
    mensaje.textContent = "";
    inputBusqueda.value = "";
    inputBusqueda.focus();
  } catch (error) {
    mensaje.textContent = error.message;
  } finally {
    botonBuscar.disabled = false;
  }



});