import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export default function PremiumButton({ children, variant = "primary", className = "", as = "button", ...props }) {
  const Component = motion[as] || motion.button;
  const variants = {
    primary: "bg-robot-blue text-white shadow-glow hover:bg-[#2d96ff]",
    secondary: "border border-robot-silver/20 bg-white/5 text-white hover:border-robot-blue/70 hover:bg-white/10",
    gold: "bg-robot-gold text-robot-night shadow-gold hover:bg-[#e4c653]",
  };

  return (
    <Component
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] transition",
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
