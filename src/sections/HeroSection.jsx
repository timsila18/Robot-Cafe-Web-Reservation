import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import PremiumButton from "../components/PremiumButton";
import heroImage from "../assets/hero/robot-cafe-cinematic-hero.jpg";

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={heroImage} alt="" className="h-full w-full object-cover object-[68%_center] opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-r from-robot-night via-robot-night/72 to-robot-night/18" />
        <div className="absolute inset-0 bg-gradient-to-b from-robot-night/0 via-robot-night/8 to-robot-night/82" />
      </div>

      <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 py-16 lg:min-h-[780px] lg:grid-cols-[0.82fr_1fr] lg:px-6">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.55em] text-robot-silver [text-shadow:0_4px_24px_rgba(0,0,0,0.8)]">
            Welcome to
          </p>
          <h1 className="font-display text-5xl font-extrabold leading-[0.94] tracking-tight text-white [text-shadow:0_8px_40px_rgba(0,0,0,0.75)] sm:text-7xl lg:text-8xl">
            ROBOT CAFE <span className="block text-robot-blue">& BISTRO</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-robot-silver [text-shadow:0_4px_24px_rgba(0,0,0,0.8)]">
            Experience the future of dining where innovation meets exceptional cuisine.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <PremiumButton as="a" href="/menu" variant="gold" className="sm:min-w-72">
              Order Online
            </PremiumButton>
            <PremiumButton as="a" href="/reservations" className="sm:min-w-72">
              Make Reservation
            </PremiumButton>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 36, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.12 }}
          className="premium-ring hidden overflow-hidden rounded-[2rem] border border-robot-blue/30 bg-robot-night/50 p-3 shadow-glow backdrop-blur lg:block"
        >
          <img
            src={heroImage}
            alt="Robot Cafe futuristic dining experience"
            className="aspect-[4/3] w-full rounded-[1.5rem] object-cover object-[72%_center]"
          />
        </motion.div>
      </div>

      <a href="#offers" className="focus-ring absolute bottom-5 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/15 p-3 text-white/70 transition hover:text-white lg:block" aria-label="Scroll to offers">
        <ChevronDown />
      </a>
    </section>
  );
}
