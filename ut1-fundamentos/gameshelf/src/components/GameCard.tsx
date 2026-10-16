import "./GameCard.css";

type GameCardProps = {
  title: string;
  genre: string;
  price: number;
  available: boolean;
};

export default function GameCard({
  title,
  genre,
  price,
  available,
}: GameCardProps) {
  return (
    <article className="card">
      <h2>{title}</h2>
      <p>Género: {genre}</p>
      <p>Precio: {price} €</p>
      <p className={available ? "status available" : "status unavailable"}>
        {available ? "Disponible" : "No disponible"}
      </p>
    </article>
  );
}