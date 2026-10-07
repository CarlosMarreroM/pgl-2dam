const formulario = document.querySelector("#formulario-busqueda");
const inputBusqueda = document.querySelector("#busqueda");
const selectTipo = document.querySelector("#filtro-tipo");
const botonBuscar = formulario.querySelector("button");
const botonCargar = document.querySelector("#boton-cargar");
const mensaje = document.querySelector("#mensaje");
const contenedorTarjetas = document.querySelector("#tarjetas");
const dialogoDetalles = document.querySelector("#detalles");
const contenidoDetalles = document.querySelector("#detalles-contenido");

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

      <button type="button" class="tarjeta__boton" data-id="${pokemon.id}">
        Ver detalles
      </button>
    </article>
  `;
};

const mostrarTarjetas = (lista) => {
  contenedorTarjetas.innerHTML = lista.map(crearTarjetaHTML).join("");
};

/* ---------- Detalles ---------- */

const NOMBRES_ESTADISTICAS = {
  hp: "Puntos de salud",
  attack: "Ataque",
  defense: "Defensa",
  "special-attack": "Ataque especial",
  "special-defense": "Defensa especial",
  speed: "Velocidad",
};

const MAX_ESTADISTICA = 255;

const formatearTexto = (texto) => capitalizar(texto.replace(/-/g, " "));

const crearDetallesHTML = (pokemon) => {
  const tiposHTML = pokemon.tipos
    .map((tipo) => `<span class="tipo tipo--${tipo}">${tipo}</span>`)
    .join("");

  const habilidadesHTML = pokemon.habilidades
    .map((habilidad) => `<li>${formatearTexto(habilidad)}</li>`)
    .join("");

  const estadisticasHTML = pokemon.estadisticas
    .map(({ nombre, valor }) => {
      const porcentaje = Math.min((valor / MAX_ESTADISTICA) * 100, 100);
      return `
        <li class="estadistica">
          <span class="estadistica__nombre">${NOMBRES_ESTADISTICAS[nombre] ?? nombre}</span>
          <span class="estadistica__valor">${valor}</span>
          <span class="estadistica__barra" aria-hidden="true">
            <span class="estadistica__relleno" style="width: ${porcentaje}%"></span>
          </span>
        </li>
      `;
    })
    .join("");

  return `
    <button type="button" class="detalles__cerrar" aria-label="Cerrar detalles">✕</button>

    <p class="detalles__numero">N.º ${pokemon.idFormateado}</p>
    <h2 id="detalles-titulo" class="detalles__nombre">${pokemon.nombreFormateado}</h2>

    <img
      class="detalles__imagen"
      src="${pokemon.spriteFrontal}"
      alt="${pokemon.nombreFormateado} visto de frente"
    >

    <div class="tarjeta__tipos">${tiposHTML}</div>

    <p class="tarjeta__medidas">
      <span><strong>Altura</strong> ${pokemon.altura} m</span>
      <span><strong>Peso</strong> ${pokemon.peso} kg</span>
      <span><strong>Exp. base</strong> ${pokemon.experienciaBase ?? "—"}</span>
    </p>

    <h3>Habilidades</h3>
    <ul class="detalles__habilidades">${habilidadesHTML}</ul>

    <h3>Estadísticas base</h3>
    <ul class="detalles__estadisticas">${estadisticasHTML}</ul>
  `;
};

const abrirDetalles = (pokemon) => {
  contenidoDetalles.innerHTML = crearDetallesHTML(pokemon);
  dialogoDetalles.showModal();
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

contenedorTarjetas.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".tarjeta__boton");
  if (!boton) return;

  const pokemon = pokemons.find((p) => p.id === Number(boton.dataset.id));
  if (pokemon) abrirDetalles(pokemon);
});

dialogoDetalles.addEventListener("click", (evento) => {
  const pulsaCerrar = evento.target.closest(".detalles__cerrar");
  const pulsaFondo = evento.target === dialogoDetalles;

  if (pulsaCerrar || pulsaFondo) dialogoDetalles.close();
});

/* ---------- Estado inicial ---------- */

habilitarControles(false);