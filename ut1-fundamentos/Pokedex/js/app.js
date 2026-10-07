const formulario = document.querySelector("#formulario-busqueda");
const inputBusqueda = document.querySelector("#busqueda");
const selectTipo = document.querySelector("#filtro-tipo");
const botonBuscar = formulario.querySelector("button");
const botonCargar = document.querySelector("#boton-cargar");
const mensaje = document.querySelector("#mensaje");
const contenedorTarjetas = document.querySelector("#tarjetas");

const TOTAL_POKEMON = 151;
let pokemons = [];

/* ---------- Datos ---------- */

const obtenerPokemon = async (busqueda) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${busqueda}`;
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error("Pokémon no encontrado.");
  }

  const datos = await respuesta.json();
  return new Pokemon(datos);
};

const obtenerTodos = () => {
  const peticiones = Array.from({ length: TOTAL_POKEMON }, (_, i) =>
    obtenerPokemon(i + 1)
  );
  return Promise.all(peticiones);
};

/* ---------- Tarjetas ---------- */

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

/* ---------- Búsqueda y filtros ---------- */

const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

const habilitarControles = (activos) => {
  inputBusqueda.disabled = !activos;
  selectTipo.disabled = !activos;
  botonBuscar.disabled = !activos;
};

const rellenarSelectorTipos = () => {
  const tipos = [...new Set(pokemons.flatMap((p) => p.tipos))].sort();

  const opciones = tipos
    .map((tipo) => `<option value="${tipo}">${capitalizar(tipo)}</option>`)
    .join("");

  selectTipo.innerHTML = `<option value="">Todos</option>${opciones}`;
};

const filtrarPokemons = () => {
  const texto = inputBusqueda.value.trim().toLowerCase();
  const tipo = selectTipo.value;

  const coincideTexto = (pokemon) => {
    if (!texto) return true;
    // Si solo hay dígitos, se compara con el número exacto
    if (/^\d+$/.test(texto)) return pokemon.id === Number(texto);
    // Si no, se busca el fragmento dentro del nombre
    return pokemon.nombre.includes(texto);
  };

  const coincideTipo = (pokemon) => !tipo || pokemon.tipos.includes(tipo);

  return pokemons.filter(
    (pokemon) => coincideTexto(pokemon) && coincideTipo(pokemon)
  );
};

const actualizarVista = () => {
  const filtrados = filtrarPokemons();
  mostrarTarjetas(filtrados);

  if (filtrados.length === 0) {
    mensaje.textContent =
      "No se ha encontrado ningún Pokémon con esa búsqueda.";
  } else {
    mensaje.textContent = `Mostrando ${filtrados.length} de ${pokemons.length} Pokémon.`;
  }
};

/* ---------- Eventos ---------- */

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  actualizarVista();
});

inputBusqueda.addEventListener("input", actualizarVista);
selectTipo.addEventListener("change", actualizarVista);

botonCargar.addEventListener("click", async () => {
  mensaje.textContent = "Cargando Pokémon...";
  contenedorTarjetas.innerHTML = "";
  botonCargar.disabled = true;

  try {
    pokemons = await obtenerTodos();
    rellenarSelectorTipos();
    mostrarTarjetas(pokemons);
    habilitarControles(true);
    mensaje.textContent = `Se han cargado ${pokemons.length} Pokémon.`;
  } catch (error) {
    pokemons = [];
    mensaje.textContent =
      "No se han podido cargar los Pokémon. Comprueba tu conexión e inténtalo de nuevo.";
    botonCargar.disabled = false;
  }
});

/* ---------- Estado inicial ---------- */

habilitarControles(false);