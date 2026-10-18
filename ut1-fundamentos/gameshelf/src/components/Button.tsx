import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      className="px-6 py-2.5 font-semibold text-on-accent bg-accent rounded-full cursor-pointer transition duration-200 hover:brightness-90 active:scale-97"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
