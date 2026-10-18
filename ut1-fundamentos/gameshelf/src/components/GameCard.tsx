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
    <article className="flex flex-col gap-1.5 p-5 bg-surface border border-border rounded-xl shadow-card transition duration-200 hover:-translate-y-1 hover:border-accent">
      <h2 className="mb-2 text-[1.15rem] font-bold text-text-h">{title}</h2>
      <p>Género: {genre}</p>
      <p>Precio: {price} €</p>
      {/* mt-auto empuja la etiqueta al fondo de la tarjeta */}
      <p
        className={`mt-auto self-start px-2.5 py-1 rounded-full text-[0.85rem] font-semibold ${
          available ? "text-success bg-success-bg" : "text-danger bg-danger-bg"
        }`}
      >
        {available ? "Disponible" : "No disponible"}
      </p>
    </article>
  );
}
