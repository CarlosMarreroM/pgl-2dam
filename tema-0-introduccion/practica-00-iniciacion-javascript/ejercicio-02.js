// Declara los datos
const nombre = "Bulbasaur";
const nivel = 10;
const experienciaActual = 50;
const experienciaGanada = 30;

// Realiza una operación
const experienciaTotal = experienciaActual + experienciaGanada;

console.log(`${nombre} tenía ${experienciaActual} puntos de experiencia.`);
console.log(`${nombre} ha ganado ${experienciaGanada} puntos.`);
console.log(`Ahora tiene ${experienciaTotal} puntos de experiencia.`);

// Comprueba una condición
if (experienciaTotal >= 100) {
    console.log(`${nombre} puede subir de nivel.`);
} else {
    console.log(`${nombre} todavía no puede subir de nivel.`);
}