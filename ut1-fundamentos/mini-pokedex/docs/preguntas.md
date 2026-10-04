# Mini-Pokédex: preguntas de repaso

Respuestas a las preguntas de la guía sobre el JavaScript de la Mini-Pokédex (eventos, asincronía, `fetch`, `map`, `try/catch`).

## Índice

1. [Formulario y eventos](#1-formulario-y-eventos)
2. [Asincronía y API](#2-asincronía-y-api)
3. [Transformar y pintar datos](#3-transformar-y-pintar-datos)
4. [Control de errores y diseño](#4-control-de-errores-y-diseño)
5. [Ampliación](#5-ampliación)

---

## 1. Formulario y eventos

### 1. ¿Por qué escuchamos el evento `submit` del formulario?

Porque `submit` se dispara con **cualquier** forma de enviar el formulario: pulsar el botón *o* pulsar Enter dentro del input. Si escucháramos solo el `click` del botón, Enter no funcionaría.

### 2. ¿Qué ocurriría si eliminamos `evento.preventDefault()`?

El navegador haría su comportamiento por defecto: enviar el formulario y **recargar la página**. Se perdería todo lo que JS acaba de pintar y la búsqueda no llegaría a verse.

### 3. ¿Para qué utilizamos `trim()` y `toLowerCase()`?

| Método | Qué hace | Ejemplo |
|---|---|---|
| `trim()` | Quita espacios al principio y al final | `" pikachu "` → `"pikachu"` |
| `toLowerCase()` | Pasa el texto a minúsculas | `"Pikachu"` → `"pikachu"` |

La PokéAPI espera los nombres en minúscula y sin espacios. Así el usuario puede escribir de cualquier forma y la búsqueda sigue funcionando.

---

## 2. Asincronía y API

### 4. ¿Por qué `obtenerPokemon()` está declarada con `async`?

- Porque dentro usa `await`, y `await` solo se puede usar en funciones `async`.
- Hace que la función **siempre devuelva una promesa**, lo adecuado cuando el resultado llega más tarde (cuando responde la red).

### 5. ¿Qué devuelve `fetch()`?

Una **promesa** que, al resolverse, da un objeto `Response`: la respuesta HTTP (estado, cabeceras y cuerpo aún sin leer).

### 6. ¿Para qué se utiliza `await`?

Para **pausar la función** hasta que una promesa termine y obtener su valor, escribiendo el código como si fuera secuencial. La función se pausa, pero la página no se bloquea.

### 7. ¿Por qué debemos comprobar `respuesta.ok`?

`fetch` solo falla por problemas de red. Si el Pokémon no existe, la API responde con un **404** y `fetch` lo considera una petición "exitosa". `respuesta.ok` es `false` para los códigos que no son 2xx, así que es la forma de detectar ese caso y lanzar nuestro propio error con `throw`.

```javascript
if (!respuesta.ok) {
  throw new Error("Pokémon no encontrado.");
}
```

### 8. ¿Qué hace `respuesta.json()`?

Lee el cuerpo de la respuesta (texto en formato JSON) y lo **convierte en un objeto JavaScript** (`datos.name`, `datos.id`...). También devuelve una promesa, por eso lleva `await`.

---

## 3. Transformar y pintar datos

### 9. ¿Por qué no devolvemos directamente todos los datos recibidos?

La API devuelve un objeto enorme con cientos de campos que no necesitamos. Conviene devolver solo lo necesario (id, nombre, imagen, altura, peso, tipos) porque:

- el resto del código queda más simple;
- `mostrarPokemon` no depende de la estructura interna de la API;
- si la API cambia, solo se toca un sitio.

> **Pendiente de confirmar:** la versión de `obtenerPokemon` vista en clase devolvía `datos` completos, así que esta transformación debe de hacerse en otra función. Comprobarlo en el código.

### 10. ¿Qué resultado produce `map()` al transformar los tipos?

Un **array nuevo** del mismo tamaño, donde cada elemento es el resultado de aplicar la función flecha al original. El array original no se modifica.

```javascript
["grass", "poison"].map((tipo) => `<span class="tipo">${tipo}</span>`);
// ['<span class="tipo">grass</span>', '<span class="tipo">poison</span>']
```

### 11. ¿Por qué utilizamos `join("")` después de `map()`?

`map` devuelve un **array**, y dentro de la plantilla necesitamos **un solo texto**. `join("")` une los elementos sin nada entre ellos.

Sin `join`, al meter el array en `${}` JS lo convertiría a texto separando los elementos con **comas**, y se verían comas sueltas en pantalla.

---

## 4. Control de errores y diseño

### 12. ¿Qué diferencia existe entre `try` y `catch`?

| Bloque | Función |
|---|---|
| `try` | El código que **intentamos ejecutar**, donde algo puede fallar |
| `catch` | Se ejecuta **solo si algo dentro del `try` lanza un error**; recibe ese error como parámetro |

Si no hay error, el `catch` se ignora. Si lo hay,  el `try` se corta en ese punto y salta al `catch`.

```javascript
try {
  const pokemon = await obtenerPokemon(busqueda);
  mostrarPokemon(pokemon);
} catch (error) {
  mensaje.textContent = error.message;
}
```

### 13. ¿Por qué hemos separado `obtenerPokemon()` y `mostrarPokemon()`?

Por **separación de responsabilidades**: una función pide los datos (lógica) y la otra los pinta (interfaz).

- Cada una es más fácil de entender y de probar.
- Se puede cambiar una sin tocar la otra (otra API, otro diseño).
- Se pueden reutilizar por separado.

### 14. ¿Qué función cumple `formatearId()`?

> **Pendiente de confirmar:** todavía no se ha visto su código.

Por el nombre, lo más probable es que convierta el número del Pokémon a un formato uniforme, por ejemplo `25` → `#025` (rellenando con ceros). Verificarlo leyendo la función.

---

## 5. Ampliación

### 15. ¿Qué habría que modificar para mostrar varios Pokémon simultáneamente?

1. **En `mostrarPokemon`:** en vez de `resultado.innerHTML = ...` (que *reemplaza*), **añadir** la ficha con `resultado.insertAdjacentHTML("beforeend", ...)` o `+=`.
2. **En el submit:** no vaciar `resultado.innerHTML = ""` al buscar (ni en el `if` ni antes del `try`).
3. **En el CSS:** `.resultado` pasa de `display: flex; justify-content: center` a algo que admita varias tarjetas, como `flex-wrap: wrap` con `gap`, o una rejilla (`grid`).

Opcionalmente: un botón para limpiar la lista y una comprobación para evitar duplicados.

---

## Resumen del flujo completo

```
submit → preventDefault → leer, trim y toLowerCase
       → ¿vacío? → aviso y fin
       → "Cargando..." → try { obtenerPokemon (fetch + ok + json)
                               → mostrarPokemon (map + join + innerHTML)
                               → limpiar mensaje }
                         catch { error.message → #mensaje }
```