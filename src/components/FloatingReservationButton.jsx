import { CalendarCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function FloatingReservationButton() {
  return (
    <NavLink
      to="/reservations"
      className="focus-ring fixed bottom-6 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-robot-blue px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:-translate-y-1 hover:bg-[#2d96ff]"
    >
      <CalendarCheck className="h-5 w-5" />
      <span className="hidden sm:inline">Reserve</span>
    </NavLink>
  );
}
