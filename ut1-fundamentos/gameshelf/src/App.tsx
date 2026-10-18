import Button from "./components/Button";
import GameCard from "./components/GameCard";
import { useState } from "react";

type Game = {
  id: number;
  title: string;
  genre: string;
  price: number;
  available: boolean;
};

const games: Game[] = [
  { id: 1, title: "Hollow Knight", genre: "Aventura", price: 14.99, available: true },
  { id: 2, title: "Celeste", genre: "Plataformas", price: 19.99, available: true },
  { id: 3, title: "Stardew Valley", genre: "Simulación", price: 13.99, available: false },
  { id: 4, title: "Grand Theft Auto V", genre: "Acción", price: 29.99, available: true },
  { id: 5, title: "Red Dead Redemption 2", genre: "Aventura", price: 59.99, available: true },
  { id: 6, title: "Resident Evil 4", genre: "Survival Horror", price: 39.99, available: false },
  { id: 7, title: "The Witcher 3: Wild Hunt", genre: "RPG", price: 29.99, available: true },
  { id: 8, title: "Elden Ring", genre: "RPG", price: 59.99, available: true },
  { id: 9, title: "Minecraft", genre: "Sandbox", price: 26.95, available: true },
  { id: 10, title: "Hades", genre: "Roguelike", price: 24.99, available: false },
  { id: 11, title: "God of War", genre: "Acción", price: 49.99, available: true },
  { id: 12, title: "The Legend of Zelda: Breath of the Wild", genre: "Aventura", price: 69.99, available: false },
  { id: 13, title: "Cuphead", genre: "Plataformas", price: 19.99, available: true },
  { id: 14, title: "Portal 2", genre: "Puzles", price: 9.99, available: true },
  { id: 15, title: "Cyberpunk 2077", genre: "RPG", price: 59.99, available: false },
];

function App() {
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyCheap, setOnlyCheap] = useState(false);

  let visibleGames = games;

  if (onlyAvailable) {
    visibleGames = visibleGames.filter((game) => game.available);
  }

  if (onlyCheap) {
    visibleGames = visibleGames.filter((game) => game.price < 15);
  }

  return (
    <main className="max-w-275 mx-auto px-4 py-12">
      <h1 className="text-[2.5rem] font-bold text-accent text-center">GameShelf</h1>
      <p className="mt-2 mb-8 text-center">Mi catálogo de videojuegos</p>
      {/* Rejilla de tarjetas: se ajusta sola al ancho de la pantalla */}
      <section className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
        {visibleGames.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            genre={game.genre}
            price={game.price}
            available={game.available}
          />
        ))}
      </section>

      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Button onClick={() => setOnlyAvailable(!onlyAvailable)}>
          {onlyAvailable ? "Mostrar todos" : "Mostrar disponibles"}
        </Button>
        <Button onClick={() => setOnlyCheap(!onlyCheap)}>
          {onlyCheap ? "Todos los precios" : "Menos de 15 €"}
        </Button>
      </div>

    </main>
  )
}

export default App
