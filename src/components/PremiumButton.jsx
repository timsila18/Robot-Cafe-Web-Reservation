import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export default function PremiumButton({ children, variant = "primary", className = "", as = "button", ...props }) {
  const Component = motion[as] || motion.button;
  const variants = {
    primary: "bg-robot-blue text-white shadow-glow hover:bg-[#2d96ff] hover:shadow-[0_24px_90px_rgba(10,132,255,0.36)]",
    secondary: "border border-robot-silver/20 bg-white/5 text-white hover:border-robot-blue/70 hover:bg-white/10 hover:shadow-glow",
    gold: "bg-gradient-to-r from-robot-gold via-[#f1d66f] to-robot-gold text-robot-night shadow-gold hover:shadow-[0_24px_90px_rgba(212,175,55,0.3)]",
  };

  return (
    <Component
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-black uppercase tracking-[0.14em] transition",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Component>
  );
}
