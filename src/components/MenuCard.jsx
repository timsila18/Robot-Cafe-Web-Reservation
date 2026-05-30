import { motion } from "framer-motion";

export default function MenuCard({ item, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-2 hover:border-robot-blue/50"
    >
      <div className="aspect-[4/3] overflow-hidden bg-robot-navy">
        <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-bold text-white">{item.title}</h3>
          <span className="shrink-0 text-sm font-bold text-robot-gold">{item.price}</span>
        </div>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-robot-blue">{item.category}</p>
        <p className="mt-4 leading-7 text-robot-muted">{item.description}</p>
      </div>
    </motion.article>
  );
}
