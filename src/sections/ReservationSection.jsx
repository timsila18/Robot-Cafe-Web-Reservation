import ReservationForm from "../components/ReservationForm";
import SectionHeading from "../components/SectionHeading";
import { CalendarClock, Pencil, ShieldCheck, XCircle } from "lucide-react";
import { siteConfig } from "../config/site";

export default function ReservationSection() {
  const actions = [
    { icon: Pencil, title: "Modify Reservation", text: "Update guest count, date, time, or guest details.", href: "/reservations/modify" },
    { icon: XCircle, title: "Cancel Reservation", text: "Request cancellation for an existing booking.", href: "/reservations/cancel" },
    { icon: ShieldCheck, title: "View Reservation Status", text: "Check confirmation progress using your booking number.", href: "/reservations/status" },
  ];

  return (
    <section id="reservations" className="overflow-hidden px-5 py-24 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <SectionHeading align="left" title="Reservations" subtitle="Select guests, date, and time first, then provide your details, matching the booking flow guests already know." />
        </div>
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          {siteConfig.branches.map((branch) => (
            <div key={branch.id} className="luxury-border rounded-3xl p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-robot-gold">Robot Cafe branch</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-white">{branch.shortName}</h2>
              <p className="mt-2 text-robot-muted">{branch.address}</p>
            </div>
          ))}
        </div>
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {actions.map(({ icon: Icon, title, text, href }) => (
            <a key={title} href={href} className="glass-panel rounded-3xl p-5 transition hover:-translate-y-1 hover:border-robot-blue/50">
              <Icon className="h-6 w-6 text-robot-blue" />
              <h2 className="mt-4 font-display text-xl font-bold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-robot-muted">{text}</p>
            </a>
          ))}
        </div>
        <div className="mb-8 rounded-3xl border border-robot-gold/20 bg-robot-gold/10 p-5 text-robot-silver">
          <CalendarClock className="h-6 w-6 text-robot-gold" />
          <p className="mt-3 text-sm font-semibold">
            For urgent table support, use the floating WhatsApp button or call Lana Plaza on 0769 30 30 30 or Imaara Mall on 0140 30 30 30.
          </p>
        </div>
        <ReservationForm />
      </div>
    </section>
  );
}
