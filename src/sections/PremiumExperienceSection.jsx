import { CalendarCheck, Crown, Martini, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import PremiumButton from "../components/PremiumButton";

const moments = [
  {
    icon: Sparkles,
    title: "Robot-led wonder",
    text: "A memorable dining atmosphere built around technology, hospitality, and theatre.",
  },
  {
    icon: Martini,
    title: "Bistro craft",
    text: "Signature plates, polished drinks, desserts, and seasonal menus managed from one content system.",
  },
  {
    icon: CalendarCheck,
    title: "Effortless booking",
    text: "The familiar two-step reservation journey remains direct, visible, and easy to complete.",
  },
];

export default function PremiumExperienceSection() {
  return (
    <section className="luxury-surface border-y border-white/10 bg-[#06101c]/80 px-5 py-16 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="gold-line mb-12" />
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="soft-spotlight luxury-border rounded-[2rem] p-8 lg:p-10"
          >
            <span className="inline-flex items-center gap-3 rounded-full border border-robot-gold/30 bg-robot-gold/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-robot-gold">
              <Crown className="h-4 w-4" />
              Premium Robot Cafe
            </span>
            <h2 className="mt-7 font-display text-4xl font-black leading-tight text-white lg:text-5xl">
              A futuristic dining room that still feels personal.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-robot-muted">
              The website now behaves like the restaurant should feel: cinematic, clear, elegant, and designed to move guests from curiosity to reservation without friction.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <PremiumButton as="a" href="/reservations" variant="gold">
                Reserve Now
              </PremiumButton>
              <PremiumButton as="a" href="/menu" variant="secondary">
                Explore Menu
              </PremiumButton>
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {moments.map(({ icon: Icon, title, text }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="glass-panel premium-card-hover rounded-[2rem] p-7 transition hover:-translate-y-2"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-robot-blue text-white shadow-glow">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-7 font-display text-2xl font-bold text-white">{title}</h3>
                <p className="mt-4 leading-7 text-robot-muted">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
