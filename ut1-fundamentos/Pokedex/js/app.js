const formulario = document.querySelector("#formulario-busqueda");
const inputBusqueda = document.querySelector("#busqueda");
const mensaje = document.querySelector("#mensaje");
const resultado = document.querySelector("#resultado");
const botonBuscar = formulario.querySelector("button");
const botonCargar = document.querySelector("#boton-cargar");
const contenedorTarjetas = document.querySelector("#tarjetas");

const TOTAL_POKEMON = 151;
let pokemons = [];

const obtenerPokemon = async (busqueda) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${busqueda}`;
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error("Pokémon no encontrado.");
  }

  const datos =  await respuesta.json();

  return new Pokemon(datos);

};

const obtenerTodos = () => {
  const peticiones = Array.from({ length: TOTAL_POKEMON }, (_, i) =>
    obtenerPokemon(i + 1)
  );
  return Promise.all(peticiones);
};

const mostrarPokemon = (pokemon) => {
  const tiposHTML = pokemon.tipos
    .map((tipo) => `<span class="tipo tipo--${tipo}">${tipo}</span>`)
    .join("");

  resultado.innerHTML = `
    <article class="pokemon">
      <p class="pokemon__numero">N.º ${pokemon.idFormateado}</p>

      <img
        class="pokemon__imagen"
        src="${pokemon.spriteFrontal}"
        alt="Imagen de ${pokemon.nombre}"
      >

      <h2 class="pokemon__nombre">${pokemon.nombreFormateado}</h2>

      <div class="pokemon__datos">
        <p><strong>Altura</strong><br>${pokemon.altura} m</p>
        <p><strong>Peso</strong><br>${pokemon.peso} kg</p>
      </div>

      <div class="pokemon__tipos">
        ${tiposHTML}
      </div>
    </article>
  `;
};

const crearTarjetaHTML = (pokemon) => {
  const tiposHTML = pokemon.tipos
    .map((tipo) => `<span class="tipo tipo--${tipo}">${tipo}</span>`)
    .join("");

  return `
    <article class="tarjeta">
      <p class="tarjeta__numero">N.º ${pokemon.idFormateado}</p>

      <div class="tarjeta__imagenes">
        <img
          class="tarjeta__sprite tarjeta__sprite--trasero"
          src="${pokemon.spriteTrasero}"
          alt="${pokemon.nombreFormateado} visto de espaldas"
        >
        <img
          class="tarjeta__sprite tarjeta__sprite--frontal"
          src="${pokemon.spriteFrontal}"
          alt="${pokemon.nombreFormateado} visto de frente"
        >
      </div>

      <h2 class="tarjeta__nombre">${pokemon.nombreFormateado}</h2>

      <div class="tarjeta__tipos">${tiposHTML}</div>

      <p class="tarjeta__medidas">
        <span>${pokemon.altura} m</span>
        <span>${pokemon.peso} kg</span>
      </p>
    </article>
  `;
};

const mostrarTarjetas = (lista) => {
  contenedorTarjetas.innerHTML = lista.map(crearTarjetaHTML).join("");
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

botonCargar.addEventListener("click", async () => {
  mensaje.textContent = "Cargando Pokémon...";
  resultado.innerHTML = "";
  botonCargar.disabled = true;

  try {
    pokemons = await obtenerTodos();
    mostrarTarjetas(pokemons);
    mensaje.textContent = `Se han cargado ${pokemons.length} Pokémon.`;
  } catch (error) {
    pokemons = [];
    mensaje.textContent =
      "No se han podido cargar los Pokémon. Comprueba tu conexión e inténtalo de nuevo.";
    botonCargar.disabled = false;
  }
});