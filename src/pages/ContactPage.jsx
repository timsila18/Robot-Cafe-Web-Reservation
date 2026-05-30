import { Mail, MapPin, Phone } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { siteConfig } from "../config/site";

export default function ContactPage() {
  return (
    <section className="px-5 py-24 lg:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeading title="Contact Robot Cafe & Bistro" subtitle="Questions, events, table requests, and guest support remain easy to find." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: Phone, label: "Phone", value: siteConfig.phone },
            { icon: Mail, label: "Email", value: siteConfig.email },
            { icon: MapPin, label: "Location", value: siteConfig.address },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass-panel rounded-3xl p-7 text-center">
              <Icon className="mx-auto h-6 w-6 text-robot-gold" />
              <h2 className="mt-4 font-display text-xl font-bold text-white">{label}</h2>
              <p className="mt-2 text-robot-muted">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
