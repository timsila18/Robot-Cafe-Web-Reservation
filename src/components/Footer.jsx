import { Instagram, Mail, MapPin, Music2, Phone, Send } from "lucide-react";
import { NavLink } from "react-router-dom";
import { siteConfig } from "../config/site";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-robot-night">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr_0.85fr_1fr_1.05fr] lg:px-6">
        <div>
          <BrandLogo imageClassName="h-12" />
          <p className="mt-4 max-w-md leading-8 text-white">
            <strong>Robot Cafe</strong> - Where cutting-edge technology meets warm hospitality across Lana Plaza and Imaara Mall.
          </p>
          <div className="mt-8 flex gap-3">
            <a className="grid h-11 w-11 place-items-center rounded-full bg-white text-robot-blue transition hover:bg-robot-blue hover:text-white" href="#" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a className="grid h-11 w-11 place-items-center rounded-full bg-white text-robot-blue transition hover:bg-robot-blue hover:text-white" href="#" aria-label="TikTok">
              <Music2 className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-display text-3xl font-bold text-white">Restaurant</h3>
          <div className="mt-6 grid gap-4">
            {[
              { label: "Our Menu", path: "/menu" },
              { label: "Make a reservation", path: "/reservations" },
              { label: "Reviews", path: "/reviews" },
            ].map((item) => (
              <NavLink key={item.path} to={item.path} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white transition hover:border-robot-blue hover:bg-robot-blue">
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-display text-3xl font-bold text-white">Quick Links</h3>
          <div className="mt-6 grid gap-4">
            {[
              { label: "Home", path: "/" },
              { label: "About us", path: "/about-us" },
              { label: "Contact us", path: "/contact" },
            ].map((item) => (
              <NavLink key={item.path} to={item.path} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white transition hover:border-robot-blue hover:bg-robot-blue">
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-display text-3xl font-bold text-white">Contact us</h3>
          <div className="mt-8 grid gap-5 text-white">
            <span className="flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-robot-blue" />{siteConfig.branches.map((branch) => `${branch.shortName}: ${branch.address}`).join(" | ")}</span>
            <span className="flex items-center gap-3"><Phone className="h-5 w-5 text-robot-blue" />{siteConfig.phone}</span>
            <span className="flex items-center gap-3"><Mail className="h-5 w-5 text-robot-blue" />{siteConfig.email}</span>
            <p className="pt-5 font-extrabold text-robot-gold">Open Hours:</p>
            <p>{siteConfig.openingHours}</p>
          </div>
        </div>
        <div>
          <h3 className="font-display text-3xl font-bold text-white">Newsletter</h3>
          <p className="mt-6 leading-7 text-robot-muted">
            Subscribe for seasonal menus, member-only offers, and holiday dining announcements.
          </p>
          <form className="mt-6 flex overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <label className="sr-only" htmlFor="footer-email">Email address</label>
            <input id="footer-email" type="email" placeholder="Enter your email" className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-robot-muted" />
            <button type="button" className="grid w-14 place-items-center bg-robot-blue text-white" aria-label="Subscribe">
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-robot-muted">
        &copy; 2026 Robot Cafe. Premium evolution foundation.
      </div>
    </footer>
  );
}
