import { motion } from "framer-motion";

export default function SectionHeading({ title, subtitle, align = "center" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={align === "left" ? "max-w-3xl" : "mx-auto max-w-3xl text-center"}
    >
      <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {subtitle ? <p className="mt-5 text-base leading-8 text-robot-muted sm:text-lg">{subtitle}</p> : null}
    </motion.div>
  );
}
