import { Mail, MapPin, Phone } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { siteConfig } from "../config/site";

export default function ContactPage() {
  return (
    <section className="px-5 py-24 lg:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeading title="Contact Robot Cafe" subtitle="Questions, events, table requests, and guest support remain easy to find across both branches." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: Phone, label: "Phone", value: siteConfig.branches.map((branch) => `${branch.shortName}: ${branch.phone}`).join(" | ") },
            { icon: Mail, label: "Email", value: siteConfig.email },
            { icon: MapPin, label: "Branches", value: siteConfig.branches.map((branch) => `${branch.shortName}: ${branch.address}`).join(" | ") },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass-panel rounded-3xl p-7 text-center">
              <Icon className="mx-auto h-6 w-6 text-robot-gold" />
              <h2 className="mt-4 font-display text-xl font-bold text-white">{label}</h2>
              <p className="mt-2 text-robot-muted">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {siteConfig.branches.map((branch) => (
            <div key={branch.id} className="glass-panel rounded-3xl p-7">
              <MapPin className="h-6 w-6 text-robot-gold" />
              <h2 className="mt-4 font-display text-2xl font-bold text-white">{branch.name}</h2>
              <p className="mt-2 text-robot-muted">{branch.address}</p>
              <p className="mt-3 font-display text-xl font-bold text-white">{branch.phone}</p>
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-robot-blue">{branch.reservationRoutingLabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
