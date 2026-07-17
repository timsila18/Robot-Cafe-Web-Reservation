import { Menu, Share2, UserRoundCog, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { siteConfig } from "../config/site";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";

export default function MainNavbar({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#050505] shadow-2xl light:bg-white light:shadow-lg">
      <nav className="mx-auto flex max-w-7xl items-stretch justify-between px-4 sm:px-5 lg:px-6" aria-label="Main navigation">
        <NavLink to="/" className="flex min-w-0 items-center gap-3 py-4 lg:hidden">
          <BrandLogo imageClassName="h-9 max-w-[138px] min-[380px]:max-w-[160px] sm:h-12 sm:max-w-[230px]" />
        </NavLink>

        <div className="hidden items-stretch lg:flex">
          {siteConfig.navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `grid place-items-center px-8 py-7 text-base font-extrabold transition hover:bg-robot-blue hover:text-white ${
                  isActive ? "bg-robot-blue text-white" : "text-white light:text-slate-950"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-stretch lg:flex">
          <NavLink
            to="/my-account"
            className={({ isActive }) =>
              `focus-ring grid w-14 place-items-center border-l border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white light:text-slate-700 ${
                isActive ? "bg-white/10 text-white light:bg-slate-100" : ""
              }`
            }
            aria-label="Staff account"
            title="Staff account"
          >
            <UserRoundCog className="h-5 w-5" />
          </NavLink>
          <button className="focus-ring grid w-20 place-items-center bg-[#0d5788] text-white" aria-label="Share Robot Cafe">
            <Share2 className="h-6 w-6" />
          </button>
          <NavLink to="/reservations" className="grid place-items-center bg-robot-blue px-8 text-lg font-extrabold text-white transition hover:bg-[#2d96ff]">
            Make a reservation
          </NavLink>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:hidden">
          <NavLink
            to="/reservations"
            className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-robot-blue px-4 text-xs font-black uppercase tracking-[0.12em] text-white shadow-glow transition hover:bg-[#2d96ff] sm:px-5"
          >
            <span className="sm:hidden">Reserve</span>
            <span className="hidden sm:inline">Make reservation</span>
          </NavLink>
          <div className="hidden sm:block">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
          <button className="focus-ring rounded-full p-2.5 text-white light:text-slate-950" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-[#0b0b0b] px-5 py-4 light:bg-white lg:hidden">
          <div className="grid gap-2">
            {siteConfig.navItems.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-robot-blue">
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/reservations" onClick={() => setOpen(false)} className="rounded-xl bg-robot-blue px-4 py-3 text-sm font-bold text-white">
              Make a reservation
            </NavLink>
            <NavLink to="/my-account" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/60 hover:bg-white/10 hover:text-white">
              Staff login
            </NavLink>
            <div className="pt-2 sm:hidden">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
