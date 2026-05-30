import { motion } from "framer-motion";
import PremiumButton from "../components/PremiumButton";
import SectionHeading from "../components/SectionHeading";
import { getMedia } from "../services/mediaService";

export default function AboutPreviewSection() {
  return (
    <section id="about-preview" className="border-y border-white/10 bg-robot-navy/72 px-5 py-24 lg:px-6 light:border-slate-200 light:bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <SectionHeading align="left" title="A Modern Cafe With a Human Heart" subtitle="Robot Cafe & Bistro blends cutting-edge service technology with warm hospitality, exceptional food, and a memorable dining atmosphere." />
          <p className="mt-7 leading-8 text-robot-muted">
            From everyday coffee moments to birthdays, family meals, and premium dinner reservations, the experience stays simple, welcoming, and unmistakably Robot Cafe.
          </p>
          <PremiumButton as="a" href="/about-us" className="mt-8">
            About Us
          </PremiumButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="premium-ring rounded-[2rem]"
        >
          <img
            src={getMedia("robot-cafe/about/premium-cafe-interior", "dining")}
            alt="Premium Robot Cafe interior"
            loading="lazy"
            className="aspect-[5/4] w-full rounded-[2rem] object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
