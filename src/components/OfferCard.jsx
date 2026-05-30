import { motion } from "framer-motion";
import PremiumButton from "./PremiumButton";

export default function OfferCard({ offer, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="glass-panel premium-ring overflow-hidden rounded-3xl transition hover:-translate-y-2"
    >
      <div className="aspect-[4/3] overflow-hidden bg-robot-navy">
        <img src={offer.image} alt={offer.title} loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
      </div>
      <div className="p-7">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-robot-gold">{offer.price}</p>
        <h3 className="mt-4 font-display text-2xl font-bold text-white">{offer.title}</h3>
        <p className="mt-4 leading-7 text-robot-muted">{offer.description}</p>
        <PremiumButton as="a" href={offer.href || offer.cta?.href || "/offers"} variant="secondary" className="mt-6 px-5 py-3">
          {offer.cta}
        </PremiumButton>
      </div>
    </motion.article>
  );
}
