import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "../config/site";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";

export default function HeaderTopBar({ theme, onToggleTheme }) {
  const branchSummary = "Lana Plaza | Imaara Mall, Mombasa Road";
  const phoneSummary = siteConfig.branches.map((branch) => `${branch.shortName}: ${branch.phone}`).join(" | ");
  const items = [
    { icon: Mail, label: "Email:", text: siteConfig.email },
    { icon: MapPin, label: "Branches", text: branchSummary },
    { icon: Phone, label: "Call Us:", text: phoneSummary },
    { icon: Clock, label: "Open Hours:", text: siteConfig.openingHours },
  ];

  return (
    <div className="hidden border-b border-white/10 bg-[#020914] text-white lg:block light:border-slate-200 light:bg-white light:text-robot-night">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-7">
        <a href="/" className="shrink-0" aria-label="Robot Cafe home">
          <BrandLogo plain imageClassName="h-14" />
        </a>
        <div className="grid flex-1 grid-cols-4 gap-6">
          {items.map(({ icon: Icon, label, text }) => (
            <div key={text} className="flex min-w-0 items-center gap-4 border-l border-white/10 pl-6 first:border-l-0 first:pl-0 light:border-slate-200">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-robot-blue text-robot-blue">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-lg font-extrabold leading-tight">{label}</span>
                <span className="block text-sm leading-6 text-robot-muted light:text-slate-600">{text}</span>
              </span>
            </div>
          ))}
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </div>
  );
}
