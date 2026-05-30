import { Instagram, Mail, MapPin, Music2, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";
import { siteConfig } from "../config/site";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-robot-night">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 lg:grid-cols-[1.15fr_0.9fr_0.9fr_1.1fr] lg:px-6">
        <div>
          <BrandLogo imageClassName="h-12" />
          <p className="mt-4 max-w-md leading-8 text-white">
            <strong>RobotCafe</strong> - Where cutting-edge technology meets warm hospitality for a seamless dining experience at Lana Plaza, Oloitoktok Rd, Kileleshwa.
          </p>
          <div className="mt-8 flex gap-3">
            <a className="grid h-11 w-11 place-items-center rounded-full bg-white text-robot-blue" href="#" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a className="grid h-11 w-11 place-items-center rounded-full bg-white text-robot-blue" href="#" aria-label="TikTok">
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
              <NavLink key={item.path} to={item.path} className="bg-white px-6 py-4 text-robot-night transition hover:bg-robot-blue hover:text-white">
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
              <NavLink key={item.path} to={item.path} className="bg-white px-6 py-4 text-robot-night transition hover:bg-robot-blue hover:text-white">
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-display text-3xl font-bold text-white">Contact us</h3>
          <div className="mt-8 grid gap-5 text-white">
            <span className="flex items-center gap-3"><MapPin className="h-5 w-5 text-white" />{siteConfig.address}</span>
            <span className="flex items-center gap-3"><Phone className="h-5 w-5 text-white" />{siteConfig.phone}</span>
            <span className="flex items-center gap-3"><Mail className="h-5 w-5 text-white" />{siteConfig.email}</span>
            <p className="pt-5 font-extrabold text-robot-gold">Open Hours:</p>
            <p>{siteConfig.openingHours}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-robot-muted">
        © 2026 Robot Cafe & Bistro. Premium evolution foundation.
      </div>
    </footer>
  );
}
