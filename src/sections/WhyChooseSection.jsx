import { Bot, ConciergeBell, Headphones, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";

const features = [
  {
    icon: Bot,
    title: "Innovative Dining Experience",
    description: "A unique blend of culinary artistry and cutting-edge technology.",
  },
  {
    icon: ConciergeBell,
    title: "Exceptional Cuisine",
    description: "International dishes and bistro favorites crafted with premium ingredients.",
  },
  {
    icon: ShoppingBag,
    title: "Online Ordering",
    description: "A familiar, easy ordering journey designed for speed and convenience.",
  },
  {
    icon: Headphones,
    title: "Customer Service Excellence",
    description: "Personalized dining, event support, and attentive hospitality from start to finish.",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="luxury-surface px-5 py-24 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="section-kicker">Why guests return</span>
        </div>
        <SectionHeading title="Why Choose Robot Cafe" subtitle="The same reasons guests already love the brand, elevated with a premium digital presentation." />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="glass-panel premium-card-hover rounded-3xl p-8 text-center transition hover:-translate-y-2 hover:border-robot-blue/50"
            >
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-robot-blue text-white shadow-glow">
                <Icon className="h-10 w-10" />
              </div>
              <h3 className="mt-8 font-display text-2xl font-bold text-white">{title}</h3>
              <p className="mt-5 leading-7 text-robot-muted">{description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
