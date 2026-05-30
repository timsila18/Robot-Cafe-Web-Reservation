import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ theme, onToggle }) {
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={onToggle}
      className="focus-ring inline-flex items-center gap-2 rounded-full border border-robot-blue/40 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-white transition hover:border-robot-blue hover:bg-robot-blue/20 light:border-slate-200 light:bg-white light:text-slate-900 light:shadow-sm"
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
    >
      {isLight ? <Moon className="h-4 w-4 text-robot-blue" /> : <Sun className="h-4 w-4 text-robot-gold" />}
      {isLight ? "Dark" : "Light"}
    </button>
  );
}
