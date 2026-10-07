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

## 4. Barra de búsqueda y filtros

### Funcionamiento de la búsqueda
Primero normalizo lo que escribe el usuario con `trim()` y `toLowerCase()`,
así da igual poner espacios o mayúsculas. Después hay dos casos:

- Si el texto son solo dígitos (lo compruebo con la expresión regular
  `/^\d+$/`), busco el Pokémon con ese número exacto.
- Si no, busco el texto como fragmento del nombre con `includes`. Por
  ejemplo, `char` encuentra a Charmander, Charmeleon y Charizard.

La lista se filtra en vivo con el evento `input`, es decir, se actualiza
cada vez que escribo una letra. El evento `submit` del formulario (botón
Buscar o Enter) hace lo mismo, con `preventDefault()` para que la página no
se recargue.

### Filtro por tipo
Las opciones del selector no las escribí a mano, se generan con los datos
cargados en `rellenarSelectorTipos`:

1. `flatMap` junta los tipos de todos los Pokémon en una sola lista.
2. `new Set(...)` elimina los repetidos.
3. `sort()` los ordena alfabéticamente.

Con eso creo un `<option>` por cada tipo, más la opción "Todos". El filtro
se aplica con el evento `change` del selector.

### Combinación de ambos filtros
Todo está en una única función, `filtrarPokemons`, que lee a la vez el
cuadro de texto y el selector de tipo y usa `filter` con las dos condiciones
unidas por `&&`. Un Pokémon solo se muestra si cumple las dos. Si un
control está vacío, su condición da siempre `true` y no filtra nada.
Por ejemplo, `char` + tipo `fire` deja solo a los Charmander y compañía.
Después `actualizarVista` pinta las tarjetas y muestra cuántos se ven
("Mostrando X de 151") o un aviso si no hay resultados.

### Conservación de funcionalidades anteriores
La búsqueda por nombre o número de la práctica guiada sigue funcionando
(`25` y `pikachu` encuentran a Pikachu), pero ahora filtra los datos que ya
están cargados en el array `pokemons`, así que no hace peticiones nuevas a
la API. Por eso el buscador y el selector están desactivados hasta que se
pulsa "Cargar los 151 Pokémon".

### Problemas encontrados y soluciones
- **El 25 también encontraba el 125:** con `includes` sobre el número, al
  buscar `25` salían también el 125. Lo solucioné comparando el id de forma
  exacta cuando el texto son solo dígitos.
- **Controles antes de cargar:** si se buscaba antes de cargar los Pokémon
  no había nada que filtrar, así que desactivo el buscador y el selector
  hasta que la carga termina bien.

### Capturas
![Pikachu](assets/readme/14-busqueda-pikachu.png)
![Número 25](assets/readme/15-busqueda-numero.png)
![Fragmento char](assets/readme/16-busqueda-fragmento.png)
![Sin resultados](assets/readme/17-sin-resultados.png)
![Filtro fire](assets/readme/18-filtro-tipo.png)
![Filtro combinado](assets/readme/19-filtro-combinado.png)
![Selector de tipos](assets/readme/20-selector-tipos.png)
