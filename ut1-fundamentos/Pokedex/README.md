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
