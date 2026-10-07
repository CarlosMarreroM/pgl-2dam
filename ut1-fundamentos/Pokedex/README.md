# Pokédex con JavaScript

**Autor:** Carlos Marrero Martin
**Tecnologías:** HTML, CSS y JavaScript puro, PokéAPI

> Memoria paso a paso del desarrollo de la actividad final.

## 1. Punto de partida

### Descripción

La mini-Pokédex de la práctica guiada permite buscar un Pokémon por nombre
o número y muestra una tarjeta con su imagen, número, altura, peso y tipos,
consultando PokéAPI con `fetch`.

### Estructura inicial

```text
pokedex/
├── index.html
├── css/
│   └── style.css
└── js/
    └── app.js
```

### Funcionalidades ya implementadas

- Búsqueda por nombre o número (sin importar mayúsculas ni espacios).
- Tarjeta generada dinámicamente con JavaScript.
- Mensaje de carga y botón desactivado durante la consulta.
- Validación de campo vacío y error controlado si el Pokémon no existe.

### Pruebas realizadas

| Prueba | Resultado |
|---|---|
| La página carga correctamente | ✅ |
| Búsqueda por nombre (`pikachu`) | ✅ |
| Búsqueda por número (`25`) | ✅ |
| La información aparece en pantalla | ✅ |
| Error mostrado con mensaje comprensible | ✅ |
| Sin errores en consola en uso normal | ✅ (el 404 de un Pokémon inexistente lo registra el navegador, no es un error del código) |

### Capturas

![Aplicación funcionando](assets/readme/01-inicio.png)
![Búsqueda correcta](assets/readme/02-busqueda-pikachu.png)
![Pokémon inexistente](assets/readme/03-error-pokemon.png)

### Commit de partida

[c8dac13](https://github.com/CarlosMarreroM/pgl-2dam/commit/c8dac13a4923e0f30415584566a0b5577371ebac)

## 2. Carga de los 151 Pokémon

### Cambios respecto al código inicial

- Nuevo archivo `js/Pokemon.js` con la clase `Pokemon`.
- Botón "Cargar los 151 Pokémon" en `index.html`.
- `obtenerPokemon` ahora devuelve un objeto `Pokemon`.
- Nueva función `obtenerTodos` que consulta los ids del 1 al 151.

### Consulta y transformación de datos

Con `fetch` hago la petición a `https://pokeapi.co/api/v2/pokemon/{id}` y
con `respuesta.json()` convierto la respuesta en un objeto de JavaScript.
Ese objeto trae muchísimos datos, así que en la clase `Pokemon` solo me
quedo con los que necesito: id, nombre, sprites, tipos, altura, peso,
experiencia base, habilidades y estadísticas.

La API da la altura en decímetros y el peso en hectogramos, por eso los
divido entre 10 para tener metros y kilogramos (por ejemplo, Pikachu
mide `4` dm → 0,4 m y pesa `60` hg → 6 kg).

Para cargar los 151 creo un array con 151 peticiones y las lanzo todas a la
vez con `Promise.all`. Aunque unas respondan antes que otras, `Promise.all`
devuelve los resultados en el mismo orden en que puse las peticiones, así
que la lista queda siempre del 1 al 151. Si falla una sola, falla todo y se
muestra el mensaje de error.

### Capturas

![JSON de la API](assets/readme/04-json-consola.png)
![Colección cargada](assets/readme/05-console-table.png)
![Estado de carga](assets/readme/06-cargando.png)
![Error de conexión](assets/readme/07-error-conexion.png)
![Conversión de unidades](assets/readme/08-conversion-unidades.png)

## 3. Construcción de las tarjetas

### Datos seleccionados de PokéAPI

De cada Pokémon uso estos datos:

- `id`, que se muestra con tres cifras (`001`) usando `padStart`.
- `name`, con la primera letra en mayúscula.
- Los sprites `back_default` (de espaldas) y `front_default` (de frente).
- Los tipos, sacados de `types`.
- La altura en metros y el peso en kilogramos (ya convertidos).

### Generación dinámica de las tarjetas

`crearTarjetaHTML` recibe un Pokémon y devuelve un string con el HTML de su
tarjeta (número, imágenes, nombre, tipos y medidas). `mostrarTarjetas`
recorre la lista con `map` para crear una tarjeta por Pokémon, las une con
`join("")` en un solo texto y lo mete en el contenedor con `innerHTML`.
Así se pintan las 151 de una vez.

### Cambio entre sprite trasero y frontal

Cada tarjeta lleva las dos imágenes a la vez. Por defecto el CSS solo
muestra la de espaldas, y al pasar el cursor por encima (`:hover`) oculta
esa y muestra la frontal. Como las dos imágenes ya están en la página, no se
hace ninguna petición nueva al pasar el ratón y el cambio es instantáneo.

### Cuadrícula adaptable

La cuadrícula usa `repeat(auto-fill, minmax(min(100%, 200px), 1fr))`.
`minmax` hace que cada tarjeta mida como mínimo 200px y como máximo lo que
quede libre, y `auto-fill` mete tantas columnas como quepan. Así se adapta
sola al ancho de la pantalla sin necesidad de media queries. El `min(100%,
200px)` evita que en pantallas muy estrechas la tarjeta se salga.

### Capturas

![Colección](assets/readme/09-coleccion-tarjetas.png)
![Tarjeta normal](assets/readme/10-tarjeta-espaldas.png)
![Tarjeta con cursor](assets/readme/11-tarjeta-hover.png)
![Uno y dos tipos](assets/readme/12-tipos.png)
![Móvil](assets/readme/13-movil.png)
