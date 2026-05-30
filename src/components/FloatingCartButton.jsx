import { ShoppingBasket } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function FloatingCartButton() {
  return (
    <NavLink
      to="/menu"
      className="focus-ring fixed bottom-6 right-5 z-50 grid h-16 w-16 place-items-center rounded-full bg-white text-robot-blue shadow-gold transition hover:-translate-y-1"
      aria-label="View cart and order online"
    >
      <span className="absolute -left-2 -top-2 grid h-9 w-9 place-items-center rounded-full bg-robot-blue text-sm font-extrabold text-white">
        0
      </span>
      <ShoppingBasket className="h-7 w-7" />
    </NavLink>
  );
}
