import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "../config/site";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";

export default function HeaderTopBar({ theme, onToggleTheme }) {
  const branchSummary = "Lana Plaza | Imaara Mall";
  const phoneSummary = siteConfig.branches.map((branch) => `${branch.shortName}: ${branch.phone}`).join("  |  ");
  const items = [
    { icon: Mail, label: "Email:", text: siteConfig.email },
    { icon: MapPin, label: "Branches", text: branchSummary },
    { icon: Phone, label: "Call Us:", text: phoneSummary },
    { icon: Clock, label: "Open Hours:", text: siteConfig.openingHours },
  ];

  return (
    <div className="hidden border-b border-white/10 bg-[#020914] text-white lg:block light:border-slate-200 light:bg-white light:text-robot-night">
      <div className="mx-auto grid w-full max-w-[1660px] grid-cols-[minmax(320px,390px)_repeat(4,minmax(0,1fr))_auto] items-center gap-7 px-8 py-6 2xl:px-10">
        <a href="/" className="flex min-w-0 justify-start" aria-label="Robot Cafe home">
          <BrandLogo imageClassName="h-16 max-w-[360px] xl:h-[4.6rem]" />
        </a>
        {items.map(({ icon: Icon, label, text }) => (
          <div key={text} className="flex min-w-0 items-center gap-3 border-l border-white/10 pl-5 light:border-slate-200">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-robot-blue text-robot-blue">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-extrabold leading-tight">{label}</span>
              <span className="block break-words text-sm leading-6 text-robot-muted light:text-slate-600">{text}</span>
            </span>
          </div>
        ))}
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </div>
  );
}
